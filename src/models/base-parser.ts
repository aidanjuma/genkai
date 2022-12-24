import BaseProvider from "./base-provider";
import Downloader from "@utils/downloader";

abstract class BaseParser extends BaseProvider {
  // All data required to instantiate 'downloader' to be passed in class definition.
  protected downloader!: Downloader;

  constructor() {
    super();
  }

  // Required in all providers; retrieve the data from given SourceUrl
  abstract downloadAndParseSource(): Promise<void>;
}

export default BaseParser;
