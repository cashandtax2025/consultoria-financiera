import { tool } from "ai";
import { z } from "zod";

// Re-export client tools
export {
  listClientsTool,
  getClientDetailsTool,
  getClientAccountingStatusTool,
  getClientsStatsTool,
  getClientAccountMappingTool,
  getAvailableCategoriesTool,
} from "./clients";

export const weatherTool = tool({
  description: "Obtiene el clima actual de una ciudad",
  inputSchema: z.object({
    city: z.string().describe("Nombre de la ciudad"),
    country: z.string().optional().describe("Código del país (ej: ES, US)"),
  }),
  execute: async ({ city, country }) => {
    const conditions = [
      "soleado",
      "nublado",
      "lluvioso",
      "parcialmente nublado",
    ];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const temp = Math.floor(Math.random() * 30) + 5;

    return {
      city,
      country: country ?? "desconocido",
      temperature: temp,
      condition,
      humidity: Math.floor(Math.random() * 60) + 30,
      description: `El clima en ${city} es ${condition} con ${temp}°C`,
    };
  },
});

export const calculatorTool = tool({
  description:
    "Realiza cálculos matemáticos. Soporta operaciones básicas y avanzadas.",
  inputSchema: z.object({
    expression: z
      .string()
      .describe("Expresión matemática a evaluar (ej: 2+2, sqrt(16), sin(45))"),
  }),
  execute: async ({ expression }) => {
    try {
      const sanitized = expression
        .replace(/[^0-9+\-*/().sqrt,sincostan\s]/gi, "")
        .replace(/sqrt/gi, "Math.sqrt")
        .replace(/sin/gi, "Math.sin")
        .replace(/cos/gi, "Math.cos")
        .replace(/tan/gi, "Math.tan");

      const result = Function(`"use strict"; return (${sanitized})`)();

      return {
        expression,
        result: Number(result),
        success: true,
      };
    } catch {
      return {
        expression,
        result: null,
        success: false,
        error: "No se pudo evaluar la expresión",
      };
    }
  },
});

export const currentTimeTool = tool({
  description: "Obtiene la fecha y hora actual en una zona horaria específica",
  inputSchema: z.object({
    timezone: z
      .string()
      .optional()
      .default("Europe/Madrid")
      .describe("Zona horaria (ej: Europe/Madrid, America/New_York)"),
  }),
  execute: async ({ timezone }) => {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("es-ES", {
      timeZone: timezone,
      dateStyle: "full",
      timeStyle: "long",
    });

    return {
      timezone,
      formatted: formatter.format(now),
      iso: now.toISOString(),
      timestamp: now.getTime(),
    };
  },
});
