import { auth } from "@consultoria-financiera/auth";
import { type NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

// Helper function to parse Excel/CSV files
async function parseFile(file: File): Promise<Record<string, any>[]> {
  const fileBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(fileBuffer, { type: "array" });

  // Get the first sheet
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  // Convert to JSON with header row
  const jsonData = XLSX.utils.sheet_to_json(sheet, {
    raw: false, // Keep values as strings to preserve formatting
    defval: "", // Default value for empty cells
  });

  return jsonData as Record<string, any>[];
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
  data: Record<string, any>[],
  documentType: string,
): Record<string, any>[] {
  return data.map((row) => {
    const normalized: Record<string, any> = {};

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

      const mapped: Record<string, any> = {};
      for (const [key, value] of Object.entries(normalized)) {
        const mappedKey = fieldMappings[key] || key;
        mapped[mappedKey] = value;
      }

      return mapped;
    }

    return normalized;
  });
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
    ];

    if (
      !validTypes.includes(file.type) &&
      !file.name.match(/\.(xlsx|xls|csv)$/i)
    ) {
      return NextResponse.json(
        { error: "Invalid file type. Only Excel and CSV files are supported." },
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

    // Return the parsed data
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
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to process file" },
      { status: 500 },
    );
  }
}
