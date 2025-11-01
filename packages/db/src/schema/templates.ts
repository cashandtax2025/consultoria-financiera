// Schema templates for different document types
// These define the expected structure for data extraction and validation

export const invoiceSchema = {
  name: "Invoice Schema",
  documentType: "invoices",
  fields: [
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
      name: "currency",
      type: "string",
      required: false,
      default: "EUR",
      description: "Currency code",
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
      enum: ["paid", "pending", "overdue"],
      description: "Payment status",
    },
  ],
};

export const expenseSchema = {
  name: "Expense Schema",
  documentType: "expenses",
  fields: [
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
      name: "currency",
      type: "string",
      required: false,
      default: "EUR",
      description: "Currency code",
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
};

export const bankStatementSchema = {
  name: "Bank Statement Schema",
  documentType: "bank_statements",
  fields: [
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
      description:
        "Transaction amount (positive for credit, negative for debit)",
    },
    {
      name: "transactionType",
      type: "string",
      required: true,
      enum: ["debit", "credit"],
      description: "Transaction type",
    },
    {
      name: "balance",
      type: "number",
      required: false,
      description: "Account balance after transaction",
    },
    {
      name: "currency",
      type: "string",
      required: false,
      default: "EUR",
      description: "Currency code",
    },
    {
      name: "category",
      type: "string",
      required: false,
      description: "Transaction category",
    },
  ],
};

export const cashFlowSchema = {
  name: "Cash Flow Schema",
  documentType: "cash_flow",
  fields: [
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
    {
      name: "currency",
      type: "string",
      required: false,
      default: "EUR",
      description: "Currency code",
    },
  ],
};

export const productionSalesSchema = {
  name: "Production Sales Schema",
  documentType: "production_sales",
  fields: [
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
      description: "Delivery note date (formato: d/M/yyyy)",
    },
    {
      name: "numeroAlbaran",
      type: "string",
      required: true,
      description: "Delivery note number (ej: P24 - 24661)",
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
      description: "Invoice number (ej: P25A - 14)",
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
      description: "Product number/code (ej: 800, 808)",
    },
    {
      name: "producto",
      type: "string",
      required: true,
      description: "Product name (ej: Berenjena Violeta, Judia Larga Verde)",
    },
    {
      name: "tipoProducto",
      type: "string",
      required: false,
      description: "Product type/quality (Bueno, Estrío, Extra, Primera)",
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
      description: "Price per kg (decimal con coma en CSV)",
    },
    {
      name: "descuento",
      type: "number",
      required: false,
      description: "Discount rate (decimal, ej: 0.1 = 10%)",
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
      description: "Price before taxes per kg",
    },
    {
      name: "retencionesPercent",
      type: "number",
      required: false,
      description: "Withholdings percentage (decimal, ej: 0.02 = 2%)",
    },
    {
      name: "retencionesEuros",
      type: "number",
      required: false,
      description: "Withholdings amount in euros",
    },
    {
      name: "ivaPercent",
      type: "number",
      required: false,
      description: "VAT percentage",
    },
    {
      name: "ivaEuros",
      type: "number",
      required: false,
      description: "VAT amount in euros",
    },
    {
      name: "facturacionNeta",
      type: "number",
      required: true,
      description: "Net billing amount (after withholdings)",
    },
    {
      name: "precioNeto",
      type: "number",
      required: false,
      description: "Net price per kg",
    },
    {
      name: "facturacion",
      type: "number",
      required: false,
      description: "Total billing (same as facturacionNeta)",
    },
    {
      name: "anomesAlb",
      type: "string",
      required: false,
      description: "Year-month of delivery note (formato: aaYYmm, ej: aa08)",
    },
    {
      name: "anomesFra",
      type: "string",
      required: false,
      description: "Year-month of invoice (formato: aaYYmm)",
    },
    {
      name: "anomesPago",
      type: "string",
      required: false,
      description: "Year-month of payment (formato: aaYYmm)",
    },
    {
      name: "precioPond",
      type: "number",
      required: false,
      description: "Weighted price (precio ponderado calculado)",
    },
    {
      name: "precioAntesImpuestosPond",
      type: "number",
      required: false,
      description: "Weighted price before taxes (calculado)",
    },
    {
      name: "precioNetoPond",
      type: "number",
      required: false,
      description: "Weighted net price (calculado)",
    },
  ],
};

export const allSchemas = [
  invoiceSchema,
  expenseSchema,
  bankStatementSchema,
  cashFlowSchema,
  productionSalesSchema,
];
