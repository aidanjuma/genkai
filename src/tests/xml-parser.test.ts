import fs from "fs";
import Constants from "../../src/utils/constants";
import XMLParser from "../../src/utils/xml-parser";
import Downloader from "../../src/utils/downloader";
import { FileType } from "../models/types";

jest.setTimeout(120000);

// run: yarn test --watch --verbose false xml-parser.test.ts

describe("XMLParser Utility Class", () => {
  // TODO: More robust test; ensure not empty {}?
  test("Test: Download JMdict, parse and ensure it is there.", async () => {
    const downloader = new Downloader(
      Constants.sourceUrls.JMdict,
      "JMdict",
      FileType.XML
    );

    await downloader.downloadFile();

    // Instantiate XMLParser with source file details:
    const parser = new XMLParser({
      fileType: FileType.XML,
      filePath: downloader.destinationFile.filePath,
    });
    await parser.parse();

    // Clean-up 'downloads' after parsing; files no longer needed.
    Downloader.cleanupDownloads();

    expect(fs.existsSync(parser.destinationFile.filePath)).toEqual(true);
  });
});
