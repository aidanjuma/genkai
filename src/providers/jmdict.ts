import XMLParser from "@utils/xml-parser";
import Downloader from "@utils/downloader";
import Constants from "@utils/constants";
import { BaseParser } from "@models/index";
import {
  IProviderInfo,
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
} from "@models/index";

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

  public override downloadAndParseSource = async (): Promise<void> => {
    // First, download the file.
    await this.downloader.downloadFile();

    // Then, parse to JSON format/file.
    await this.xmlParser.parse();

    // Once parsed, remove .xml data file from downloads.
    Downloader.cleanupDownloads();
  };
}

export default JMdict;
