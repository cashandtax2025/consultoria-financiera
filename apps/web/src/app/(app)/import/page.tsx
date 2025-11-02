"use client";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SchemaInfo } from "@/components/schema-info";
import { trpc } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { FileSpreadsheet, History, Upload as UploadIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const documentTypes = [
  { value: "production_sales", label: "Producción y Ventas" },
  { value: "invoices", label: "Facturas" },
  { value: "expenses", label: "Gastos" },
  { value: "bank_statements", label: "Extractos Bancarios" },
  { value: "cash_flow", label: "Flujo de Caja" },
];

interface ParsedData {
  data: Record<string, any>[];
  fileName: string;
  fileSize: number;
  fileType: string;
  recordCount: number;
  clientName: string;
  documentType: string;
}

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [clientName, setClientName] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);

  const createUploadMutation = useMutation(
    trpc.upload.createUploadAndStore.mutationOptions(),
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const validExtensions = [".xlsx", ".xls", ".csv"];
      const fileExtension = selectedFile.name.toLowerCase().match(/\.[^.]*$/)?.[0];
      
      if (!validExtensions.includes(fileExtension || "")) {
        toast.error("Tipo de archivo no válido", {
          description: "Solo se aceptan archivos Excel (.xlsx, .xls) y CSV (.csv)",
        });
        return;
      }
      
      setFile(selectedFile);
      setParsedData(null); // Reset preview
    }
  };

  const handlePreview = async () => {
    if (!file || !clientName || !documentType) {
      toast.error("Campos requeridos", {
        description: "Por favor, complete todos los campos y seleccione un archivo",
      });
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("clientName", clientName);
      formData.append("documentType", documentType);
      formData.append("saveToDb", "false");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al procesar el archivo");
      }

      const result = await response.json();
      setParsedData(result);
      toast.success("Archivo procesado", {
        description: `Se encontraron ${result.recordCount} registros`,
      });
    } catch (error) {
      console.error("Preview error:", error);
      toast.error("Error", {
        description: error instanceof Error ? error.message : "Error al procesar el archivo",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async () => {
    if (!file || !clientName || !documentType || !parsedData) {
      toast.error("Campos requeridos", {
        description: "Por favor, complete todos los campos, seleccione un archivo y haga la vista previa primero",
      });
      return;
    }

    setIsLoading(true);

    try {
      createUploadMutation.mutate(
        {
          filename: file.name,
          fileType: file.name.split(".").pop() || "unknown",
          fileSize: file.size,
          clientName,
          documentType,
          data: parsedData.data,
        },
        {
          onSuccess: (result) => {
            toast.success("Importación exitosa", {
              description: `${result.recordCount} registros importados correctamente`,
            });

            // Reset form
            setFile(null);
            setClientName("");
            setDocumentType("");
            setParsedData(null);

            // Clear file input
            const fileInput = document.getElementById("file-upload") as HTMLInputElement;
            if (fileInput) fileInput.value = "";
            
            setIsLoading(false);
          },
          onError: (error) => {
            console.error("Import error:", error);
            toast.error("Error al importar", {
              description: error instanceof Error ? error.message : "Error al importar los datos",
            });
            setIsLoading(false);
          },
        },
      );

    } catch (error) {
      // Error handling is done in onError callback
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Importar Datos</h1>
          <p className="text-muted-foreground mt-2">
            Importe datos financieros desde archivos Excel o CSV
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/import/history">
            <History className="mr-2 h-4 w-4" />
            Historial
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        {documentType && <SchemaInfo documentType={documentType} />}

        <Card>
          <CardHeader>
            <CardTitle>Seleccionar Archivo</CardTitle>
            <CardDescription>
              Seleccione un archivo Excel (.xlsx, .xls) o CSV para importar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="client-name">Cliente</Label>
              <Input
                id="client-name"
                placeholder="Nombre del cliente"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="document-type">Tipo de Documento</Label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger id="document-type">
                  <SelectValue placeholder="Seleccione el tipo de documento" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file-upload">Archivo</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="file-upload"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                {file && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileSpreadsheet className="h-4 w-4" />
                    <span className="truncate max-w-xs">{file.name}</span>
                    <span>({(file.size / 1024).toFixed(2)} KB)</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handlePreview}
                disabled={!file || !clientName || !documentType || isLoading}
                variant="outline"
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Vista Previa
              </Button>
              <Button
                onClick={handleImport}
                disabled={!file || !clientName || !documentType || !parsedData || isLoading}
              >
                <UploadIcon className="mr-2 h-4 w-4" />
                {isLoading ? "Importando..." : "Importar"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {parsedData && (
          <Card>
            <CardHeader>
              <CardTitle>Vista Previa de Datos</CardTitle>
              <CardDescription>
                {parsedData.recordCount} registros encontrados en {parsedData.fileName}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="max-h-[500px] overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {parsedData.data.length > 0 &&
                          Object.keys(parsedData.data[0]).slice(0, 10).map((key) => (
                            <TableHead key={key} className="whitespace-nowrap">
                              {key}
                            </TableHead>
                          ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parsedData.data.slice(0, 20).map((row, idx) => (
                        <TableRow key={idx}>
                          {Object.values(row).slice(0, 10).map((value, cellIdx) => (
                            <TableCell key={cellIdx} className="whitespace-nowrap">
                              {String(value)}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {parsedData.recordCount > 20 && (
                  <div className="p-4 text-sm text-muted-foreground border-t">
                    Mostrando 20 de {parsedData.recordCount} registros
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

