import fs from "fs";
import path from "path";
import zlib from "zlib";
import axios from "axios";
import Constants from "./constants";
import { FileType, IFile } from "../models/types";
import { FileAlreadyExistsException } from "./exceptions";

const { log } = console;

class Downloader {
  public destinationFile!: IFile;
  protected fileUrl!: string;
  private fileName!: string;
  private static readonly downloadsPath = path.join(
    __dirname,
    "..",
    "..",
    "downloads"
  );

  constructor(fileUrl: string, fileName: string, fileType: FileType) {
    this.fileUrl = fileUrl;

    const date = this.getUTCDateString();
    this.sanitizeAndSetFileName(fileName, fileType, date);

    // Sets legal file name to have destination in downloads folder:
    this.destinationFile = {
      fileType: fileType,
      filePath: path.join(Downloader.downloadsPath, fileName),
    };
  }

  public downloadFile = async (): Promise<void> => {
    // Return if already exists, logging to console.
    const exists = fs.existsSync(this.destinationFile.filePath);
    if (exists) {
      throw new FileAlreadyExistsException(this.destinationFile.filePath);
    }

    // Download file!
    await this.fetchFileFromUrl();
  };

  static cleanupDownloads = (): void => {
    const files = fs.readdirSync(this.downloadsPath, { withFileTypes: true });
    // If not the README, delete.
    files.forEach(async (file) => {
      const dir = path.join(this.downloadsPath, file.name);
      if (file.name != "README.md") fs.unlinkSync(dir);
    });
  };

  /* Used to formulate a date string based on UTC time. */
  private getUTCDateString = (): string => {
    const date = new Date();

    if (this.fileUrl === Constants.sourceUrls.JMdict) {
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
  private sanitizeAndSetFileName = (
    fileName: string,
    fileType: FileType,
    date: string
  ): void => {
    const sanitized = `${fileName}-${date}.${fileType as string}`;
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
      fs.writeFileSync(this.destinationFile.filePath, decompressed, "utf8");
      log(
        `File ${this.fileName} has been saved @ ${this.destinationFile.filePath}`
      );
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };
}

export default Downloader;
