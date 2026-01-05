/**
 * Core errors module - exports all error types
 */

// Accounting domain errors
export {
  AccountCodeAlreadyExistsError,
  AccountNotFoundError,
  InvalidAccountDataError,
  MappingAlreadyExistsError,
  MappingNotFoundError,
  UnmappedAccountNotFoundError,
} from "./accounting";
// Base errors
export {
  AIContentFilterError,
  AIProviderError,
  AIRateLimitError,
  AppError,
  ConflictError,
  DatabaseError,
  ExternalServiceError,
  ForbiddenError,
  isAppError,
  isOperationalError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "./base";
// Client domain errors
export {
  ClientAlreadyExistsError,
  ClientNotFoundError,
  GroupNotFoundError,
  InvalidClientDataError,
} from "./clients";

// Upload domain errors
export {
  DataExtractionError,
  FileProcessingError,
  FileTooLargeError,
  InvalidDocumentTypeError,
  InvalidFileTypeError,
  UploadNotFoundError,
} from "./uploads";

// =============================================================================
// Error Union Types (for common combinations)
// =============================================================================

import type {
  AppError,
  ConflictError,
  DatabaseError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "./base";

/** Common errors for read operations */
export type ReadError = NotFoundError | UnauthorizedError | DatabaseError;

/** Common errors for write operations */
export type WriteError =
  | NotFoundError
  | UnauthorizedError
  | ForbiddenError
  | ValidationError
  | ConflictError
  | DatabaseError;

// =============================================================================
// tRPC Code Mapping (for API boundaries)
// =============================================================================

type TRPCErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "BAD_REQUEST"
  | "INTERNAL_SERVER_ERROR"
  | "BAD_GATEWAY";

const tagToTRPCCode: Record<string, TRPCErrorCode> = {
  // Base errors
  UnauthorizedError: "UNAUTHORIZED",
  ForbiddenError: "FORBIDDEN",
  NotFoundError: "NOT_FOUND",
  ConflictError: "CONFLICT",
  ValidationError: "BAD_REQUEST",
  DatabaseError: "INTERNAL_SERVER_ERROR",
  ExternalServiceError: "BAD_GATEWAY",

  // AI errors
  AIProviderError: "BAD_GATEWAY",
  AIRateLimitError: "BAD_REQUEST",
  AIContentFilterError: "BAD_REQUEST",

  // Client errors
  ClientNotFoundError: "NOT_FOUND",
  ClientAlreadyExistsError: "CONFLICT",
  InvalidClientDataError: "BAD_REQUEST",
  GroupNotFoundError: "NOT_FOUND",

  // Accounting errors
  AccountNotFoundError: "NOT_FOUND",
  AccountCodeAlreadyExistsError: "CONFLICT",
  MappingNotFoundError: "NOT_FOUND",
  MappingAlreadyExistsError: "CONFLICT",
  InvalidAccountDataError: "BAD_REQUEST",
  UnmappedAccountNotFoundError: "NOT_FOUND",

  // Upload errors
  UploadNotFoundError: "NOT_FOUND",
  FileProcessingError: "BAD_REQUEST",
  InvalidFileTypeError: "BAD_REQUEST",
  FileTooLargeError: "BAD_REQUEST",
  DataExtractionError: "BAD_REQUEST",
  InvalidDocumentTypeError: "BAD_REQUEST",
};

export function getTRPCCode(error: AppError): TRPCErrorCode {
  return tagToTRPCCode[error._tag] ?? "INTERNAL_SERVER_ERROR";
}
