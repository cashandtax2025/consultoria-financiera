import { auth } from "@consultoria-financiera/auth";
import { type NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

// Helper function to parse PDF files
async function parsePDF(
  file: File,
): Promise<Record<string, string | number>[]> {
  // Dynamic import for pdf-parse to avoid build issues
  const pdfParseModule = await import("pdf-parse");
  // pdf-parse exports the function directly, not as default
  const pdfParse = (pdfParseModule as any).default || (pdfParseModule as any);
  const fileBuffer = await file.arrayBuffer();
  // Convert ArrayBuffer to Buffer for pdf-parse
  const buffer = Buffer.from(fileBuffer);
  const data = await pdfParse(buffer);

  // Extract text from PDF
  const text = data.text;

  // For now, return the extracted text as a single record
  // In the future, this could be enhanced with AI to structure the data
  return [
    {
      extractedText: text,
      pageCount: data.numpages,
      metadata: JSON.stringify(data.info || {}),
    },
  ];
}

// Helper function to parse Excel/CSV files
async function parseExcelCSV(
  file: File,
): Promise<Record<string, string | number>[]> {
  const fileBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(fileBuffer, { type: "array" });

  // Get the first sheet
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw new Error("No sheets found in file");
  }
  const sheet = workbook.Sheets[sheetName];

  // Convert to JSON with header row
  const jsonData = XLSX.utils.sheet_to_json(sheet, {
    raw: false, // Keep values as strings to preserve formatting
    defval: "", // Default value for empty cells
  });

  return jsonData as Record<string, string | number>[];
}

// Main parse function that routes to the appropriate parser
async function parseFile(
  file: File,
): Promise<Record<string, string | number>[]> {
  const fileExtension = file.name.toLowerCase().split(".").pop();
  const fileType = file.type;

  // Check if it's a PDF
  if (
    fileExtension === "pdf" ||
    fileType === "application/pdf"
  ) {
    return await parsePDF(file);
  }

  // Otherwise, treat as Excel/CSV
  return await parseExcelCSV(file);
}

// Helper to normalize field names (remove spaces, convert to camelCase)
function normalizeFieldName(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^\w\s]/gi, "")
    .replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    .replace(/^_/, "");
}

// Helper to normalize data based on document type
function normalizeData(
  data: Record<string, string | number>[],
  documentType: string,
): Record<string, string | number>[] {
  return data.map((row) => {
    const normalized: Record<string, string | number> = {};

    // Normalize all keys
    for (const [key, value] of Object.entries(row)) {
      const normalizedKey = normalizeFieldName(key);
      normalized[normalizedKey] = value;
    }

    // Document type specific mappings
    if (documentType === "production_sales") {
      // Map Spanish field names to schema field names
      const fieldMappings: Record<string, string> = {
        finca: "finca",
        fechaAlbaran: "fechaAlbaran",
        fechaAlbarán: "fechaAlbaran",
        nAlbaran: "numeroAlbaran",
        numeroAlbaran: "numeroAlbaran",
        fechaFactura: "fechaFactura",
        nFactura: "numeroFactura",
        numeroFactura: "numeroFactura",
        fechaPago: "fechaPago",
        nProducto: "numeroProducto",
        numeroProducto: "numeroProducto",
        producto: "producto",
        tipoProducto: "tipoProducto",
        tipo: "tipoProducto",
        kgs: "kgs",
        kg: "kgs",
        kilos: "kgs",
        precio: "precio",
        descuento: "descuento",
        desc: "descuento",
        facturacionAntesImpuestos: "facturacionAntesImpuestos",
        precioAntesImpuestos: "precioAntesImpuestos",
        retenciones: "retencionesPercent",
        retencionesPercent: "retencionesPercent",
        retencionesEuros: "retencionesEuros",
        iva: "ivaPercent",
        ivaPercent: "ivaPercent",
        ivaEuros: "ivaEuros",
        facturacionNeta: "facturacionNeta",
        precioNeto: "precioNeto",
        facturacion: "facturacion",
      };

      const mapped: Record<string, string | number> = {};
      for (const [key, value] of Object.entries(normalized)) {
        const mappedKey = fieldMappings[key] || key;
        mapped[mappedKey] = value;
      }

      return mapped;
    }

    // Invoice mappings
    if (documentType === "invoices") {
      const fieldMappings: Record<string, string> = {
        fecha: "date",
        numeroFactura: "invoiceNumber",
        nFactura: "invoiceNumber",
        cliente: "clientName",
        descripcion: "description",
        importe: "amount",
        iva: "vatAmount",
        total: "totalAmount",
        moneda: "currency",
        fechaVencimiento: "dueDate",
        estado: "paymentStatus",
      };

      const mapped: Record<string, string | number> = {};
      for (const [key, value] of Object.entries(normalized)) {
        const mappedKey = fieldMappings[key] || key;
        mapped[mappedKey] = value;
      }

      return mapped;
    }

    // Expense mappings
    if (documentType === "expenses") {
      const fieldMappings: Record<string, string> = {
        fecha: "date",
        categoria: "category",
        descripcion: "description",
        proveedor: "supplier",
        importe: "amount",
        iva: "vatAmount",
        moneda: "currency",
        referencia: "reference",
        metodoPago: "paymentMethod",
      };

      const mapped: Record<string, string | number> = {};
      for (const [key, value] of Object.entries(normalized)) {
        const mappedKey = fieldMappings[key] || key;
        mapped[mappedKey] = value;
      }

      return mapped;
    }

    // Bank statement mappings
    if (documentType === "bank_statements") {
      const fieldMappings: Record<string, string> = {
        fecha: "date",
        descripcion: "description",
        referencia: "reference",
        importe: "amount",
        tipo: "transactionType",
        saldo: "balance",
        moneda: "currency",
        categoria: "category",
      };

      const mapped: Record<string, string | number> = {};
      for (const [key, value] of Object.entries(normalized)) {
        const mappedKey = fieldMappings[key] || key;
        mapped[mappedKey] = value;
      }

      return mapped;
    }

    // Cash flow mappings
    if (documentType === "cash_flow") {
      const fieldMappings: Record<string, string> = {
        periodo: "period",
        fechaInicio: "startDate",
        fechaFin: "endDate",
        ingresos: "income",
        gastos: "expenses",
        flujoNeto: "netFlow",
        saldoInicial: "openingBalance",
        saldoFinal: "closingBalance",
        moneda: "currency",
      };

      const mapped: Record<string, string | number> = {};
      for (const [key, value] of Object.entries(normalized)) {
        const mappedKey = fieldMappings[key] || key;
        mapped[mappedKey] = value;
      }

      return mapped;
    }

    return normalized;
  });
}

// Convert amounts to cents
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

// Parse dates
function parseDate(value: string | number | Date): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;

  // Try parsing various date formats
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

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const clientName = formData.get("clientName") as string;
    const documentType = formData.get("documentType") as string;
    const saveToDb = formData.get("saveToDb") === "true";

    if (!file || !clientName || !documentType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate file type
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/vnd.ms-excel", // .xls
      "text/csv",
      "application/pdf", // .pdf
    ];

    if (
      !validTypes.includes(file.type) &&
      !file.name.match(/\.(xlsx|xls|csv|pdf)$/i)
    ) {
      return NextResponse.json(
        { error: "Invalid file type. Only Excel, CSV, and PDF files are supported." },
        { status: 400 },
      );
    }

    // Parse the file
    const parsedData = await parseFile(file);

    if (parsedData.length === 0) {
      return NextResponse.json(
        { error: "No data found in file" },
        { status: 400 },
      );
    }

    // Normalize the data
    const normalizedData = normalizeData(parsedData, documentType);

    // If saveToDb is false, just return preview
    if (!saveToDb) {
      return NextResponse.json({
        success: true,
        data: normalizedData,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.name.split(".").pop(),
        recordCount: normalizedData.length,
        clientName,
        documentType,
      });
    }

    // Note: Actual database insertion will be handled by tRPC on the client side
    // This endpoint only parses and returns the data
    // For now, return success with instruction to use tRPC mutation
    return NextResponse.json({
      success: true,
      data: normalizedData,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.name.split(".").pop(),
      recordCount: normalizedData.length,
      clientName,
      documentType,
      message:
        "File parsed successfully. Please use tRPC mutation to save to database.",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error: "Failed to process file",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
