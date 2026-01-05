/**
 * Base error classes for all application errors.
 */

/**
 * Base class for all application errors.
 * Extends Error for compatibility with try/catch and error tracking (Sentry).
 */
export abstract class AppError extends Error {
  abstract readonly _tag: string;

  /**
   * Whether this is an expected business error (true) or an unexpected bug (false).
   * Error tracking services can use this to alert differently.
   */
  readonly isOperational: boolean = true;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

// =============================================================================
// Authentication & Authorization Errors
// =============================================================================

export class UnauthorizedError extends AppError {
  readonly _tag = "UnauthorizedError";
  readonly reason: string | undefined;

  constructor(reason?: string) {
    super(reason ?? "Not authenticated");
    this.reason = reason;
  }
}

export class ForbiddenError extends AppError {
  readonly _tag = "ForbiddenError";
  readonly action: string;
  readonly resource: string | undefined;

  constructor(action: string, resource?: string) {
    super(resource ? `Cannot ${action} ${resource}` : `Cannot ${action}`);
    this.action = action;
    this.resource = resource;
  }
}

// =============================================================================
// Resource Errors
// =============================================================================

export class NotFoundError extends AppError {
  readonly _tag = "NotFoundError";
  readonly resource: string;
  readonly id: string | undefined;

  constructor(resource: string, id?: string) {
    super(id ? `${resource} (${id}) not found` : `${resource} not found`);
    this.resource = resource;
    this.id = id;
  }
}

export class ConflictError extends AppError {
  readonly _tag = "ConflictError";
  readonly resource: string;
  readonly reason: string;

  constructor(resource: string, reason: string) {
    super(`${resource}: ${reason}`);
    this.resource = resource;
    this.reason = reason;
  }
}

// =============================================================================
// Validation Errors
// =============================================================================

export class ValidationError extends AppError {
  readonly _tag = "ValidationError";
  readonly field: string;
  readonly reason: string;

  constructor(field: string, reason: string) {
    super(`${field}: ${reason}`);
    this.field = field;
    this.reason = reason;
  }
}

// =============================================================================
// Infrastructure Errors
// =============================================================================

export class DatabaseError extends AppError {
  readonly _tag = "DatabaseError";
  override readonly isOperational = false;
  readonly operation: string;
  readonly cause: unknown;

  constructor(operation: string, cause?: unknown) {
    super(`Database error during ${operation}`);
    this.operation = operation;
    this.cause = cause;
  }
}

export class ExternalServiceError extends AppError {
  readonly _tag = "ExternalServiceError";
  override readonly isOperational = false;
  readonly service: string;
  readonly operation: string;
  readonly cause: unknown;

  constructor(service: string, operation: string, cause?: unknown) {
    super(`${service} error during ${operation}`);
    this.service = service;
    this.operation = operation;
    this.cause = cause;
  }
}

// =============================================================================
// AI Errors
// =============================================================================

export class AIProviderError extends AppError {
  readonly _tag = "AIProviderError";
  override readonly isOperational = false;
  readonly provider: string;
  readonly model: string;
  readonly cause: unknown;

  constructor(provider: string, model: string, cause?: unknown) {
    super(`AI provider ${provider} error with model ${model}`);
    this.provider = provider;
    this.model = model;
    this.cause = cause;
  }
}

export class AIRateLimitError extends AppError {
  readonly _tag = "AIRateLimitError";
  readonly provider: string;
  readonly retryAfter: number | undefined;

  constructor(provider: string, retryAfter?: number) {
    super(`Rate limit exceeded for ${provider}`);
    this.provider = provider;
    this.retryAfter = retryAfter;
  }
}

export class AIContentFilterError extends AppError {
  readonly _tag = "AIContentFilterError";
  readonly reason: string;

  constructor(reason: string) {
    super(`Content filtered: ${reason}`);
    this.reason = reason;
  }
}

// =============================================================================
// Type Guards
// =============================================================================

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function isOperationalError(error: unknown): boolean {
  return isAppError(error) && error.isOperational;
}
