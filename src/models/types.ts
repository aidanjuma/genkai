/*
Attempt at implementing & re-documenting the following:
- http://www.edrdg.org/jmdict/jmdict_dtd_h.html
*/

// IProviderInfo: provides information about a provider.
export interface IProviderInfo {
  name: string;
  sourceUrl: string;
}

export interface IEntry {
  // ent_seq - a unique number ID for each entry.
  id: number;

  /*
   * Reading Element(s): at least one per entry.
   * Contains reading in kana, and some tags including
   * some status data or characteristics.
   */
  readingElements: IReadingElement[];

  /*
   * Sense Element(s): at least one per entry.
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

export interface IJapaneseReading {
  reading: string;

  // Some Japanese words can contain both Hiragana & Katakana, so a list is used in those cases.
  kanaType: KanaType | KanaType[];
}

export interface IReadingElement {
  // Reading of word/phrase in kana.
  reading: IJapaneseReading;

  /*
   * re_nokanji => isTrueKanjiReading: false if this reading
   * cannot be regarded as a true reading of a linked
   * kanji.
   */
  isTrueKanjiReading: boolean;

  /*
   * re_restr => subsetOfNonKanaReadings: this element is
   * used to indicate when the reading only applies to a
   * a specific subset of non-kana elements within an entry.
   */
  subsetOfNonKanaReadings?: string[];

  // Info about said kanji; <re_inf> entity.
  readingInfo?: ReadingInfo[];

  // <re_pri> - either pre-determined (see enum) or NFxx (as string).
  frequencyRating?: (FrequencyRating | string)[];
}

export interface IKanjiElement {
  // <keb> - Kanji; displayed as written.
  kanji: string;

  // Info about said kanji; <ke_inf> entity.
  kanjiInfo?: KanjiInfo[];

  // <ke_pri> - either pre-determined (see enum) or NFxx (as string).
  frequencyRating?: (FrequencyRating | string)[];
}

// TODO: Expand on ISense; see near bottom of file for TODOs.
export interface ISense {
  /* Potential translational equivalents in:
   * English
   * German
   * French
   * Russian
   * Hungarian
   * Slovenian
   * Dutch
   */
  glossary: ITranslation | ITranslation[];

  // See IRestrictLexeme interface for more details.
  lexemeRestrictions?: IRestrictLexeme[];

  // <pos> - Part-of-Speech information for said entry/sense.
  partOfSpeech?: PartOfSpeech;

  // <ant> - An antonym that matches another entry's keb/reb. Can have multiple.
  antonyms?: string[];

  // <field> - Information regarding the application of entry/sense. Can have multiple.
  fields?: Field[];

  // <misc> - Other relevant information regarding the entry/sense. Can have multiple.
  miscellaneous?: Miscellaneous[];

  // <dial> - Dialect of Japanese said word/phrase originates from.
  dialect?: Dialect;
}

export interface ITranslation {
  // Language to which word/phrase is translated to.
  language: string;
  // Word/phrase translation from Japanese.
  translation: string;
  // <gloss> tags are ordered ascendingly by usage frequency.
  relativeCommonality: number;
}

/* ELEMENT & ENTITY Tags */
// <stagr> & <stagk> - If present, indicate that sense is restricted to lexeme represented by keb/reb.
export interface IRestrictLexeme {
  type: EntryType;
  content: IJapaneseReading;
}

// IFile: not related to dictionary specifically; used in Downloader and XMLParser utils to model file locations/types.
export interface IFile {
  fileType: FileType;
  filePath: string;
}

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
  Brazilian = "&bra;",
  Hokkaido = "&hob;",
  Kansai = "&ksb;",
  Kantou = "&ktb;",
  Kyoto = "&kyb;",
  Kyuushuu = "&kyu;",
  Nagano = "&nab;",
  Osaka = "&osb;",
  Ryuukyuu = "&rkb;",
  Touhoku = "&thb;",
  Tosa = "&tsb;",
  Tsugaru = "&tsug;",
}

// <ke/re_pri> - An indication of frequency/relative priority of certain entry.
// NFXX not included in this enum. This should be defined as a seperate string.
export enum FrequencyRating {
  /*
   * "News" set; appears in the wordfreq file compiled by Alexandre Girardi from
   * Mainichi Shimbun; first 12,000 words are News1, next 12,000 words are News2.
   */
  News1 = "news1",
  News2 = "news2",
  /*
   * "Ichi" set; appears in the "Ichimango goi bunruishuu" (Senmon Kyouiku).
   * Ichi2 is entries that have lower frequencies when compared to Ichi1.
   */
  Ichi1 = "ichi1",
  Ichi2 = "ichi2",
  // "Spec" set; small number of words detected to be common, but not included in prior lists.
  Spec1 = "spec1",
  Spec2 = "spec2",
  // Common loanwords (i.e. gaikoku) - based on wordfreq file.
  Gai1 = "gai1",
  Gai2 = "gai2",
}

// <field> - i.e. Computing is "comp"; field of study/interest related to word/phrase.
export enum Field {
  Agriculture = "&agric;",
  Anatomy = "&anat;",
  Archeology = "&archeol;",
  Architecture = "&archit;",
  Art = "&art;",
  Astronomy = "&astron;",
  Audiovisual = "&audvid;",
  Aviation = "&aviat;",
  Baseball = "&baseb;",
  Biochemistry = "&biochem;",
  Biology = "&biol;",
  Botany = "&bot;",
  Buddhism = "&Buddh;",
  Business = "&bus;",
  CardGames = "&cards;",
  Chemistry = "&chem;",
  Christianity = "&Christn;",
  Clothing = "&cloth;",
  Computing = "&comp;",
  Crystallography = "&cryst;",
  Dentistry = "&dent;",
  Ecology = "&ecol;",
  Economics = "&econ;",
  Electricity = "&elec;",
  Electronics = "&electr;",
  Embryology = "&embryo;",
  Engineering = "&engr;",
  Entomology = "&ent;",
  Film = "&film;",
  Finance = "&finc;",
  Fishing = "&fish;",
  Food = "&food;",
  Gardening = "&gardn;",
  Genetics = "&genet;",
  Geography = "&geogr;",
  Geology = "&geol;",
  Geometry = "&geom;",
  Go = "&go;",
  Golf = "&golf;",
  Grammar = "&gramm;",
  GreekMythology = "&grmyth;",
  Hanafuda = "&hanaf;",
  HorseRacing = "&horse;",
  Kabuki = "&kabuki;",
  Law = "&law;",
  Linguistics = "&ling;",
  Logic = "&logic;",
  MartialArts = "&MA;",
  Mahjong = "&mahj;",
  Manga = "&manga;",
  Mathematics = "&math;",
  MechanicalEngineering = "&mech;",
  Medicine = "&med;",
  Meteorology = "&met;",
  Military = "&mil;",
  Mining = "&mining;",
  Music = "&music;",
  Noh = "&noh;",
  Ornithology = "&ornith;",
  Paleontology = "&paleo;",
  Pathology = "&pathol;",
  Pharmacology = "&pharm;",
  Philosophy = "&phil;",
  Photography = "&photo;",
  Physics = "&physics;",
  Physiology = "&physiol;",
  Politics = "&politics;",
  Printing = "&print;",
  Psychiatry = "&psy;",
  Pschoanalysis = "&psyanal;",
  Psychology = "&psych;",
  Railway = "&rail;",
  RomanMythology = "&rommyth;",
  Shinto = "&Shinto;",
  Shogi = "&shogi;",
  Ski = "&ski;",
  Sports = "&sports;",
  Statistics = "&stat;",
  StockMarket = "&stockm;",
  Sumo = "&sumo;",
  Telecommunications = "&telec;",
  Trademark = "&tradem;",
  Television = "&tv;",
  VideoGames = "&vidg;",
  Zoology = "&zool;",
}

// <misc> - Miscellaneous properties of an entry.
export enum Miscellaneous {
  Abbreviation = "&abbr;",
  Archaic = "&arch;",
  Character = "&char;",
  ChildlikeLanguage = "&chn;",
  Colloquial = "&col;",
  CompanyName = "&company;",
  Creature = "&creat;",
  DatedTerm = "&dated;",
  Deity = "&dei;",
  Derogatory = "&derog;",
  Document = "&doc;",
  Euphemistic = "&euph;",
  Event = "&ev;",
  FamiliarLanguage = "&fam;",
  Feminine = "&fem;",
  Fiction = "&fict;",
  Formal = "&form;",
  GivenName = "&given;",
  Group = "&group;",
  Historical = "&hist;",
  Sonkeigo = "&hon;", // Honorific
  Kenjougo = "&hum;", // Humble
  Idiomatic = "&id;",
  Jocular = "&joc;",
  Legend = "&leg;",
  MangaSlang = "&m;",
  Masculine = "&male;",
  Mythology = "&myth;",
  InternetSlang = "&net;",
  Object = "&obj;",
  Obsolete = "&obs;",
  OnomatopoeicOrMimetic = "&on;",
  Organization = "&organization;",
  Other = "&oth;",
  Person = "&person;",
  Place = "&place;",
  Poetical = "&poet;",
  Teineigo = "&pol;", // Polite
  ProductName = "&product;",
  Proverb = "&proverb;",
  Quotation = "&quote;",
  Rare = "&rare;",
  Religious = "&relig;",
  Sensitive = "&sens;",
  Service = "&serv;",
  ShipName = "&ship;",
  Slang = "&sl;",
  RailwayStation = "&station;",
  Surname = "&surname;",
  WrittenOnlyInKana = "&uk;",
  UnclassifiedName = "&unclass;",
  Vulgar = "&vulg;",
  Works = "&work;",
  X = "&X;",
  Yojijukugo = "&yoji;",
}

// <pos> - Annotated part-of-speech indicators.
// TODO: Where to place detailed descriptions of each <pos>?
export enum PartOfSpeech {
  PrenominalNounOrVerb = "&adj-f;",
  KeiyoushiAdjective = "&adj-i;",
  KeiyoushiAdjectiveException = "&adj-ix;",
  KariAdjective = "&adj-kari;",
  KuAdjective = "&adj-ku;",
  KeiyodoshiAdjective = "&adj-na;",
  FormalNaAdjective = "&adj-nari;",
  AdjectiveWithNoParticle = "&adj-no;",
  RentaishiAdjectivalPrenoun = "&adj-pn;",
  ShikuAdjective = "&adj-shiku;",
  TaruAdjective = "&adj-t;",
  FukushiAdverb = "&adv;",
  AdverbWithToParticle = "&adv-to;",
  Auxiliary = "&aux;",
  AuxiliaryAdjective = "&aux-adj;",
  AuxiliaryVery = "&aux-v;",
  Conjunction = "&conj;",
  Copula = "&cop;",
  Counter = "&ctr;",
  Expression = "&exp;",
  Interjection = "&int;", // Kandoushi
  CommonNoun = "&n;", // Futsuumeishi
  AdverbialNoun = "&n-adv;", // Fukushitekimeishi
  ProperNoun = "&n-pr;",
  PrefixNoun = "&n-pref;",
  SuffixNoun = "&n-suf;",
  TemporalNoun = "&n-t;", // Jisoumeishi
  Numeric = "&num;",
  Pronoun = "&pn;",
  Prefix = "&pref;",
  Particle = "&prt;",
  Suffix = "&suf;",
  Unclassified = "&unc;",
  UnspecifiedVerb = "&v-unspec;",
  Ichidan = "&v1;",
  KureruIchidan = "&v1-s;",
  NidanEndingWithU = "&v2a-s;",
  UpperNidanEndingWithBu = "&v2b-k;",
  LowerNidanEndingWithBu = "&v2b-s;",
  UpperNidanEndingWithDzu = "&v2d-k;",
  LowerNidanEndingWithDzu = "&v2d-s;",
  UpperNidanEndingWithGu = "&v2g-k;",
  LowerNidanEndingWithGu = "&v2g-s;",
  UpperNidanEndingWithFu = "&v2h-k;",
  LowerNidanEndingWithFu = "&v2h-s;",
  UpperNidanEndingWithKu = "&v2k-k;",
  LowerNidanEndingWithKu = "&v2k-s;",
  UpperNidanEndingWithMu = "&v2m-k;",
  LowerNidanEndingWithMu = "&v2m-s;",
  LowerNidanEndingWithNu = "&v2n-s;",
  UpperNidanEndingWithRu = "&v2r-k;",
  LowerNidanEndingWithRu = "&v2r-s;",
  LowerNidanEndingWithSu = "&v2s-s;",
  UpperNidanEndingWithTsu = "&v2t-k;",
  LowerNidanEndingWithTsu = "&v2t-s;",
  LowerNidanEndingWithUAndWeConjugation = "&v2w-s;",
  UpperNidanEndingWithYu = "&v2y-k;",
  LowerNidanEndingWithYu = "&v2y-s;",
  LowerNidanEndingWithZu = "&v2z-s;",
  YodanEndingWithBu = "&v4b;",
  YodanEndingWithGu = "&v4g;",
  YodanEndingWithFu = "&v4h;",
  YodanEndingWithKu = "&v4k;",
  YodanEndingWithMu = "&v4m;",
  YodanEndingWithNu = "&v4n;",
  YodanEndingWithRu = "&v4r;",
  YodanEndingWithSu = "&v4s;",
  YodanEndingWithTsu = "&v4t;",
  AruGodan = "&v5aru;",
  GodanEndingWithBu = "&v5b;",
  GodanEndingWithGu = "&v5g;",
  GodanEndingWithKu = "&v5k;",
  IkuYukuGodan = "&v5k-s;",
  GodanEndingWithMu = "&v5m;",
  GodanEndingWithNu = "&v5n;",
  GodanEndingWithRu = "&v5r;",
  IrregularGodanEndingWithRu = "&v5r-i;",
  GodanEndingWithSu = "&v5s;",
  GodanEndingWithTsu = "&v5t;",
  GodanEndingWithU = "&v5u;",
  SpecialGodanEndingWithU = "&v5u-s;",
  GodanEndingWithUru = "&v5uru;",
  Intransitive = "&vi;",
  KuruVerb = "&vk;",
  IrregularNuVerb = "&vn;",
  IrregularRuVerb = "&vr;",
  NounOrParticipleUsingSuru = "&vs;",
  SuVerb = "&vs-c;",
  IncludedSuruVerb = "&vs-i;",
  SpecialSuruVerb = "&vs-s;",
  TransitiveVerb = "&vt;",
  ZuruIchidan = "&vz;",
}

// <re_inf> - i.e. &ik; is inside <re_inf> tag.
export enum ReadingInfo {
  Gikun = "&gikun;",
  IrregularKanaUsage = "&ik;",
  ObsoleteKanaUsage = "&ok;",
  SearchOnlyKanaForm = "&sK;",
}

// <ke_inf> - See ReadingInfo; same, but for kanji.
export enum KanjiInfo {
  Ateji = "&ateji;",
  IrregularKanaUsage = "&ik;",
  IrregularKanjiUsage = "&iK;",
  IrregularOkuriganaUsage = "&io;",
  OutdatedKanji = "&oK;",
  RarelyUsedKanjiForm = "&rK;",
  SearchOnlyKanjiForm = "&sK;",
}

// TODO: s_inf, lsource, xref for ISense...

/* Extra Enums for Readability: */
export enum KanaType {
  Hiragana,
  Katakana,
}

export enum EntryType {
  Reading,
  Kanji,
}

export enum FileType {
  XML = "xml",
  JSON = "json",
}
