"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock, FileSpreadsheet, XCircle } from "lucide-react";

const statusConfig = {
  pending: { label: "Pendiente", icon: Clock, variant: "secondary" as const },
  processing: { label: "Procesando", icon: Clock, variant: "default" as const },
  completed: { label: "Completado", icon: CheckCircle2, variant: "success" as const },
  error: { label: "Error", icon: XCircle, variant: "destructive" as const },
};

const documentTypeLabels: Record<string, string> = {
  production_sales: "Producción y Ventas",
  invoices: "Facturas",
  expenses: "Gastos",
  bank_statements: "Extractos Bancarios",
  cash_flow: "Flujo de Caja",
  other: "Otro",
};

export default function ImportHistoryPage() {
  const { data: uploads, isLoading } = useQuery(
    trpc.upload.getUserUploads.queryOptions({
      limit: 50,
      offset: 0,
    }),
  );

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Historial de Importaciones
          </h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">Cargando...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Historial de Importaciones
        </h1>
        <p className="text-muted-foreground mt-2">
          Revisa el historial de tus importaciones de datos
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Importaciones Recientes</CardTitle>
          <CardDescription>
            {uploads?.length || 0} importaciones realizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!uploads || uploads.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No hay importaciones aún
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Archivo</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Tamaño</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {uploads.map((upload) => {
                    const status = statusConfig[upload.status as keyof typeof statusConfig];
                    const StatusIcon = status.icon;

                    return (
                      <TableRow key={upload.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                            {upload.filename}
                          </div>
                        </TableCell>
                        <TableCell>{upload.clientName || "—"}</TableCell>
                        <TableCell>
                          {documentTypeLabels[upload.documentType || "other"] || upload.documentType || "—"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={status.variant as "secondary" | "default" | "destructive" | "outline"}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(upload.uploadedAt).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          {(upload.fileSize / 1024).toFixed(2)} KB
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

