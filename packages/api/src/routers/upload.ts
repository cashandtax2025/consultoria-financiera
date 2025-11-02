import {
  dataSchemas,
  extractedData,
  financialRecords,
  uploads,
} from "@consultoria-financiera/db/schema/upload";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

const uploadStatusEnum = z.enum([
  "pending",
  "processing",
  "completed",
  "error",
]);
const documentTypeEnum = z.enum([
  "invoices",
  "expenses",
  "bank_statements",
  "cash_flow",
  "production_sales",
  "other",
]);

// Schema for creating an upload record
const createUploadSchema = z.object({
  filename: z.string(),
  fileType: z.string(),
  fileSize: z.number(),
  clientName: z.string(),
  documentType: z.string(),
});

// Schema for storing extracted data
const storeExtractedDataSchema = z.object({
  uploadId: z.string().uuid(),
  documentType: z.string(),
  data: z.array(z.record(z.any())),
});

// Schema for creating upload and storing data in one go
const createUploadAndStoreSchema = z.object({
  filename: z.string(),
  fileType: z.string(),
  fileSize: z.number(),
  clientName: z.string(),
  documentType: z.string(),
  data: z.array(z.record(z.union([z.string(), z.number()]))),
});

export const uploadRouter = router({
  // Create a new upload record and store extracted data
  createUploadAndStore: protectedProcedure
    .input(createUploadAndStoreSchema)
    .mutation(async ({ ctx, input }) => {
      // 1. Create upload record
      const [upload] = await ctx.db
        .insert(uploads)
        .values({
          filename: input.filename,
          fileType: input.fileType,
          fileSize: input.fileSize,
          clientName: input.clientName,
          documentType: input.documentType,
          userId: ctx.session.user.id,
          status: "processing",
        })
        .returning();

      try {
        // 2. Create extracted data record
        const [extracted] = await ctx.db
          .insert(extractedData)
          .values({
            uploadId: upload.id,
            documentType: input.documentType,
            data: input.data,
            recordCount: input.data.length,
          })
          .returning();

        // 3. Create individual financial records
        const convertToCents = (value: string | number): number => {
          if (typeof value === "number") {
            return Math.round(value * 100);
          }
          if (typeof value === "string") {
            const num = parseFloat(value.replace(/,/g, "."));
            return Number.isNaN(num) ? 0 : Math.round(num * 100);
          }
          return 0;
        };

        const parseDate = (value: string | number): Date | null => {
          if (!value) return null;
          if (value instanceof Date) return value;

          const dateStr = String(value);
          const date = new Date(dateStr);

          if (Number.isNaN(date.getTime())) {
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
        };

        const recordsToInsert = input.data.map((record) => {
          let recordType = "transaction";
          if (input.documentType === "invoices") recordType = "invoice";
          else if (input.documentType === "expenses") recordType = "expense";
          else if (input.documentType === "production_sales")
            recordType = "invoice";

          const financialRecord = {
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
            invoiceNumber: undefined as string | undefined,
            clientName: undefined as string | undefined,
            vatAmount: undefined as number | undefined,
            totalAmount: undefined as number | undefined,
            dueDate: undefined as Date | null | undefined,
            paymentStatus: undefined as string | undefined,
            category: undefined as string | undefined,
            supplier: undefined as string | undefined,
            transactionType: undefined as string | undefined,
            balance: undefined as number | undefined,
            reference: undefined as string | undefined,
          };

          if (recordType === "invoice") {
            financialRecord.invoiceNumber = String(
              record.invoiceNumber || record.numeroFactura || "",
            );
            financialRecord.clientName = input.clientName;
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
            financialRecord.dueDate = parseDate(record.dueDate as string | number);
            financialRecord.paymentStatus = String(
              record.paymentStatus || "pending",
            );
          }

          if (recordType === "expense") {
            financialRecord.category = String(record.category || "");
            financialRecord.supplier = String(record.supplier || "");
          }

          if (input.documentType === "bank_statements") {
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
          await ctx.db.insert(financialRecords).values(recordsToInsert);
        }

        // 4. Update upload status to completed
        await ctx.db
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
        await ctx.db
          .update(uploads)
          .set({
            status: "error",
            errorMessage:
              error instanceof Error ? error.message : "Unknown error",
          })
          .where(eq(uploads.id, upload.id));

        throw error;
      }
    }),

  // Create a new upload record
  createUpload: protectedProcedure
    .input(createUploadSchema)
    .mutation(async ({ ctx, input }) => {
      const [upload] = await ctx.db
        .insert(uploads)
        .values({
          filename: input.filename,
          fileType: input.fileType,
          fileSize: input.fileSize,
          clientName: input.clientName,
          documentType: input.documentType,
          userId: ctx.session.user.id,
          status: "pending",
        })
        .returning();

      return upload;
    }),

  // Update upload status
  updateUploadStatus: protectedProcedure
    .input(
      z.object({
        uploadId: z.string().uuid(),
        status: uploadStatusEnum,
        errorMessage: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(uploads)
        .set({
          status: input.status,
          errorMessage: input.errorMessage,
          processedAt: input.status === "completed" ? new Date() : undefined,
        })
        .where(eq(uploads.id, input.uploadId))
        .returning();

      return updated;
    }),

  // Store extracted data
  storeExtractedData: protectedProcedure
    .input(storeExtractedDataSchema)
    .mutation(async ({ ctx, input }) => {
      // First, create the extracted data record
      const [extracted] = await ctx.db
        .insert(extractedData)
        .values({
          uploadId: input.uploadId,
          documentType: input.documentType,
          data: input.data,
          recordCount: input.data.length,
        })
        .returning();

      // Then, create individual financial records
      const recordsToInsert = input.data.map((record) => {
        // Convert amounts to cents if they exist
        const convertToCents = (value: any) => {
          if (typeof value === "number") {
            return Math.round(value * 100);
          }
          if (typeof value === "string") {
            const num = parseFloat(value.replace(/,/g, "."));
            return isNaN(num) ? 0 : Math.round(num * 100);
          }
          return 0;
        };

        // Parse dates
        const parseDate = (value: any) => {
          if (!value) return null;
          if (value instanceof Date) return value;

          // Try parsing various date formats
          const dateStr = String(value);
          const date = new Date(dateStr);

          if (isNaN(date.getTime())) {
            // Try dd/mm/yyyy format
            const parts = dateStr.split("/");
            if (parts.length === 3) {
              const [day, month, year] = parts;
              const fullYear = year.length === 2 ? `20${year}` : year;
              return new Date(
                `${fullYear}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
              );
            }
            return null;
          }

          return date;
        };

        // Determine record type based on document type
        let recordType = "transaction";
        if (input.documentType === "invoices") recordType = "invoice";
        else if (input.documentType === "expenses") recordType = "expense";

        // Build the financial record
        const financialRecord: any = {
          extractedDataId: extracted.id,
          uploadId: input.uploadId,
          recordType,
          date:
            parseDate(
              record.date || record.fechaAlbaran || record.fechaFactura,
            ) || new Date(),
          description: record.description || record.producto || "",
          amount: convertToCents(record.amount || record.facturacionNeta || 0),
          currency: record.currency || "EUR",
          rawData: record,
        };

        // Add invoice-specific fields
        if (recordType === "invoice") {
          financialRecord.invoiceNumber =
            record.invoiceNumber || record.numeroFactura;
          financialRecord.clientName = record.clientName;
          financialRecord.vatAmount = convertToCents(
            record.vatAmount || record.ivaEuros,
          );
          financialRecord.totalAmount = convertToCents(
            record.totalAmount || record.facturacionNeta,
          );
          financialRecord.dueDate = parseDate(record.dueDate);
          financialRecord.paymentStatus = record.paymentStatus || "pending";
        }

        // Add expense-specific fields
        if (recordType === "expense") {
          financialRecord.category = record.category;
          financialRecord.supplier = record.supplier;
        }

        // Add bank transaction fields
        if (input.documentType === "bank_statements") {
          financialRecord.transactionType = record.transactionType;
          financialRecord.balance = convertToCents(record.balance);
          financialRecord.reference = record.reference;
        }

        return financialRecord;
      });

      if (recordsToInsert.length > 0) {
        await ctx.db.insert(financialRecords).values(recordsToInsert);
      }

      return {
        extracted,
        recordCount: recordsToInsert.length,
      };
    }),

  // Get user's uploads
  getUserUploads: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        offset: z.number().min(0).default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userUploads = await ctx.db
        .select()
        .from(uploads)
        .where(eq(uploads.userId, ctx.session.user.id))
        .orderBy(desc(uploads.uploadedAt))
        .limit(input.limit)
        .offset(input.offset);

      return userUploads;
    }),

  // Get upload by ID with extracted data
  getUploadById: protectedProcedure
    .input(z.object({ uploadId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [upload] = await ctx.db
        .select()
        .from(uploads)
        .where(eq(uploads.id, input.uploadId));

      if (!upload) {
        throw new Error("Upload not found");
      }

      // Get extracted data for this upload
      const extracted = await ctx.db
        .select()
        .from(extractedData)
        .where(eq(extractedData.uploadId, input.uploadId));

      // Get financial records
      const records = await ctx.db
        .select()
        .from(financialRecords)
        .where(eq(financialRecords.uploadId, input.uploadId))
        .orderBy(desc(financialRecords.date));

      return {
        upload,
        extractedData: extracted,
        records,
      };
    }),

  // Get all data schemas
  getDataSchemas: protectedProcedure.query(async ({ ctx }) => {
    const schemas = await ctx.db.select().from(dataSchemas);
    return schemas;
  }),
});
