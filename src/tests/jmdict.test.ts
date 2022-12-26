import JMdict from "../../src/providers/jmdict";

jest.setTimeout(120000);

// run: yarn test --watch --verbose false jmdict.test.ts

describe("JMdict Class/Module", () => {
  test("Test: {NAME GOES HERE}", async () => {
    const jmdict = new JMdict();
    await jmdict.downloadAndParseSource();
  });
});
