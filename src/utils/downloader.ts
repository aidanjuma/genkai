import fs from "fs";
import path from "path";
import zlib from "zlib";
import axios from "axios";
import { SourceUrl } from "../models/types";

const { log } = console;

class Downloader {
  public date!: string;
  public fileName!: string;
  public fileUrl!: SourceUrl;
  public fileExtension?: string;
  public fileDestination!: string;
  private static readonly downloadsPath = path.join(
    __dirname,
    "..",
    "..",
    "downloads"
  );

  constructor(
    fileUrl: SourceUrl,
    fileName: string,
    fileExtension: string | undefined
  ) {
    this.fileUrl = fileUrl;
    this.fileExtension = fileExtension;
    this.date = this.getUTCDateString();
    this.sanitizeAndSetFileName(fileName);
  }

  // __ Public/Static Methods __ //

  public downloadFile = async (): Promise<void> => {
    // Sets legal file name to have destination in downloads folder:
    this.fileDestination = path.join(Downloader.downloadsPath, this.fileName);

    // Return if already exists, logging to console.
    const exists = fs.existsSync(this.fileDestination);
    if (exists) {
      log(
        `The file ${this.fileName} already exists. Please try again with another file!`
      );
      return;
    }

    // Download file!
    await this.fetchFileFromUrl();
  };

  static cleanupDownloads = (): void => {
    fs.readdir(this.downloadsPath, (err, files) => {
      if (err) {
        log(err);
        return;
      }

      // If not the README, delete.
      files.forEach(async (file) => {
        const dir = path.join(this.downloadsPath, file);
        if (file != "README.md") fs.unlinkSync(dir);
      });
    });
  };

  // __ Private Methods __  //

  /* Used to formulate a date string based on UTC time. */
  private getUTCDateString = (): string => {
    const date = new Date();

    if (this.fileUrl === SourceUrl.JMdict) {
      const hour: number = date.getUTCHours();
      const minute: number = date.getUTCMinutes();
      // If before 3:01am UTC, use previous date.
      !(hour >= 3 && minute >= 1) ? date.setDate(date.getDate() - 1) : null;
    }

    // Get each individual component of the full, human-readable date.
    const year: number = date.getUTCFullYear();
    const month: number = date.getUTCMonth();
    const day: number = date.getUTCDay();

    return `${year}-${month}-${day}`;
  };

  /* Removes illegal characters from file string (https://en.wikipedia.org/wiki/Filename#Reserved_characters_and_words). */
  private sanitizeAndSetFileName = (fileName: string): void => {
    const sanitized = `${fileName}-${this.date}.${this.fileExtension}`;
    this.fileName = sanitized.replace(/[/\\?%*:|"<>]/g, "");
  };

  /* Where the actual fetching of the file happens! 🌟 */
  private fetchFileFromUrl = async (): Promise<void> => {
    try {
      const { data } = await axios.get(this.fileUrl as string, {
        responseType: "arraybuffer",
      });

      // Decompress the downloaded gzip file:
      log("Decompressing file...");
      const decompressed = zlib.gunzipSync(data);

      // Save .xml file to specified location.
      fs.writeFileSync(this.fileDestination, decompressed, "utf8");
      log(`File ${this.fileName} has been saved @ ${this.fileDestination}`);
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };
}

export default Downloader;
