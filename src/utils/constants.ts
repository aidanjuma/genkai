/*
💥 MASSIVE thank you to the EDRDG (Electronic Dictionary Research & Development Group), who manage these projects.
🎞️ Additional credit goes to the original creator of these projects, Jim Breen (http://nihongo.monash.edu/index.html).
*/

class Constants {
  static readonly sourceUrls = {
    JMdict: "http://ftp.edrdg.org/pub/Nihongo/JMdict.gz",
    JMnedict: "http://ftp.edrdg.org/pub/Nihongo/JMnedict.xml.gz",
    KANJIDIC2: "http://www.edrdg.org/kanjidic/kanjidic2.xml.gz",
    RADK: "http://ftp.edrdg.org/pub/Nihongo/radkfile.gz",
    KRAD: "http://ftp.edrdg.org/pub/Nihongo/kradfile.gz",
  };
  // Japanese Characters: Used to recognise whether character is Hiragana or Katakana via RegExp.
  static readonly hiraganaRegex: RegExp = new RegExp(/[\u3040-\u309F]/gm);
  static readonly katakanaRegex: RegExp = new RegExp(/[\u30A0-\u30FF]/gm);

  // i.e. {"_": "Walt", "$": "xml:lang=ger"}
  static readonly glossaryLanguageKey: string = "$";
  static readonly glossaryTranslationKey: string = "_";
}

export default Constants;
