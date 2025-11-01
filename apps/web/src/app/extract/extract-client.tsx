"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/utils/trpc";

const DOCUMENT_TYPES = [
  { value: "invoices", label: "Invoices" },
  { value: "expenses", label: "Expenses" },
  { value: "bank_statements", label: "Bank Statements" },
  { value: "cash_flow", label: "Cash Flow Reports" },
  { value: "production_sales", label: "Production Sales (Agricultural)" },
  { value: "other", label: "Other" },
] as const;

const SCHEMAS = {
  invoices: [
    { name: "date", type: "date", required: true, description: "Invoice date" },
    {
      name: "invoiceNumber",
      type: "string",
      required: true,
      description: "Invoice number or reference",
    },
    {
      name: "clientName",
      type: "string",
      required: true,
      description: "Client/customer name",
    },
    {
      name: "description",
      type: "string",
      required: false,
      description: "Service or product description",
    },
    {
      name: "amount",
      type: "number",
      required: true,
      description: "Net amount (without VAT)",
    },
    {
      name: "vatAmount",
      type: "number",
      required: false,
      description: "VAT/tax amount",
    },
    {
      name: "totalAmount",
      type: "number",
      required: true,
      description: "Total amount (including VAT)",
    },
    {
      name: "dueDate",
      type: "date",
      required: false,
      description: "Payment due date",
    },
    {
      name: "paymentStatus",
      type: "string",
      required: false,
      description: "Payment status (paid, pending, overdue)",
    },
  ],
  expenses: [
    { name: "date", type: "date", required: true, description: "Expense date" },
    {
      name: "category",
      type: "string",
      required: true,
      description: "Expense category (e.g., office supplies, salaries, rent)",
    },
    {
      name: "description",
      type: "string",
      required: true,
      description: "Expense description",
    },
    {
      name: "supplier",
      type: "string",
      required: false,
      description: "Supplier/vendor name",
    },
    {
      name: "amount",
      type: "number",
      required: true,
      description: "Expense amount",
    },
    {
      name: "vatAmount",
      type: "number",
      required: false,
      description: "VAT amount if applicable",
    },
    {
      name: "reference",
      type: "string",
      required: false,
      description: "Invoice or reference number",
    },
    {
      name: "paymentMethod",
      type: "string",
      required: false,
      description: "Payment method (cash, card, transfer)",
    },
  ],
  bank_statements: [
    {
      name: "date",
      type: "date",
      required: true,
      description: "Transaction date",
    },
    {
      name: "description",
      type: "string",
      required: true,
      description: "Transaction description",
    },
    {
      name: "reference",
      type: "string",
      required: false,
      description: "Transaction reference",
    },
    {
      name: "amount",
      type: "number",
      required: true,
      description: "Transaction amount",
    },
    {
      name: "transactionType",
      type: "string",
      required: true,
      description: "Transaction type (debit, credit)",
    },
    {
      name: "balance",
      type: "number",
      required: false,
      description: "Account balance after transaction",
    },
    {
      name: "category",
      type: "string",
      required: false,
      description: "Transaction category",
    },
  ],
  cash_flow: [
    {
      name: "period",
      type: "string",
      required: true,
      description: "Period (e.g., 2024-01, Q1 2024)",
    },
    {
      name: "startDate",
      type: "date",
      required: true,
      description: "Period start date",
    },
    {
      name: "endDate",
      type: "date",
      required: true,
      description: "Period end date",
    },
    {
      name: "income",
      type: "number",
      required: true,
      description: "Total income for the period",
    },
    {
      name: "expenses",
      type: "number",
      required: true,
      description: "Total expenses for the period",
    },
    {
      name: "netFlow",
      type: "number",
      required: true,
      description: "Net cash flow (income - expenses)",
    },
    {
      name: "openingBalance",
      type: "number",
      required: false,
      description: "Balance at period start",
    },
    {
      name: "closingBalance",
      type: "number",
      required: false,
      description: "Balance at period end",
    },
  ],
  production_sales: [
    {
      name: "finca",
      type: "string",
      required: false,
      description: "Farm/location identifier",
    },
    {
      name: "fechaAlbaran",
      type: "date",
      required: true,
      description: "Delivery note date",
    },
    {
      name: "numeroAlbaran",
      type: "string",
      required: true,
      description: "Delivery note number",
    },
    {
      name: "fechaFactura",
      type: "date",
      required: false,
      description: "Invoice date",
    },
    {
      name: "numeroFactura",
      type: "string",
      required: false,
      description: "Invoice number",
    },
    {
      name: "fechaPago",
      type: "date",
      required: false,
      description: "Payment date",
    },
    {
      name: "numeroProducto",
      type: "string",
      required: true,
      description: "Product number/code",
    },
    {
      name: "producto",
      type: "string",
      required: true,
      description: "Product name",
    },
    {
      name: "tipoProducto",
      type: "string",
      required: false,
      description: "Product type/quality",
    },
    {
      name: "kgs",
      type: "number",
      required: true,
      description: "Kilograms produced/sold",
    },
    {
      name: "precio",
      type: "number",
      required: true,
      description: "Price per kg",
    },
    {
      name: "descuento",
      type: "number",
      required: false,
      description: "Discount",
    },
    {
      name: "facturacionAntesImpuestos",
      type: "number",
      required: true,
      description: "Billing before taxes",
    },
    {
      name: "precioAntesImpuestos",
      type: "number",
      required: false,
      description: "Price before taxes",
    },
    {
      name: "retencionesPercent",
      type: "number",
      required: false,
      description: "Withholdings %",
    },
    {
      name: "retencionesEuros",
      type: "number",
      required: false,
      description: "Withholdings €",
    },
    {
      name: "ivaPercent",
      type: "number",
      required: false,
      description: "VAT %",
    },
    { name: "ivaEuros", type: "number", required: false, description: "VAT €" },
    {
      name: "facturacionNeta",
      type: "number",
      required: true,
      description: "Net billing",
    },
    {
      name: "precioNeto",
      type: "number",
      required: false,
      description: "Net price per kg",
    },
  ],
  other: [
    {
      name: "Custom fields",
      type: "mixed",
      required: false,
      description: "Will attempt to extract all available data",
    },
  ],
};

function getSchemaFields(documentType: string) {
  return SCHEMAS[documentType as keyof typeof SCHEMAS] || SCHEMAS.other;
}

export default function ExtractPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [clientName, setClientName] = useState("");
  const [documentType, setDocumentType] = useState<string>("invoices");
  const [uploading, setUploading] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);

  // Fetch recent uploads
  const recentUploadsQuery = trpc.upload.getUserUploads.queryOptions({
    limit: 10,
    offset: 0,
  });
  const recentUploads = useQuery(recentUploadsQuery);

  // Mutations
  const createUpload = useMutation(trpc.upload.createUpload.mutationOptions());
  const updateUploadStatus = useMutation(
    trpc.upload.updateUploadStatus.mutationOptions(),
  );
  const storeExtractedData = useMutation(
    trpc.upload.storeExtractedData.mutationOptions(),
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (files.length === 0 || !clientName.trim()) {
      toast.error("Please select files and enter client name");
      return;
    }

    setUploading(true);

    try {
      // Process each file
      for (const file of files) {
        toast.info(`Processing ${file.name}...`);

        // Upload file to API for parsing
        const formData = new FormData();
        formData.append("file", file);
        formData.append("clientName", clientName);
        formData.append("documentType", documentType);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Upload failed");
        }

        const result = await response.json();

        // Create upload record in database
        const upload = await createUpload.mutateAsync({
          filename: result.fileName,
          fileType: result.fileType,
          fileSize: result.fileSize,
          clientName: result.clientName,
          documentType: result.documentType,
        });

        if (!upload) {
          throw new Error("Failed to create upload record");
        }

        // Store extracted data
        await storeExtractedData.mutateAsync({
          uploadId: upload.id,
          documentType: result.documentType,
          data: result.data,
        });

        // Update upload status to completed
        await updateUploadStatus.mutateAsync({
          uploadId: upload.id,
          status: "completed",
        });

        // Show extracted data
        setExtractedData({
          fileName: result.fileName,
          recordCount: result.recordCount,
          data: result.data.slice(0, 5), // Show first 5 records
        });

        toast.success(
          `Successfully processed ${result.fileName} - ${result.recordCount} records extracted`,
        );
      }

      // Refresh uploads list
      await recentUploads.refetch();

      // Reset form
      setFiles([]);
      setClientName("");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload file",
      );
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / k ** i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Data Extraction</h1>
        <p className="text-muted-foreground">
          Upload client financial documents for analysis
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload Files</CardTitle>
            <CardDescription>
              Upload PDF, CSV, or Excel files containing financial data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="client-name">Client Name</Label>
              <Input
                id="client-name"
                type="text"
                placeholder="e.g., Acme Corp"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="document-type">Document Type</Label>
              <select
                id="document-type"
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {DOCUMENT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file-upload">Select Files</Label>
              <Input
                id="file-upload"
                type="file"
                multiple
                accept=".pdf,.csv,.xlsx,.xls"
                onChange={handleFileChange}
              />
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Files ({files.length})</Label>
                <div className="rounded-md border p-4 space-y-2 max-h-48 overflow-y-auto">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="truncate flex-1">{file.name}</span>
                      <span className="text-muted-foreground ml-2">
                        {formatFileSize(file.size)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={handleUpload}
              disabled={files.length === 0 || !clientName.trim() || uploading}
              className="w-full"
            >
              {uploading ? "Uploading..." : "Upload & Extract"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Extractions</CardTitle>
            <CardDescription>View recently processed files</CardDescription>
          </CardHeader>
          <CardContent>
            {recentUploads.data && recentUploads.data.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recentUploads.data.map((upload: any) => (
                  <div
                    key={upload.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {upload.filename}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {upload.clientName} • {upload.documentType}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(upload.uploadedAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          upload.status === "completed"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : upload.status === "error"
                              ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                              : upload.status === "processing"
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                                : "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300"
                        }`}
                      >
                        {upload.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No extractions yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {extractedData && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Extracted Data Preview</CardTitle>
            <CardDescription>
              Showing first 5 records from {extractedData.fileName} (
              {extractedData.recordCount} total records)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    {extractedData.data.length > 0 &&
                      Object.keys(extractedData.data[0]).map((key) => (
                        <th key={key} className="text-left p-2 font-medium">
                          {key}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {extractedData.data.map((row: any, idx: number) => (
                    <tr key={idx} className="border-b">
                      {Object.values(row).map((value: any, i: number) => (
                        <td key={i} className="p-2">
                          {String(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Supported File Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">PDF Documents</h3>
                <p className="text-sm text-muted-foreground">
                  Invoices, bank statements, financial reports
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Excel Files</h3>
                <p className="text-sm text-muted-foreground">
                  Accounting exports, spreadsheets (.xlsx, .xls)
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">CSV Files</h3>
                <p className="text-sm text-muted-foreground">
                  Transaction data, accounting system exports
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expected Data Schema</CardTitle>
            <CardDescription>
              Fields we'll extract for{" "}
              {DOCUMENT_TYPES.find((t) => t.value === documentType)?.label}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {getSchemaFields(documentType).map((field, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-2 rounded-md bg-muted/50"
                >
                  <div className="flex-1">
                    <div className="font-medium">{field.name}</div>
                    <div className="text-muted-foreground text-xs">
                      {field.description}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {field.required ? "Required" : "Optional"}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
