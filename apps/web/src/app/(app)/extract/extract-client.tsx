/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/utils/trpc";

const DOCUMENT_TYPES = [
  { value: "invoices", label: "Facturas" },
  { value: "expenses", label: "Gastos" },
  { value: "bank_statements", label: "Extractos Bancarios" },
  { value: "cash_flow", label: "Informes de Flujo de Caja" },
  { value: "production_sales", label: "Ventas de Producción (Agrícola)" },
  { value: "other", label: "Otro" },
] as const;

const SCHEMAS = {
  invoices: [
    { name: "date", type: "date", required: true, description: "Fecha de factura" },
    {
      name: "invoiceNumber",
      type: "string",
      required: true,
      description: "Número o referencia de factura",
    },
    {
      name: "clientName",
      type: "string",
      required: true,
      description: "Nombre del cliente",
    },
    {
      name: "description",
      type: "string",
      required: false,
      description: "Descripción del servicio o producto",
    },
    {
      name: "amount",
      type: "number",
      required: true,
      description: "Importe neto (sin IVA)",
    },
    {
      name: "vatAmount",
      type: "number",
      required: false,
      description: "Importe de IVA",
    },
    {
      name: "totalAmount",
      type: "number",
      required: true,
      description: "Importe total (incluido IVA)",
    },
    {
      name: "dueDate",
      type: "date",
      required: false,
      description: "Fecha de vencimiento del pago",
    },
    {
      name: "paymentStatus",
      type: "string",
      required: false,
      description: "Estado del pago (pagado, pendiente, vencido)",
    },
  ],
  expenses: [
    { name: "date", type: "date", required: true, description: "Fecha del gasto" },
    {
      name: "category",
      type: "string",
      required: true,
      description: "Categoría del gasto (ej., material de oficina, salarios, alquiler)",
    },
    {
      name: "description",
      type: "string",
      required: true,
      description: "Descripción del gasto",
    },
    {
      name: "supplier",
      type: "string",
      required: false,
      description: "Nombre del proveedor",
    },
    {
      name: "amount",
      type: "number",
      required: true,
      description: "Importe del gasto",
    },
    {
      name: "vatAmount",
      type: "number",
      required: false,
      description: "Importe de IVA si aplica",
    },
    {
      name: "reference",
      type: "string",
      required: false,
      description: "Número de factura o referencia",
    },
    {
      name: "paymentMethod",
      type: "string",
      required: false,
      description: "Método de pago (efectivo, tarjeta, transferencia)",
    },
  ],
  bank_statements: [
    {
      name: "date",
      type: "date",
      required: true,
      description: "Fecha de la transacción",
    },
    {
      name: "description",
      type: "string",
      required: true,
      description: "Descripción de la transacción",
    },
    {
      name: "reference",
      type: "string",
      required: false,
      description: "Referencia de la transacción",
    },
    {
      name: "amount",
      type: "number",
      required: true,
      description: "Importe de la transacción",
    },
    {
      name: "transactionType",
      type: "string",
      required: true,
      description: "Tipo de transacción (débito, crédito)",
    },
    {
      name: "balance",
      type: "number",
      required: false,
      description: "Saldo de la cuenta después de la transacción",
    },
    {
      name: "category",
      type: "string",
      required: false,
      description: "Categoría de la transacción",
    },
  ],
  cash_flow: [
    {
      name: "period",
      type: "string",
      required: true,
      description: "Período (ej., 2024-01, Q1 2024)",
    },
    {
      name: "startDate",
      type: "date",
      required: true,
      description: "Fecha de inicio del período",
    },
    {
      name: "endDate",
      type: "date",
      required: true,
      description: "Fecha de fin del período",
    },
    {
      name: "income",
      type: "number",
      required: true,
      description: "Ingresos totales del período",
    },
    {
      name: "expenses",
      type: "number",
      required: true,
      description: "Gastos totales del período",
    },
    {
      name: "netFlow",
      type: "number",
      required: true,
      description: "Flujo de caja neto (ingresos - gastos)",
    },
    {
      name: "openingBalance",
      type: "number",
      required: false,
      description: "Saldo al inicio del período",
    },
    {
      name: "closingBalance",
      type: "number",
      required: false,
      description: "Saldo al final del período",
    },
  ],
  production_sales: [
    {
      name: "finca",
      type: "string",
      required: false,
      description: "Identificador de finca/ubicación",
    },
    {
      name: "fechaAlbaran",
      type: "date",
      required: true,
      description: "Fecha del albarán",
    },
    {
      name: "numeroAlbaran",
      type: "string",
      required: true,
      description: "Número de albarán",
    },
    {
      name: "fechaFactura",
      type: "date",
      required: false,
      description: "Fecha de factura",
    },
    {
      name: "numeroFactura",
      type: "string",
      required: false,
      description: "Número de factura",
    },
    {
      name: "fechaPago",
      type: "date",
      required: false,
      description: "Fecha de pago",
    },
    {
      name: "numeroProducto",
      type: "string",
      required: true,
      description: "Número/código de producto",
    },
    {
      name: "producto",
      type: "string",
      required: true,
      description: "Nombre del producto",
    },
    {
      name: "tipoProducto",
      type: "string",
      required: false,
      description: "Tipo/calidad del producto",
    },
    {
      name: "kgs",
      type: "number",
      required: true,
      description: "Kilogramos producidos/vendidos",
    },
    {
      name: "precio",
      type: "number",
      required: true,
      description: "Precio por kg",
    },
    {
      name: "descuento",
      type: "number",
      required: false,
      description: "Descuento",
    },
    {
      name: "facturacionAntesImpuestos",
      type: "number",
      required: true,
      description: "Facturación antes de impuestos",
    },
    {
      name: "precioAntesImpuestos",
      type: "number",
      required: false,
      description: "Precio antes de impuestos",
    },
    {
      name: "retencionesPercent",
      type: "number",
      required: false,
      description: "Retenciones %",
    },
    {
      name: "retencionesEuros",
      type: "number",
      required: false,
      description: "Retenciones €",
    },
    {
      name: "ivaPercent",
      type: "number",
      required: false,
      description: "IVA %",
    },
    { name: "ivaEuros", type: "number", required: false, description: "IVA €" },
    {
      name: "facturacionNeta",
      type: "number",
      required: true,
      description: "Facturación neta",
    },
    {
      name: "precioNeto",
      type: "number",
      required: false,
      description: "Precio neto por kg",
    },
  ],
  other: [
    {
      name: "Campos personalizados",
      type: "mixed",
      required: false,
      description: "Se intentará extraer todos los datos disponibles",
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
      toast.error("Por favor, selecciona archivos e introduce el nombre del cliente");
      return;
    }

    setUploading(true);

    try {
      // Process each file
      for (const file of files) {
        toast.info(`Procesando ${file.name}...`);

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
          throw new Error(error.error || "Error al subir el archivo");
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
          throw new Error("Error al crear el registro de carga");
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
          `${result.fileName} procesado correctamente - ${result.recordCount} registros extraídos`,
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
        error instanceof Error ? error.message : "Error al cargar el archivo",
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Extracción de Datos</h1>
        <p className="text-muted-foreground mt-2">
          Sube documentos financieros de clientes para análisis
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Subir Archivos</CardTitle>
            <CardDescription>
              Sube archivos PDF, CSV o Excel que contengan datos financieros
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="client-name">Nombre del Cliente</Label>
              <Input
                id="client-name"
                type="text"
                placeholder="ej., Empresa S.A."
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="document-type">Tipo de Documento</Label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger id="document-type" className="w-full">
                  <SelectValue placeholder="Seleccione tipo de documento" />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file-upload">Seleccionar Archivos</Label>
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
                <Label>Archivos Seleccionados ({files.length})</Label>
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
              {uploading ? "Subiendo..." : "Subir y Extraer"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Extracciones Recientes</CardTitle>
            <CardDescription>Ver archivos procesados recientemente</CardDescription>
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
                No hay extracciones aún
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {extractedData && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Vista Previa de Datos Extraídos</CardTitle>
            <CardDescription>
              Mostrando los primeros 5 registros de {extractedData.fileName} (
              {extractedData.recordCount} registros totales)
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
            <CardTitle>Tipos de Archivo Soportados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Documentos PDF</h3>
                <p className="text-sm text-muted-foreground">
                  Facturas, extractos bancarios, informes financieros
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Archivos Excel</h3>
                <p className="text-sm text-muted-foreground">
                  Exportaciones contables, hojas de cálculo (.xlsx, .xls)
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Archivos CSV</h3>
                <p className="text-sm text-muted-foreground">
                  Datos de transacciones, exportaciones de sistemas contables
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Esquema de Datos Esperado</CardTitle>
            <CardDescription>
              Campos que extraeremos para{" "}
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
                    {field.required ? "Requerido" : "Opcional"}
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
