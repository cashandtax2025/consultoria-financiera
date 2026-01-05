import { requireAuth } from "@/lib/auth-utils";
import AIClient from "./ai-client";

export default async function AIPage() {
  await requireAuth();

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col">
      <div className="mb-4 shrink-0">
        <h1 className="font-bold text-3xl">Asistente IA</h1>
        <p className="mt-2 text-muted-foreground">
          Obtén respuestas a tus consultas financieras con inteligencia
          artificial
        </p>
      </div>

      <AIClient />
    </div>
  );
}
