/**
 * Application-wide configuration.
 * Centralized place for feature flags and app settings.
 */
export const appConfig = {
  /** App name used in emails, UI, etc. */
  appName: "Consultoria Financiera",

  /** Whether to require organization for authenticated users */
  requireOrganization: false,

  /** Default pagination limit */
  defaultPageSize: 20,

  /** Maximum file upload size in bytes (10MB) */
  maxUploadSize: 10 * 1024 * 1024,

  /** Supported file types for uploads */
  supportedFileTypes: [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "text/csv",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ],
} as const;

export type AppConfig = typeof appConfig;
