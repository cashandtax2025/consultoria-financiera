import {
  createUpload,
  createUploadAndStore,
  getDataSchemas,
  getUploadById,
  getUserUploads,
  storeExtractedData,
  type UploadStatus,
  updateUploadStatus,
} from "@consultoria-financiera/core/uploads";
import { z } from "zod";
import { unwrapResultAsync } from "../lib/error-mapper";
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

const createUploadSchema = z.object({
  filename: z.string(),
  fileType: z.string(),
  fileSize: z.number(),
  clientName: z.string(),
  documentType: z.string(),
});

const storeExtractedDataSchema = z.object({
  uploadId: z.string().uuid(),
  documentType: z.string(),
  data: z.array(z.record(z.string(), z.unknown())),
});

const createUploadAndStoreSchema = z.object({
  filename: z.string(),
  fileType: z.string(),
  fileSize: z.number(),
  clientName: z.string(),
  documentType: z.string(),
  data: z.array(z.record(z.string(), z.unknown())),
});

export const uploadRouter = router({
  createUploadAndStore: protectedProcedure
    .input(createUploadAndStoreSchema)
    .mutation(async ({ ctx, input }) => {
      return unwrapResultAsync(
        createUploadAndStore(ctx.db, {
          filename: input.filename,
          fileType: input.fileType,
          fileSize: input.fileSize,
          clientName: input.clientName,
          documentType: input.documentType,
          userId: ctx.session.user.id,
          data: input.data,
        }),
      );
    }),

  createUpload: protectedProcedure
    .input(createUploadSchema)
    .mutation(async ({ ctx, input }) => {
      return unwrapResultAsync(
        createUpload(ctx.db, {
          filename: input.filename,
          fileType: input.fileType,
          fileSize: input.fileSize,
          clientName: input.clientName,
          documentType: input.documentType,
          userId: ctx.session.user.id,
        }),
      );
    }),

  updateUploadStatus: protectedProcedure
    .input(
      z.object({
        uploadId: z.string().uuid(),
        status: uploadStatusEnum,
        errorMessage: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return unwrapResultAsync(
        updateUploadStatus(
          ctx.db,
          input.uploadId,
          input.status as UploadStatus,
          input.errorMessage,
        ),
      );
    }),

  storeExtractedData: protectedProcedure
    .input(storeExtractedDataSchema)
    .mutation(async ({ ctx, input }) => {
      return unwrapResultAsync(
        storeExtractedData(
          ctx.db,
          input.uploadId,
          input.documentType,
          input.data,
        ),
      );
    }),

  getUserUploads: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        offset: z.number().min(0).default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      return unwrapResultAsync(
        getUserUploads(ctx.db, ctx.session.user.id, {
          limit: input.limit,
          offset: input.offset,
        }),
      );
    }),

  getUploadById: protectedProcedure
    .input(z.object({ uploadId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return unwrapResultAsync(getUploadById(ctx.db, input.uploadId));
    }),

  getDataSchemas: protectedProcedure.query(async ({ ctx }) => {
    return unwrapResultAsync(getDataSchemas(ctx.db));
  }),
});
