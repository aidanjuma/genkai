/*
Attempt at implementing & re-documenting the following:
- http://www.edrdg.org/jmdict/jmdict_dtd_h.html
*/

export interface IEntry {
  // ent_seq - a unique number ID for each entry.
  id: number;

  /*
   * Reading Element(s): at lease one per entry.
   * Contains reading in kana, and some tags including
   * some status data or characteristics.
   */
  readingElements: IReadingElement[];

  /*
   * Sense Element(s): at lease one per entry.
   * Contains data such as translational equivalents,
   * part-of-speech data, field of application,
   * & other miscellaneous data.
   */
  senseElements: ISense[];

  /*
   * Kanji Element(s): not required.
   * The defining component of each entry (or reading element).
   */
  kanjiElements?: IKanjiElement[];
}

// TODO: Expand on IReadingElement.
export interface IReadingElement {
  // Reading of word/phrase in kana.
  reading: string;

  /*
   * re_nokanji => isTrueReading: false if this reading
   * cannot be regarded as a true reading of a linked
   * kanji.
   */
  isTrueReading: boolean;

  /*
   * re_restr => subsetOfNonKanaReadings: this element is
   * used to indicate when the reading only applies to a
   * a specific subset of non-kana elements within an entry.
   */
  subsetOfNonKanaReadings?: string[];
}

// TODO: Expand on IKanjiElement.
export interface IKanjiElement {}

// TODO: Expand on ISense.
export interface ISense {
  inEnglish?: ITranslation[];
  inGerman?: ITranslation[];
  inFrench?: ITranslation[];
  inRussian?: ITranslation[];
  inSpanish?: ITranslation[];
  inHungarian?: ITranslation[];
  inSlovenian?: ITranslation[];
  inDutch?: ITranslation[];
}

export interface ITranslation {
  // Language to which word/phrase is translated to.
  language: string;
  // Word/phrase translation from Japanese.
  translation: string;
  // <gloss> tags are ordered ascendingly by usage frequency.
  relativeCommonality: number;
}

// xml:lang="xyz" => English is default, so not shown in <gloss> tags.
export enum Language {
  English = "eng",
  German = "ger",
  French = "fre",
  Russian = "rus",
  Spanish = "spa",
  Hungarian = "hun",
  Slovenian = "slv",
  Dutch = "dut",
}
