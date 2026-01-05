/**
 * Maps domain errors (AppError) to tRPC errors at the API boundary.
 * Also handles logging of errors with appropriate severity.
 *
 * @example
 * ```typescript
 * // In a tRPC procedure
 * return unwrapResult(await getPost(input.id));
 * ```
 */

import {
  type AppError,
  getTRPCCode,
  isOperationalError,
} from "@consultoria-financiera/core/errors";
import { logger } from "@consultoria-financiera/logger";
import { TRPCError } from "@trpc/server";
import type { Result, ResultAsync } from "neverthrow";

/**
 * Log an error with appropriate severity based on isOperational.
 * - Operational errors (expected): logged as warnings
 * - Non-operational errors (bugs): logged as errors
 */
function logError(error: AppError, context?: Record<string, unknown>): void {
  const logContext = {
    errorTag: error._tag,
    isOperational: error.isOperational,
    ...context,
  };

  if (isOperationalError(error)) {
    logger.warn(`Operational error: ${error.message}`, logContext);
  } else {
    logger.error(`Non-operational error: ${error.message}`, error, logContext);
  }
}

/**
 * Unwrap a Result, throwing a TRPCError if it's an error.
 * Use this at the tRPC boundary to convert domain errors to API errors.
 * Automatically logs the error with appropriate severity.
 */
export function unwrapResult<T, E extends AppError>(
  result: Result<T, E>,
  logContext?: Record<string, unknown>,
): T {
  if (result.isErr()) {
    logError(result.error, logContext);

    throw new TRPCError({
      code: getTRPCCode(result.error),
      message: result.error.message,
      cause: result.error,
    });
  }
  return result.value;
}

/**
 * Unwrap a ResultAsync, throwing a TRPCError if it's an error.
 * Use this at the tRPC boundary to convert domain errors to API errors.
 * Automatically logs the error with appropriate severity.
 */
export async function unwrapResultAsync<T, E extends AppError>(
  resultAsync: ResultAsync<T, E>,
  logContext?: Record<string, unknown>,
): Promise<T> {
  const result = await resultAsync;
  return unwrapResult(result, logContext);
}
