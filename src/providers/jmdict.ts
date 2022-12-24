import { BaseParser } from "@models/index";
import Downloader from "@utils/downloader";
import XMLParser from "@utils/xml-parser";
import {
  IProviderInfo,
  IEntry,
  IJapaneseReading,
  IReadingElement,
  IKanjiElement,
  ISense,
  ITranslation,
  IRestrictLexeme,
  IFile,
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
  SourceUrl,
  FileType,
} from "@models/index";

class JMdict extends BaseParser {
  override readonly name = "JMdict";
  override readonly sourceUrl = SourceUrl.JMdict;
  private readonly fileType = FileType.XML;

  protected override downloader = new Downloader(
    this.sourceUrl,
    this.name,
    this.fileType
  );

  override downloadAndParseSource = async (): Promise<void> => {};
}

export default JMdict;
