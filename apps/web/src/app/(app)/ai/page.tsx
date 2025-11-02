import { requireAuth } from "@/lib/auth-utils";
import AIClient from "./ai-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function AIPage() {
  await requireAuth();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Asistente IA</h1>
        <p className="text-muted-foreground mt-2">
          Obtén respuestas a tus consultas financieras con inteligencia artificial
        </p>
      </div>
      <Card className="h-[calc(100vh-16rem)]">
        <CardHeader className="pb-4">
          <CardTitle>Chat con IA</CardTitle>
          <CardDescription>
            Pregunta sobre análisis financieros, tendencias y recomendaciones
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[calc(100%-5rem)]">
          <AIClient />
        </CardContent>
      </Card>
    </div>
  );
}
