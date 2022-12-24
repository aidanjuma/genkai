import { IProviderInfo, SourceUrl } from "./types";
abstract class BaseProvider {
  // The name of the provider; also used as fileName in Downloader.
  abstract readonly name: string;
  // The URL of the data source, i.e. http://ftp.edrdg.org/pub/Nihongo/JMdict.gz.
  abstract readonly sourceUrl: SourceUrl;

  get toString(): IProviderInfo {
    return {
      name: this.name,
      sourceUrl: this.sourceUrl,
    };
  }
}

export default BaseProvider;
