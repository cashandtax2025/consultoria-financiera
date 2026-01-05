/**
 * Upload domain business logic
 */
import {
  type db as dbInstance,
  desc,
  eq,
  sql,
} from "@consultoria-financiera/db";
import {
  dataSchemas,
  extractedData,
  financialRecords,
  uploads,
} from "@consultoria-financiera/db/schema/upload";
import { err, ok, ResultAsync } from "neverthrow";
import {
  DatabaseError,
  FileProcessingError,
  UploadNotFoundError,
} from "../errors";

// Types
export type Upload = typeof uploads.$inferSelect;
export type ExtractedData = typeof extractedData.$inferSelect;
export type FinancialRecord = typeof financialRecords.$inferSelect;
export type DataSchema = typeof dataSchemas.$inferSelect;
type Database = typeof dbInstance;

export type UploadStatus = "pending" | "processing" | "completed" | "error";
export type DocumentType =
  | "invoices"
  | "expenses"
  | "bank_statements"
  | "cash_flow"
  | "production_sales"
  | "other";

export interface NewUploadInput {
  filename: string;
  fileType: string;
  fileSize: number;
  clientName: string;
  documentType: string;
  userId: string;
}

export interface ExtractedRecord {
  [key: string]: unknown;
}

// Helper functions
function convertToCents(value: string | number): number {
  if (typeof value === "number") {
    return Math.round(value * 100);
  }
  if (typeof value === "string") {
    const num = parseFloat(value.replace(/,/g, "."));
    return Number.isNaN(num) ? 0 : Math.round(num * 100);
  }
  return 0;
}

function parseDate(
  value: string | number | Date | undefined | null,
): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;

  const dateStr = String(value);
  const date = new Date(dateStr);

  if (Number.isNaN(date.getTime())) {
    // Try dd/mm/yyyy format
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      if (!day || !month || !year) return null;
      const fullYear = year.length === 2 ? `20${year}` : year;
      return new Date(
        `${fullYear}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
      );
    }
    return null;
  }

  return date;
}

// Upload operations
export function createUpload(
  db: Database,
  data: NewUploadInput,
): ResultAsync<Upload, DatabaseError> {
  return ResultAsync.fromPromise(
    db
      .insert(uploads)
      .values({
        filename: data.filename,
        fileType: data.fileType,
        fileSize: data.fileSize,
        clientName: data.clientName,
        documentType: data.documentType,
        userId: data.userId,
        status: "pending",
      })
      .returning()
      .then((r) => r[0]!),
    (e) => new DatabaseError("createUpload", e),
  );
}

export function updateUploadStatus(
  db: Database,
  uploadId: string,
  status: UploadStatus,
  errorMessage?: string,
): ResultAsync<Upload, UploadNotFoundError | DatabaseError> {
  return ResultAsync.fromPromise(
    (async () => {
      const [updated] = await db
        .update(uploads)
        .set({
          status,
          errorMessage,
          processedAt: status === "completed" ? new Date() : undefined,
        })
        .where(eq(uploads.id, uploadId))
        .returning();

      if (!updated) {
        throw new UploadNotFoundError(uploadId);
      }

      return updated;
    })(),
    (e) => {
      if (e instanceof UploadNotFoundError) return e;
      return new DatabaseError("updateUploadStatus", e);
    },
  );
}

export function getUploadById(
  db: Database,
  uploadId: string,
): ResultAsync<
  {
    upload: Upload;
    extractedData: ExtractedData[];
    records: FinancialRecord[];
  },
  UploadNotFoundError | DatabaseError
> {
  return ResultAsync.fromPromise(
    (async () => {
      const [upload] = await db
        .select()
        .from(uploads)
        .where(eq(uploads.id, uploadId));

      if (!upload) {
        throw new UploadNotFoundError(uploadId);
      }

      const extracted = await db
        .select()
        .from(extractedData)
        .where(eq(extractedData.uploadId, uploadId));

      const records = await db
        .select()
        .from(financialRecords)
        .where(eq(financialRecords.uploadId, uploadId))
        .orderBy(desc(financialRecords.date));

      return { upload, extractedData: extracted, records };
    })(),
    (e) => {
      if (e instanceof UploadNotFoundError) return e;
      return new DatabaseError("getUploadById", e);
    },
  );
}

export function getUserUploads(
  db: Database,
  userId: string,
  options: { limit: number; offset: number },
): ResultAsync<Upload[], DatabaseError> {
  return ResultAsync.fromPromise(
    db
      .select()
      .from(uploads)
      .where(eq(uploads.userId, userId))
      .orderBy(desc(uploads.uploadedAt))
      .limit(options.limit)
      .offset(options.offset),
    (e) => new DatabaseError("getUserUploads", e),
  );
}

// Create upload and store extracted data in one transaction
export function createUploadAndStore(
  db: Database,
  data: NewUploadInput & { data: ExtractedRecord[] },
): ResultAsync<
  { uploadId: string; extractedDataId: string; recordCount: number },
  FileProcessingError | DatabaseError
> {
  return ResultAsync.fromPromise(
    (async () => {
      // 1. Create upload record
      const [upload] = await db
        .insert(uploads)
        .values({
          filename: data.filename,
          fileType: data.fileType,
          fileSize: data.fileSize,
          clientName: data.clientName,
          documentType: data.documentType,
          userId: data.userId,
          status: "processing",
        })
        .returning();

      if (!upload) {
        throw new Error("Failed to create upload record");
      }

      try {
        // 2. Create extracted data record
        const [extracted] = await db
          .insert(extractedData)
          .values({
            uploadId: upload.id,
            documentType: data.documentType,
            data: data.data,
            recordCount: data.data.length,
          })
          .returning();

        if (!extracted) {
          throw new Error("Failed to create extracted data record");
        }

        // 3. Create individual financial records
        const recordsToInsert = data.data.map((record) => {
          let recordType = "transaction";
          if (data.documentType === "invoices") recordType = "invoice";
          else if (data.documentType === "expenses") recordType = "expense";
          else if (data.documentType === "production_sales")
            recordType = "invoice";

          const financialRecord: typeof financialRecords.$inferInsert = {
            extractedDataId: extracted.id,
            uploadId: upload.id,
            recordType,
            date:
              parseDate(
                (record.date as string | number) ||
                  (record.fechaAlbaran as string | number) ||
                  (record.fechaFactura as string | number),
              ) || new Date(),
            description: String(record.description || record.producto || ""),
            amount: convertToCents(
              (record.amount as string | number) ||
                (record.facturacionNeta as string | number) ||
                0,
            ),
            currency: String(record.currency || "EUR"),
            rawData: record,
          };

          if (recordType === "invoice") {
            financialRecord.invoiceNumber = String(
              record.invoiceNumber || record.numeroFactura || "",
            );
            financialRecord.clientName = data.clientName;
            financialRecord.vatAmount = convertToCents(
              (record.vatAmount as string | number) ||
                (record.ivaEuros as string | number) ||
                0,
            );
            financialRecord.totalAmount = convertToCents(
              (record.totalAmount as string | number) ||
                (record.facturacionNeta as string | number) ||
                0,
            );
            financialRecord.dueDate = parseDate(
              record.dueDate as string | number,
            );
            financialRecord.paymentStatus = String(
              record.paymentStatus || "pending",
            );
          }

          if (recordType === "expense") {
            financialRecord.category = String(record.category || "");
            financialRecord.supplier = String(record.supplier || "");
          }

          if (data.documentType === "bank_statements") {
            financialRecord.transactionType = String(
              record.transactionType || "debit",
            );
            financialRecord.balance = convertToCents(
              (record.balance as string | number) || 0,
            );
            financialRecord.reference = String(record.reference || "");
          }

          return financialRecord;
        });

        if (recordsToInsert.length > 0) {
          await db.insert(financialRecords).values(recordsToInsert);
        }

        // 4. Update upload status to completed
        await db
          .update(uploads)
          .set({
            status: "completed",
            processedAt: new Date(),
          })
          .where(eq(uploads.id, upload.id));

        return {
          uploadId: upload.id,
          extractedDataId: extracted.id,
          recordCount: recordsToInsert.length,
        };
      } catch (error) {
        // Update upload status to error
        await db
          .update(uploads)
          .set({
            status: "error",
            errorMessage:
              error instanceof Error ? error.message : "Unknown error",
          })
          .where(eq(uploads.id, upload.id));

        throw new FileProcessingError(
          data.filename,
          error instanceof Error ? error.message : "Unknown error",
        );
      }
    })(),
    (e) => {
      if (e instanceof FileProcessingError) return e;
      return new DatabaseError("createUploadAndStore", e);
    },
  );
}

// Store extracted data for an existing upload
export function storeExtractedData(
  db: Database,
  uploadId: string,
  documentType: string,
  data: ExtractedRecord[],
): ResultAsync<
  { extracted: ExtractedData; recordCount: number },
  UploadNotFoundError | DatabaseError
> {
  return ResultAsync.fromPromise(
    (async () => {
      // Verify upload exists
      const [upload] = await db
        .select()
        .from(uploads)
        .where(eq(uploads.id, uploadId));

      if (!upload) {
        throw new UploadNotFoundError(uploadId);
      }

      // Create extracted data record
      const [extracted] = await db
        .insert(extractedData)
        .values({
          uploadId,
          documentType,
          data,
          recordCount: data.length,
        })
        .returning();

      if (!extracted) {
        throw new Error("Failed to create extracted data record");
      }

      // Create financial records
      const recordsToInsert = data.map((record) => {
        let recordType = "transaction";
        if (documentType === "invoices") recordType = "invoice";
        else if (documentType === "expenses") recordType = "expense";

        const financialRecord: typeof financialRecords.$inferInsert = {
          extractedDataId: extracted.id,
          uploadId,
          recordType,
          date:
            parseDate(
              (record.date as string | number) ||
                (record.fechaAlbaran as string | number) ||
                (record.fechaFactura as string | number),
            ) || new Date(),
          description: String(record.description || record.producto || ""),
          amount: convertToCents(
            (record.amount as string | number) ||
              (record.facturacionNeta as string | number) ||
              0,
          ),
          currency: String(record.currency || "EUR"),
          rawData: record,
        };

        if (recordType === "invoice") {
          financialRecord.invoiceNumber = String(
            record.invoiceNumber || record.numeroFactura || "",
          );
          financialRecord.clientName = String(record.clientName || "");
          financialRecord.vatAmount = convertToCents(
            (record.vatAmount as string | number) ||
              (record.ivaEuros as string | number) ||
              0,
          );
          financialRecord.totalAmount = convertToCents(
            (record.totalAmount as string | number) ||
              (record.facturacionNeta as string | number) ||
              0,
          );
          financialRecord.dueDate = parseDate(
            record.dueDate as string | number,
          );
          financialRecord.paymentStatus = String(
            record.paymentStatus || "pending",
          );
        }

        if (recordType === "expense") {
          financialRecord.category = String(record.category || "");
          financialRecord.supplier = String(record.supplier || "");
        }

        if (documentType === "bank_statements") {
          financialRecord.transactionType = String(
            record.transactionType || "debit",
          );
          financialRecord.balance = convertToCents(
            (record.balance as string | number) || 0,
          );
          financialRecord.reference = String(record.reference || "");
        }

        return financialRecord;
      });

      if (recordsToInsert.length > 0) {
        await db.insert(financialRecords).values(recordsToInsert);
      }

      return { extracted, recordCount: recordsToInsert.length };
    })(),
    (e) => {
      if (e instanceof UploadNotFoundError) return e;
      return new DatabaseError("storeExtractedData", e);
    },
  );
}

// Get all data schemas
export function getDataSchemas(
  db: Database,
): ResultAsync<DataSchema[], DatabaseError> {
  return ResultAsync.fromPromise(
    db.select().from(dataSchemas),
    (e) => new DatabaseError("getDataSchemas", e),
  );
}
