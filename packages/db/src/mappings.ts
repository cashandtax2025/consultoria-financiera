/**
 * UI Label Mappings - English keys to Spanish labels for UI display
 *
 * These mappings convert the English enum keys stored in the database
 * to their Spanish representations for the UI.
 *
 * @example Direct access
 * ```ts
 * import { clientSectorLabels } from "@consultoria-financiera/db/mappings";
 *
 * const label = clientSectorLabels["restaurants"]; // "Restaurantes"
 * const companyType = clientCompanyTypeLabels["services"]; // "Servicios"
 * ```
 *
 * @example Using getLabel helper (safe for null/undefined)
 * ```ts
 * import { getLabel, clientSectorLabels } from "@consultoria-financiera/db/mappings";
 *
 * const client = { sector: "restaurants", name: "Mi Restaurante" };
 * const sectorLabel = getLabel(clientSectorLabels, client.sector); // "Restaurantes"
 * const unknown = getLabel(clientSectorLabels, null); // ""
 * ```
 *
 * @example Using getSelectOptions for dropdowns
 * ```tsx
 * import { getSelectOptions, clientSectorLabels } from "@consultoria-financiera/db/mappings";
 *
 * const options = getSelectOptions(clientSectorLabels);
 * // [
 * //   { value: "restaurants", label: "Restaurantes" },
 * //   { value: "hotels", label: "Hoteles" },
 * //   ...
 * // ]
 *
 * // In a React component:
 * <Select>
 *   {options.map(opt => (
 *     <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
 *   ))}
 * </Select>
 * ```
 *
 * @example Displaying in a table
 * ```tsx
 * import { getLabel, clientSectorLabels, clientCompanyTypeLabels } from "@consultoria-financiera/db/mappings";
 *
 * function ClientRow({ client }) {
 *   return (
 *     <tr>
 *       <td>{client.name}</td>
 *       <td>{getLabel(clientSectorLabels, client.sector)}</td>
 *       <td>{getLabel(clientCompanyTypeLabels, client.companyType)}</td>
 *     </tr>
 *   );
 * }
 * ```
 */

// =============================================================================
// CLIENT SECTOR (Sector_Cliente)
// =============================================================================

export const clientSectorLabels = {
  restaurants: "Restaurantes",
  hotels: "Hoteles",
  travel_agencies: "Agencias de Viajes y Turismo",
  consulting_legal: "Asesorías y Bufetes",
  marketing_advertising: "Agencias Marketing y Publicidad",
  real_estate: "Promoción e Intermediación Inmobiliaria",
  construction: "Especialistas de construcción",
  agriculture: "Agricultura",
  livestock: "Ganadería",
  fishing: "Pesca",
  food_industry: "Industria Alimentaria",
  manufacturing: "Industria Manufacturera",
  ecommerce: "Ecommerce",
  transport: "Transporte",
  logistics: "Agencia Logística",
  it_consulting: "Consultoría IT",
  education: "Educación",
  clinics: "Clínicas",
  gyms: "Gimnasios",
  retail: "Comercio retail",
  professional_services: "Otros servicios profesionales",
  beauty_salons: "Peluquerías y Salones de Belleza",
  bakeries: "Panaderías",
  fruit_shops: "Fruterías",
  supermarkets: "Supermercados",
  butcher_shops: "Carnicerías",
  fish_shops: "Pescaderías",
  tobacco_shops: "Estancos",
  pharmacies: "Farmacias",
  workshops: "Talleres",
} as const;

export type ClientSector = keyof typeof clientSectorLabels;
export const clientSectorValues = Object.keys(
  clientSectorLabels,
) as ClientSector[];

// =============================================================================
// CLIENT COMPANY TYPE (Tipo_Empresa_Cliente)
// =============================================================================

export const clientCompanyTypeLabels = {
  trader_no_stock: "Comercializador sin stock",
  trader_with_stock: "Comercializador con stock",
  services: "Servicios",
  producer: "Productor",
} as const;

export type ClientCompanyType = keyof typeof clientCompanyTypeLabels;
export const clientCompanyTypeValues = Object.keys(
  clientCompanyTypeLabels,
) as ClientCompanyType[];

// =============================================================================
// ACCOUNT TYPE (Tipo de cuenta contable)
// =============================================================================

export const accountTypeLabels = {
  asset: "Activo",
  liability: "Pasivo",
  equity: "Patrimonio Neto",
  income: "Ingreso",
  expense: "Gasto",
} as const;

export type AccountType = keyof typeof accountTypeLabels;
export const accountTypeValues = Object.keys(
  accountTypeLabels,
) as AccountType[];

// =============================================================================
// UPLOAD STATUS (Estado de carga)
// =============================================================================

export const uploadStatusLabels = {
  pending: "Pendiente",
  processing: "Procesando",
  completed: "Completado",
  error: "Error",
} as const;

export type UploadStatus = keyof typeof uploadStatusLabels;
export const uploadStatusValues = Object.keys(
  uploadStatusLabels,
) as UploadStatus[];

// =============================================================================
// DOCUMENT TYPE (Tipo de documento)
// =============================================================================

export const documentTypeLabels = {
  invoices: "Facturas",
  expenses: "Gastos",
  bank_statements: "Extractos Bancarios",
  cash_flow: "Flujo de Caja",
  production_sales: "Ventas de Producción",
} as const;

export type DocumentType = keyof typeof documentTypeLabels;
export const documentTypeValues = Object.keys(
  documentTypeLabels,
) as DocumentType[];

// =============================================================================
// PAYMENT STATUS (Estado de pago)
// =============================================================================

export const paymentStatusLabels = {
  paid: "Pagado",
  pending: "Pendiente",
  overdue: "Vencido",
} as const;

export type PaymentStatus = keyof typeof paymentStatusLabels;
export const paymentStatusValues = Object.keys(
  paymentStatusLabels,
) as PaymentStatus[];

// =============================================================================
// TRANSACTION TYPE (Tipo de transacción)
// =============================================================================

export const transactionTypeLabels = {
  debit: "Débito",
  credit: "Crédito",
} as const;

export type TransactionType = keyof typeof transactionTypeLabels;
export const transactionTypeValues = Object.keys(
  transactionTypeLabels,
) as TransactionType[];

// =============================================================================
// RECORD TYPE (Tipo de registro financiero)
// =============================================================================

export const recordTypeLabels = {
  invoice: "Factura",
  expense: "Gasto",
  transaction: "Transacción",
} as const;

export type RecordType = keyof typeof recordTypeLabels;
export const recordTypeValues = Object.keys(recordTypeLabels) as RecordType[];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get the Spanish label for a given enum key
 * @param mapping - The mapping object (e.g., clientSectorLabels)
 * @param key - The English key
 * @returns The Spanish label or the key itself if not found
 */
export function getLabel<T extends Record<string, string>>(
  mapping: T,
  key: keyof T | string | null | undefined,
): string {
  if (!key) return "";
  return (mapping as Record<string, string>)[key as string] ?? String(key);
}

/**
 * Get options array for select/dropdown components
 * @param mapping - The mapping object
 * @returns Array of { value, label } objects
 */
export function getSelectOptions<T extends Record<string, string>>(
  mapping: T,
): Array<{ value: keyof T; label: string }> {
  return Object.entries(mapping).map(([value, label]) => ({
    value: value as keyof T,
    label,
  }));
}
