import fs from "fs";
import Downloader from "../../src/utils/downloader";
import { SourceUrl } from "../models/types";

jest.setTimeout(120000);

// run: yarn test --watch --verbose false downloader.test.ts

describe("Downloader Utility Class/Module", () => {
  test("Test: Latest file's presence; download if not.", async () => {
    const downloader = new Downloader(SourceUrl.JMdict, "JMdict", "xml");
    // Run download script...
    await downloader.downloadFile();
    expect(fs.existsSync(downloader.fileDestination)).toEqual(true);
  });
});
