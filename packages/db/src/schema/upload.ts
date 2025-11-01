import { pgTable, text, timestamp, integer, uuid, jsonb } from "drizzle-orm/pg-core";

export const uploads = pgTable("uploads", {
  id: uuid("id").defaultRandom().primaryKey(),
  filename: text("filename").notNull(),
  fileType: text("file_type").notNull(), // pdf, csv, xlsx
  fileSize: integer("file_size").notNull(), // in bytes
  fileUrl: text("file_url"), // storage URL
  clientName: text("client_name"), // which client this belongs to
  documentType: text("document_type"), // invoices, expenses, bank_statements, etc
  status: text("status").notNull().default("pending"), // pending, processing, completed, error
  uploadedAt: timestamp("uploaded_at").notNull().defaultNow(),
  processedAt: timestamp("processed_at"),
  userId: text("user_id").notNull(), // who uploaded it
  errorMessage: text("error_message"),
});

// Schema definitions for different document types
export const dataSchemas = pgTable("data_schemas", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(), // e.g., "Invoice Schema", "Expense Schema"
  documentType: text("document_type").notNull(), // invoices, expenses, bank_statements
  schema: jsonb("schema").notNull(), // JSON schema defining expected fields
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Extracted financial data
export const extractedData = pgTable("extracted_data", {
  id: uuid("id").defaultRandom().primaryKey(),
  uploadId: uuid("upload_id").notNull().references(() => uploads.id, { onDelete: "cascade" }),
  schemaId: uuid("schema_id").references(() => dataSchemas.id),
  documentType: text("document_type").notNull(),
  data: jsonb("data").notNull(), // array of extracted records
  recordCount: integer("record_count").notNull().default(0),
  validationErrors: jsonb("validation_errors"), // any validation issues
  extractedAt: timestamp("extracted_at").notNull().defaultNow(),
});

// Individual financial records (normalized)
export const financialRecords = pgTable("financial_records", {
  id: uuid("id").defaultRandom().primaryKey(),
  extractedDataId: uuid("extracted_data_id").notNull().references(() => extractedData.id, { onDelete: "cascade" }),
  uploadId: uuid("upload_id").notNull().references(() => uploads.id),
  recordType: text("record_type").notNull(), // invoice, expense, transaction
  
  // Common fields
  date: timestamp("date").notNull(),
  description: text("description"),
  amount: integer("amount").notNull(), // in cents to avoid floating point issues
  currency: text("currency").default("EUR"),
  
  // Invoice specific
  invoiceNumber: text("invoice_number"),
  clientName: text("client_name"),
  vatAmount: integer("vat_amount"), // in cents
  totalAmount: integer("total_amount"), // in cents
  dueDate: timestamp("due_date"),
  paymentStatus: text("payment_status"), // paid, pending, overdue
  
  // Expense specific
  category: text("category"),
  supplier: text("supplier"),
  
  // Bank transaction specific
  transactionType: text("transaction_type"), // debit, credit
  balance: integer("balance"), // in cents
  reference: text("reference"),
  
  // Metadata
  rawData: jsonb("raw_data"), // original extracted data
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

