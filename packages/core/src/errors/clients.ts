/**
 * Client domain errors
 */
import { AppError } from "./base";

export class ClientNotFoundError extends AppError {
  readonly _tag = "ClientNotFoundError";
  readonly clientId: string;

  constructor(clientId: string) {
    super(`Client (${clientId}) not found`);
    this.clientId = clientId;
  }
}

export class ClientAlreadyExistsError extends AppError {
  readonly _tag = "ClientAlreadyExistsError";
  readonly field: string;
  readonly value: string;

  constructor(field: string, value: string) {
    super(`Client with ${field} "${value}" already exists`);
    this.field = field;
    this.value = value;
  }
}

export class InvalidClientDataError extends AppError {
  readonly _tag = "InvalidClientDataError";
  readonly field: string;
  readonly reason: string;

  constructor(field: string, reason: string) {
    super(`Invalid client data: ${field} - ${reason}`);
    this.field = field;
    this.reason = reason;
  }
}

export class GroupNotFoundError extends AppError {
  readonly _tag = "GroupNotFoundError";
  readonly groupTaxId: string;

  constructor(groupTaxId: string) {
    super(`Group with tax ID "${groupTaxId}" not found`);
    this.groupTaxId = groupTaxId;
  }
}
