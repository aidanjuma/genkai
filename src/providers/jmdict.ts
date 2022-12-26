import fs from "fs";
import XMLParser from "../utils/xml-parser";
import Downloader from "../utils/downloader";
import Constants from "../utils/constants";
import {
  BaseParser,
  IEntry,
  IJapaneseReading,
  IReadingElement,
  IKanjiElement,
  ISense,
  ITranslation,
  IRestrictLexeme,
  Language,
  Dialect,
  Field,
  FrequencyRating,
  Miscellaneous,
  PartOfSpeech,
  ReadingInfo,
  KanjiInfo,
  KanaType,
  EntryType,
  FileType,
} from "../models/index";

class JMdict extends BaseParser {
  override readonly name = "JMdict";
  override readonly sourceUrl = Constants.sourceUrls.JMdict;
  private readonly fileType = FileType.XML;

  protected override downloader: Downloader = new Downloader(
    this.sourceUrl,
    this.name,
    this.fileType
  );

  // Where the source file's download location is.
  protected xmlParser: XMLParser = new XMLParser(
    this.downloader.destinationFile
  );

  public override downloadAndParseSource = async (): Promise<IEntry[]> => {
    // First, download the file.
    await this.downloader.downloadFile();

    // Then, parse to JSON format/file.
    await this.xmlParser.parse();

    // Once parsed, remove .xml data file from downloads.
    Downloader.cleanupDownloads();

    // Read the JSON file returned by xmlParser, convert to JSON object for processing.
    const objects: [{ [x: string]: unknown }] = JSON.parse(
      fs.readFileSync(this.xmlParser.destinationFile.filePath, "utf-8")
    );

    const entries: IEntry[] = [];
    for (let i = 0; i < objects.length; i++) {
      const entry: IEntry | undefined = this.parseEntry(objects[i]);
      entries.push(entry);
    }

    return entries;
  };

  // TODO: Currently, only added basic structure to functions. Expand on this!
  // TODO: Other data types' parsing functions, such as IKanjiElement, IRestrictLexeme etc.

  private parseReadingElement = (object: {
    [x: string]: any;
  }): IReadingElement => {
    const readingElement: IReadingElement = {
      reading: {
        reading: "",
        kanaType: KanaType.Hiragana,
      },
      isTrueReading: false,
    };

    return readingElement;
  };

  private parseSense = (object: { [x: string]: any }): ISense => {
    const sense: ISense = {};
    return sense;
  };

  private parseEntry = (object: { [x: string]: any }): IEntry => {
    // TODO: Utilize above functions to form an IEntry object from a JSON object.
    const entry: IEntry = {
      // ent_seq = ["1000000"]
      id: parseInt(object.ent_seq[0] as string),
      readingElements: [],
      senseElements: [],
    };

    return entry;
  };
}

export default JMdict;
