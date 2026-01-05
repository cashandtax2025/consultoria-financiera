import { flushAxiom, getAxiomClient } from "./axiom";

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogContext {
  requestId?: string;
  userId?: string;
  organizationId?: string;
  operation?: string;
  errorTag?: string;
  isOperational?: boolean;
  [key: string]: unknown;
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack: string | undefined;
    tag: string | undefined;
    isOperational: boolean | undefined;
  };
}

const DATASET = process.env.AXIOM_DATASET || "consultoria-financiera";

function formatForConsole(entry: LogEntry): string {
  const { level, message, context, error } = entry;
  const levelColors: Record<LogLevel, string> = {
    debug: "\x1b[36m",
    info: "\x1b[32m",
    warn: "\x1b[33m",
    error: "\x1b[31m",
  };
  const reset = "\x1b[0m";
  const color = levelColors[level];

  let output = `${color}[${level.toUpperCase()}]${reset} ${message}`;

  if (context && Object.keys(context).length > 0) {
    output += ` ${JSON.stringify(context)}`;
  }

  if (error) {
    const tagInfo = error.tag ? ` [${error.tag}]` : "";
    const opInfo = error.isOperational === false ? " (non-operational)" : "";
    output += `${tagInfo}${opInfo}\n${error.stack || error.message}`;
  }

  return output;
}

interface AppErrorLike {
  _tag?: string;
  isOperational?: boolean;
  message: string;
  name: string;
  stack?: string;
}

function isAppError(error: unknown): error is AppErrorLike {
  return (
    typeof error === "object" &&
    error !== null &&
    "_tag" in error &&
    typeof (error as AppErrorLike)._tag === "string"
  );
}

function createLogEntry(
  level: LogLevel,
  message: string,
  context?: LogContext,
  error?: Error | AppErrorLike,
): LogEntry {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
  };

  if (context && Object.keys(context).length > 0) {
    entry.context = context;
  }

  if (error) {
    entry.error = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      tag: undefined,
      isOperational: undefined,
    };

    if (isAppError(error)) {
      entry.error.tag = error._tag;
      entry.error.isOperational = error.isOperational;
    }
  }

  return entry;
}

function log(
  level: LogLevel,
  message: string,
  context?: LogContext,
  error?: Error | AppErrorLike,
): void {
  const entry = createLogEntry(level, message, context, error);

  const isDev = process.env.NODE_ENV === "development";
  if (isDev) {
    const consoleMethod = level === "debug" ? "log" : level;
    // biome-ignore lint/suspicious/noConsole: Logger needs console access
    console[consoleMethod](formatForConsole(entry));
  }

  const axiom = getAxiomClient();
  if (axiom) {
    axiom.ingest(DATASET, [entry]);
  }
}

export const logger = {
  debug(message: string, context?: LogContext): void {
    log("debug", message, context);
  },

  info(message: string, context?: LogContext): void {
    log("info", message, context);
  },

  warn(message: string, context?: LogContext): void {
    log("warn", message, context);
  },

  error(
    message: string,
    error?: Error | AppErrorLike,
    context?: LogContext,
  ): void {
    log("error", message, context, error);
  },

  child(baseContext: LogContext) {
    return {
      debug: (message: string, context?: LogContext) =>
        log("debug", message, { ...baseContext, ...context }),
      info: (message: string, context?: LogContext) =>
        log("info", message, { ...baseContext, ...context }),
      warn: (message: string, context?: LogContext) =>
        log("warn", message, { ...baseContext, ...context }),
      error: (
        message: string,
        error?: Error | AppErrorLike,
        context?: LogContext,
      ) => log("error", message, { ...baseContext, ...context }, error),
    };
  },

  flush: flushAxiom,
};

export { flushAxiom } from "./axiom";
