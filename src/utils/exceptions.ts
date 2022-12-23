import path from "path";
import { FileType } from "../models/types";

class EmptyBufferException extends Error {
  constructor() {
    super("The buffer you attempted to pass in to be parsed was empty.");
    this.name = "EmptyBufferException";
  }
}

class FileAlreadyExistsException extends Error {
  constructor(filePath: string) {
    super(`"${filePath}" already exists.`);
    this.name = "FileAlreadyExistsException";
  }
}

class FileTypeException extends Error {
  constructor(
    filePath: string,
    desiredFileType: FileType,
    actualFileType: FileType
  ) {
    super(
      `Error: The desired file type for "${path.basename(filePath)}" is "${
        desiredFileType as string
      }", but the actual file type is "${actualFileType as string}".`
    );
    this.name = "FileTypeException";
  }
}

export { EmptyBufferException, FileAlreadyExistsException, FileTypeException };
