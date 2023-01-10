import fs from "fs";
import Constants from "../utils/constants";
import XMLParser from "../utils/xml-parser";
import Downloader from "../utils/downloader";
import { getEnumKeyByEnumValue } from "../utils/common";
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

  private determineKanaType = (reading: string): KanaType | KanaType[] => {
    let kanaType: KanaType | KanaType[];

    const containsHiragana = Constants.hiraganaRegex.test(reading);
    const containsKatakana = Constants.katakanaRegex.test(reading);

    containsHiragana && containsKatakana
      ? (kanaType = [KanaType.Hiragana, KanaType.Katakana])
      : containsHiragana
      ? (kanaType = KanaType.Hiragana)
      : containsKatakana
      ? (kanaType = KanaType.Katakana)
      : null;

    return kanaType!;
  };

  private parseFrequencyRating = (rating: string): FrequencyRating | string => {
    const frequencyRating: FrequencyRating | null = getEnumKeyByEnumValue(
      FrequencyRating,
      rating
    ) as FrequencyRating | null;

    switch (frequencyRating) {
      case null:
        return rating as string;
      default:
        return frequencyRating;
    }
  };

  // During parsing to JSON, multiple <r_ele> are compiled into one; each item in array is a seperated IReadingElement.
  private parseReadingElements = (
    r_ele: [
      {
        [x: string]: any;
      }
    ]
  ): IReadingElement[] => {
    const readingElements: IReadingElement[] = [];

    r_ele.forEach((element: { [reb: string]: string[] }) => {
      const reb: string = element.reb[0];

      const reading: IJapaneseReading = {
        reading: reb,
        kanaType: this.determineKanaType(reb),
      };

      const readingInfo: ReadingInfo[] = element.re_inf.map((info: string) => {
        return getEnumKeyByEnumValue(ReadingInfo, info) as ReadingInfo;
      });

      const frequencyRatings: (FrequencyRating | string)[] = element.re_pri.map(
        (rating: string) => this.parseFrequencyRating(rating)
      );

      readingElements.push({
        reading: reading,
        isTrueKanjiReading: element.hasOwnProperty("re_nokanji"),
        subsetOfNonKanaReadings: element.re_restr,
        readingInfo: readingInfo,
        frequencyRating: frequencyRatings,
      });
    });

    return readingElements;
  };

  private parseSenseElements = (objects: [{ [x: string]: any }]): ISense[] => {
    const sense: ISense[] = [];

    objects.forEach((object: { [x: string]: any }) => {
      const partOfSpeech: PartOfSpeech | null = getEnumKeyByEnumValue(
        PartOfSpeech,
        object.pos
      ) as PartOfSpeech;

      // If English, a singular string will be present in list.
      const glossary: ITranslation | ITranslation[] =
        object.gloss.length < 2
          ? {
              language: Language.English,
              relativeCommonality: 0,
              translation: object.gloss[0],
            }
          : [];

      if (typeof glossary !== "object") {
        for (let i = 0; i < object.gloss.length; i++) {
          // TODO: Process other languages...
        }
      }
    });

    return sense;
  };

  private parseKanjiElements = (
    k_ele: [
      {
        [x: string]: any;
      }
    ]
  ): IKanjiElement[] => {
    const kanjiElements: IKanjiElement[] = [];
    return kanjiElements;
  };

  private parseEntry = (object: { [x: string]: any }): IEntry => {
    // TODO: Utilize above functions to form an IEntry object from a JSON object.
    const entry: IEntry = {
      // ent_seq = ["1000000"]
      id: parseInt(object.ent_seq[0] as string),
      readingElements: this.parseReadingElements(object.r_ele),
      senseElements: [],
    };

    return entry;
  };
}

export default JMdict;
