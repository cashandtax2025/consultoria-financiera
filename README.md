# Consultoría Financiera

Plataforma de consultoría financiera con importación de datos, análisis automático y generación de reportes.

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines Next.js, Self, TRPC, and more.

## Features

- **TypeScript** - For type safety and improved developer experience
- **Next.js** - Full-stack React framework
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Reusable UI components
- **tRPC** - End-to-end type-safe APIs
- **Drizzle** - TypeScript-first ORM
- **PostgreSQL** - Database engine
- **Authentication** - Better-Auth
- **Turborepo** - Optimized monorepo build system
- **Data Import** - Excel & CSV import with schema validation
- **AI Analysis** - Financial data analysis with AI

## Getting Started

First, install the dependencies:

```bash
pnpm install
```
## Database Setup

This project uses PostgreSQL with Drizzle ORM.

1. Make sure you have a PostgreSQL database set up.
2. Update your `apps/web/.env` file with your PostgreSQL connection details.

3. Apply the schema to your database:
```bash
pnpm db:push
```


Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see your fullstack application.







## Project Structure

```
financial-advisory/
├── apps/
│   └── web/         # Fullstack application (Next.js)
├── packages/
│   ├── api/         # API layer / business logic
│   ├── auth/        # Authentication configuration & logic
│   └── db/          # Database schema & queries
```

## Available Scripts

- `pnpm dev`: Start all applications in development mode
- `pnpm build`: Build all applications
- `pnpm check-types`: Check TypeScript types across all apps
- `pnpm db:push`: Push schema changes to database
- `pnpm db:studio`: Open database studio UI

## Key Functionality

### Data Import
Import financial data from Excel (.xlsx, .xls) or CSV files with automatic schema validation and field mapping.

**Supported document types:**
- Production Sales (Producción y Ventas)
- Invoices (Facturas)
- Expenses (Gastos)
- Bank Statements (Extractos Bancarios)
- Cash Flow (Flujo de Caja)

See [IMPORT_GUIDE.md](./IMPORT_GUIDE.md) for detailed documentation on how to use the import functionality.

**Example files** are available in the `examples/` directory:
- `production_sales_example.csv` - Agricultural production and sales data
- `invoices_example.csv` - Invoice data
- `expenses_example.csv` - Expense tracking
- `bank_statements_example.csv` - Bank transaction data
- `cash_flow_example.csv` - Cash flow periodic data

### Data Extraction
Extract data from PDFs using AI-powered OCR and natural language processing.

### Analytics & Reporting
Generate insights and reports from imported financial data.

### AI Assistant
Chat with an AI assistant about your financial data and get instant insights.
