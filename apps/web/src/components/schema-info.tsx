"use client";

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
import { Badge } from "./ui/badge";

interface SchemaField {
  name: string;
  type: string;
  required: boolean;
  description: string;
  enum?: string[];
  default?: string;
}

interface SchemaInfoProps {
  documentType: string;
}

const schemas: Record<
  string,
  { name: string; description: string; fields: SchemaField[] }
> = {
  production_sales: {
    name: "Producción y Ventas",
    description:
      "Esquema para importar datos de producción agrícola y ventas. Incluye información de albaranes, facturas y pagos.",
    fields: [
      {
        name: "finca",
        type: "string",
        required: false,
        description: "Identificador de la finca",
      },
      {
        name: "fechaAlbaran",
        type: "date",
        required: true,
        description: "Fecha del albarán (formato: dd/MM/yyyy)",
      },
      {
        name: "numeroAlbaran",
        type: "string",
        required: true,
        description: "Número del albarán (ej: P24 - 24661)",
      },
      {
        name: "fechaFactura",
        type: "date",
        required: false,
        description: "Fecha de la factura",
      },
      {
        name: "numeroFactura",
        type: "string",
        required: false,
        description: "Número de factura (ej: P25A - 14)",
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
        description: "Código del producto (ej: 800, 808)",
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
        description: "Tipo/calidad (Bueno, Extra, Primera)",
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
        description: "Tasa de descuento (decimal)",
      },
      {
        name: "facturacionNeta",
        type: "number",
        required: true,
        description: "Facturación neta (después de retenciones)",
      },
    ],
  },
  invoices: {
    name: "Facturas",
    description: "Esquema para importar facturas emitidas a clientes.",
    fields: [
      {
        name: "date",
        type: "date",
        required: true,
        description: "Fecha de la factura",
      },
      {
        name: "invoiceNumber",
        type: "string",
        required: true,
        description: "Número de factura",
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
        description: "Descripción del servicio/producto",
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
        description: "Importe total (con IVA)",
      },
      {
        name: "currency",
        type: "string",
        required: false,
        default: "EUR",
        description: "Código de moneda",
      },
      {
        name: "dueDate",
        type: "date",
        required: false,
        description: "Fecha de vencimiento",
      },
      {
        name: "paymentStatus",
        type: "string",
        required: false,
        enum: ["paid", "pending", "overdue"],
        description: "Estado del pago",
      },
    ],
  },
  expenses: {
    name: "Gastos",
    description: "Esquema para importar gastos y facturas de proveedores.",
    fields: [
      { name: "date", type: "date", required: true, description: "Fecha del gasto" },
      {
        name: "category",
        type: "string",
        required: true,
        description: "Categoría del gasto",
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
        description: "Importe de IVA",
      },
      {
        name: "currency",
        type: "string",
        required: false,
        default: "EUR",
        description: "Código de moneda",
      },
      {
        name: "reference",
        type: "string",
        required: false,
        description: "Número de factura o referencia",
      },
    ],
  },
  bank_statements: {
    name: "Extractos Bancarios",
    description: "Esquema para importar movimientos bancarios.",
    fields: [
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
        description: "Importe (positivo ingreso, negativo cargo)",
      },
      {
        name: "transactionType",
        type: "string",
        required: true,
        enum: ["debit", "credit"],
        description: "Tipo de transacción",
      },
      {
        name: "balance",
        type: "number",
        required: false,
        description: "Saldo después de la transacción",
      },
      {
        name: "currency",
        type: "string",
        required: false,
        default: "EUR",
        description: "Código de moneda",
      },
    ],
  },
  cash_flow: {
    name: "Flujo de Caja",
    description: "Esquema para importar datos de flujo de caja periódico.",
    fields: [
      {
        name: "period",
        type: "string",
        required: true,
        description: "Período (ej: 2024-01, Q1 2024)",
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
        description: "Flujo neto (ingresos - gastos)",
      },
      {
        name: "openingBalance",
        type: "number",
        required: false,
        description: "Saldo inicial del período",
      },
      {
        name: "closingBalance",
        type: "number",
        required: false,
        description: "Saldo final del período",
      },
    ],
  },
};

export function SchemaInfo({ documentType }: SchemaInfoProps) {
  const schema = schemas[documentType];

  if (!schema) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Esquema: {schema.name}</CardTitle>
        <CardDescription>{schema.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Requerido</TableHead>
                <TableHead>Descripción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schema.fields.map((field) => (
                <TableRow key={field.name}>
                  <TableCell className="font-mono text-sm">
                    {field.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{field.type}</Badge>
                    {field.enum && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        {field.enum.join(", ")}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {field.required ? (
                      <Badge variant="destructive">Sí</Badge>
                    ) : (
                      <Badge variant="secondary">No</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {field.description}
                    {field.default && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        (default: {field.default})
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

