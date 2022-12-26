import fs from "fs";
import path from "path";
import xml2js from "xml2js";
import xmlescape from "xml-escape";
import { FileType, IFile } from "../models/types";
import {
  EmptyBufferException,
  FileTypeException,
  FileAlreadyExistsException,
} from "./exceptions";

const { log } = console;

class XMLParser {
  public sourceFile!: IFile;
  public destinationFile!: IFile;
  private readonly xmlIgnore = `<>"`;
  private readonly jsonPath = path.join(__dirname, "..", "..", "json");

  constructor(sourceFile: IFile) {
    // Set .json file destination with the same name as XML file, minus file extension.
    this.destinationFile = {
      fileType: FileType.JSON,
      filePath: path.join(
        this.jsonPath,
        this.convertFileNameToJson(sourceFile.filePath)
      ),
    };

    if (fs.existsSync(this.destinationFile.filePath))
      throw new FileAlreadyExistsException(this.destinationFile.filePath);

    if (sourceFile.fileType != FileType.XML)
      throw new FileTypeException(
        sourceFile.filePath,
        FileType.XML,
        sourceFile.fileType
      );

    this.sourceFile = sourceFile;
  }

  /* Publicly-facing function: execute parse flow. */
  public parse = async () => {
    const xmlBuffer = this.readSourceFile();
    if (xmlBuffer === undefined) throw new EmptyBufferException();
    const parsedXml = await this.parseXmlFromBuffer(xmlBuffer);
    this.writeParsedXmlToJsonFile(parsedXml);
  };

  /* Uses the same file name, changing extension to '.json'. */
  private convertFileNameToJson = (filePath: string): string => {
    // C:\Users\aidan\Documents\GitHub\genkai\downloads\README.md => README.md
    const oldFileName = path.basename(filePath);
    // README.md => ["README", "md"]
    const oldFileNameParts = oldFileName.split(".");
    // README.md => README.json
    const newFileName = oldFileName.replace(
      `.${oldFileNameParts[oldFileNameParts.length - 1]}`,
      `.${FileType.JSON as string}`
    );

    return newFileName;
  };

  private readSourceFile = (): Buffer | undefined => {
    log(`Reading file "${this.sourceFile.filePath}"...`);
    const xmlBuffer: Buffer | undefined = fs.readFileSync(
      this.sourceFile.filePath
    );
    return xmlBuffer;
  };

  /* Parses XML from file in 'downloads' (now a Buffer) to a JSON-compatible format. */
  private parseXmlFromBuffer = async (
    xmlBuffer: Buffer
  ): Promise<unknown | Error> => {
    return await new Promise((resolve, reject) => {
      const xmlStr: string = xmlescape(xmlBuffer.toString(), this.xmlIgnore);

      xml2js.parseString(xmlStr, (err, obj) => {
        log("Parsing buffer to JSON-compatible format...");
        !err
          ? this.sourceFile.filePath.includes("JMdict")
            ? resolve(obj.JMdict.entry)
            : reject(console.error(err))
          : reject(console.error(err));
      });
    });
  };

  /* Takes in buffer data to write to JSON file in 'json/'. */
  private writeParsedXmlToJsonFile = async (data: unknown): Promise<void> => {
    return await new Promise<void>((resolve) => {
      log(`Writing JSON to file "${this.destinationFile.filePath}"`);
      fs.writeFileSync(
        this.destinationFile.filePath,
        JSON.stringify(data),
        "utf-8"
      );
      log("Data written successfully!");
      resolve();
    }).catch((err) => {
      throw new Error(err).message;
    });
  };
}

export default XMLParser;
