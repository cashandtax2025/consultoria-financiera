import { ResultAsync } from "neverthrow";
import {
  AIProviderError,
  type AppError,
  DatabaseError,
  ExternalServiceError,
} from "../errors";

/**
 * Wrap a database query in a ResultAsync that catches errors.
 *
 * @example
 * ```typescript
 * const result = dbQuery('findUser', () =>
 *   db.query.users.findFirst({ where: eq(users.id, id) })
 * );
 * ```
 */
export function dbQuery<T>(
  operation: string,
  query: () => Promise<T>,
): ResultAsync<T, DatabaseError> {
  return ResultAsync.fromPromise(
    query(),
    (e: unknown) => new DatabaseError(operation, e),
  );
}

/**
 * Wrap an AI provider call in a ResultAsync that catches errors.
 *
 * @example
 * ```typescript
 * const result = aiQuery('openai', 'gpt-4o', () =>
 *   openai.chat.completions.create({ ... })
 * );
 * ```
 */
export function aiQuery<T>(
  provider: string,
  model: string,
  fn: () => Promise<T>,
): ResultAsync<T, AIProviderError> {
  return ResultAsync.fromPromise(
    fn(),
    (e: unknown) => new AIProviderError(provider, model, e),
  );
}

/**
 * Wrap an external service call in a ResultAsync that catches errors.
 *
 * @example
 * ```typescript
 * const result = serviceQuery('Stripe', 'createPayment', () =>
 *   stripe.paymentIntents.create({ ... })
 * );
 * ```
 */
export function serviceQuery<T>(
  service: string,
  operation: string,
  fn: () => Promise<T>,
): ResultAsync<T, ExternalServiceError> {
  return ResultAsync.fromPromise(
    fn(),
    (e: unknown) => new ExternalServiceError(service, operation, e),
  );
}

/**
 * Wrap any async operation in a ResultAsync with a custom error mapper.
 *
 * @example
 * ```typescript
 * const result = tryCatchAsync(
 *   () => externalApi.call(),
 *   (e) => new ExternalServiceError('PaymentAPI', 'charge', e)
 * );
 * ```
 */
export function tryCatchAsync<T, E extends AppError>(
  fn: () => Promise<T>,
  onError: (e: unknown) => E,
): ResultAsync<T, E> {
  return ResultAsync.fromPromise(fn(), onError);
}

export { err, ok, Result, ResultAsync } from "neverthrow";
