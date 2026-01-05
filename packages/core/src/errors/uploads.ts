/**
 * Upload domain errors
 */
import { AppError } from "./base";

export class UploadNotFoundError extends AppError {
  readonly _tag = "UploadNotFoundError";
  readonly uploadId: string;

  constructor(uploadId: string) {
    super(`Upload (${uploadId}) not found`);
    this.uploadId = uploadId;
  }
}

export class FileProcessingError extends AppError {
  readonly _tag = "FileProcessingError";
  readonly fileName: string;
  readonly reason: string;

  constructor(fileName: string, reason: string) {
    super(`Error processing file "${fileName}": ${reason}`);
    this.fileName = fileName;
    this.reason = reason;
  }
}

export class InvalidFileTypeError extends AppError {
  readonly _tag = "InvalidFileTypeError";
  readonly fileType: string;
  readonly allowedTypes: string[];

  constructor(fileType: string, allowedTypes: string[]) {
    super(
      `Invalid file type "${fileType}". Allowed types: ${allowedTypes.join(", ")}`,
    );
    this.fileType = fileType;
    this.allowedTypes = allowedTypes;
  }
}

export class FileTooLargeError extends AppError {
  readonly _tag = "FileTooLargeError";
  readonly fileSize: number;
  readonly maxSize: number;

  constructor(fileSize: number, maxSize: number) {
    super(
      `File size (${fileSize} bytes) exceeds maximum allowed (${maxSize} bytes)`,
    );
    this.fileSize = fileSize;
    this.maxSize = maxSize;
  }
}

export class DataExtractionError extends AppError {
  readonly _tag = "DataExtractionError";
  readonly documentType: string;
  readonly reason: string;

  constructor(documentType: string, reason: string) {
    super(`Failed to extract data from ${documentType}: ${reason}`);
    this.documentType = documentType;
    this.reason = reason;
  }
}

export class InvalidDocumentTypeError extends AppError {
  readonly _tag = "InvalidDocumentTypeError";
  readonly documentType: string;

  constructor(documentType: string) {
    super(`Invalid document type: "${documentType}"`);
    this.documentType = documentType;
  }
}
