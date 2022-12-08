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

  // <re_inf> entities mapped to enum.
  readingInfo?: ReadingInfo[];
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

/* Entity Mappings => Enums */

// <...xml:lang="xyz"> => English is assumed default.
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

// <dial> - i.e. Japanese Dialect of a word/phrase, such as Kyoto(-ben).
export enum Dialect {
  Brazilian = "bra",
  Hokkaido = "hob",
  Kansai = "ksb",
  Kantou = "ktb",
  Kyoto = "kyb",
  Kyuushuu = "kyu",
  Nagano = "nab",
  Osaka = "osb",
  Ryuukyuu = "rkb",
  Touhoku = "thb",
  Tosa = "tsb",
  Tsugaru = "tsug",
}

// <field> - i.e. Computing is "comp"; field of study/interest related to word/phrase.
export enum Field {
  Agriculture = "agric",
  Anatomy = "anat",
  Archeology = "archeol",
  Architecture = "archit",
  Art = "art",
  Astronomy = "astron",
  Audiovisual = "audvid",
  Aviation = "aviat",
  Baseball = "baseb",
  Biochemistry = "biochem",
  Biology = "biol",
  Botany = "bot",
  Buddhism = "Buddh",
  Business = "bus",
  CardGames = "cards",
  Chemistry = "chem",
  Christianity = "Christn",
  Clothing = "cloth",
  Computing = "comp",
  Crystallography = "cryst",
  Dentistry = "dent",
  Ecology = "ecol",
  Economics = "econ",
  Electricity = "elec",
  Electronics = "electr",
  Embryology = "embryo",
  Engineering = "engr",
  Entomology = "ent",
  Film = "film",
  Finance = "finc",
  Fishing = "fish",
  Food = "food",
  Gardening = "gardn",
  Genetics = "genet",
  Geography = "geogr",
  Geology = "geol",
  Geometry = "geom",
  Go = "go",
  Golf = "golf",
  Grammar = "gramm",
  GreekMythology = "grmyth",
  Hanafuda = "hanaf",
  HorseRacing = "horse",
  Kabuki = "kabuki",
  Law = "law",
  Linguistics = "ling",
  Logic = "logic",
  MartialArts = "MA",
  Mahjong = "mahj",
  Manga = "manga",
  Mathematics = "math",
  MechanicalEngineering = "mech",
  Medicine = "med",
  Meteorology = "met",
  Military = "mil",
  Mining = "mining",
  Music = "music",
  Noh = "noh",
  Ornithology = "ornith",
  Paleontology = "paleo",
  Pathology = "pathol",
  Pharmacology = "pharm",
  Philosophy = "phil",
  Photography = "photo",
  Physics = "physics",
  Physiology = "physiol",
  Politics = "politics",
  Printing = "print",
  Psychiatry = "psy",
  Pschoanalysis = "psyanal",
  Psychology = "psych",
  Railway = "rail",
  RomanMythology = "rommyth",
  Shinto = "Shinto",
  Shogi = "shogi",
  Ski = "ski",
  Sports = "sports",
  Statistics = "stat",
  StockMarket = "stockm",
  Sumo = "sumo",
  Telecommunications = "telec",
  Trademark = "tradem",
  Television = "tv",
  VideoGames = "vidg",
  Zoology = "zool",
}

// <re_inf> - i.e. &ik; is inside <re_inf> tag.
export enum ReadingInfo {
  Gikun = "&gikun;",
  IrregularKanaUsage = "&ik;",
  ObsoleteKanaUsage = "&ok;",
  SearchOnlyKanaForm = "&sK;",
}
