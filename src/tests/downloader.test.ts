import fs from "fs";
import path from "path";
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

  /* KNOWN BUG: This test fails,
   * as the length returns 2,
   * but in reality the file is deleted
   * per visually checking after test completion.
   */
  test("Test: Clean-up 'downloads' folder.", async () => {
    const downloadsPath = path.join(__dirname, "..", "..", "downloads");
    const readme = path.join(__dirname, "..", "..", "downloads", "README.md");

    // Run clean-up tool...
    Downloader.cleanupDownloads();

    // If cleaned up, 'downloads' should only contain 'README.md'.
    expect(fs.readdirSync(downloadsPath).length).toEqual(1);
    expect(fs.existsSync(readme)).toEqual(true);
  });
});
