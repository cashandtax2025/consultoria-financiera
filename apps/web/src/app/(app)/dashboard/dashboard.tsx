"use client";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileSpreadsheet,
  Upload,
  TrendingUp,
  Activity,
  ArrowUpRight,
  FileText,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Dashboard({
  session,
}: {
  session: {
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
}) {
  const uploadsQuery = useQuery(
    trpc.upload.getUserUploads.queryOptions({
      limit: 5,
      offset: 0,
    })
  );

  const recentUploads = uploadsQuery.data || [];

  // Quick actions
  const quickActions = [
    {
      title: "Importar Datos",
      description: "Sube archivos Excel o CSV",
      icon: Upload,
      href: "/import" as const,
      color: "text-blue-500",
    },
    {
      title: "Extracción",
      description: "Extrae datos de documentos",
      icon: FileSpreadsheet,
      href: "/extract" as const,
      color: "text-green-500",
    },
    {
      title: "Análisis",
      description: "Ver análisis de producción",
      icon: BarChart3,
      href: "/analytics" as const,
      color: "text-purple-500",
    },
    {
      title: "Asistente IA",
      description: "Consulta con IA",
      icon: Activity,
      href: "/ai" as const,
      color: "text-orange-500",
    },
  ];

  // Stats cards
  const stats = [
    {
      title: "Archivos Importados",
      value: recentUploads.length.toString(),
      description: "Últimas 5 importaciones",
      icon: FileText,
      trend: "+12%",
    },
    {
      title: "Documentos Procesados",
      value: recentUploads.filter((u) => u.status === "completed").length.toString(),
      description: "Procesados con éxito",
      icon: TrendingUp,
      trend: "+8%",
    },
    {
      title: "En Procesamiento",
      value: recentUploads.filter((u) => u.status === "processing").length.toString(),
      description: "Documentos en cola",
      icon: Activity,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h2 className="text-2xl font-semibold">
          Bienvenido de vuelta, {session.user.name.split(" ")[0]}! 👋
        </h2>
        <p className="text-muted-foreground mt-1">
          Aquí tienes un resumen de tu actividad reciente
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
                {stat.trend && (
                  <div className="flex items-center text-xs text-green-500 mt-2">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    {stat.trend} desde el último mes
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Acciones Rápidas</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card
                key={index}
                className="hover:shadow-md transition-shadow cursor-pointer group"
              >
                <Link href={action.href}>
                  <CardHeader>
                    <div
                      className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${action.color}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-base">{action.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {action.description}
                    </CardDescription>
                  </CardHeader>
                </Link>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Actividad Reciente</CardTitle>
                <CardDescription>
                  Últimas importaciones y procesamiento
                </CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href="/import/history">
                  Ver todo
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentUploads.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileSpreadsheet className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No hay actividad reciente</p>
                <Button asChild variant="link" className="mt-2">
                  <Link href="/import">Importar tu primer archivo</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentUploads.slice(0, 5).map((upload) => (
                  <div
                    key={upload.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-primary/10">
                        <FileSpreadsheet className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{upload.filename}</p>
                        <p className="text-xs text-muted-foreground">
                          {upload.clientName || "Sin cliente"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-xs px-2 py-1 rounded-full ${
                          upload.status === "completed"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : upload.status === "error"
                              ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        }`}
                      >
                        {upload.status === "completed"
                          ? "Completado"
                          : upload.status === "error"
                            ? "Error"
                            : "Procesando"}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(upload.uploadedAt).toLocaleDateString("es-ES")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Getting Started Guide */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle>Guía de Inicio</CardTitle>
            <CardDescription>
              Sigue estos pasos para aprovechar al máximo la plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <div>
                  <h4 className="font-medium mb-1">Importa tus datos</h4>
                  <p className="text-sm text-muted-foreground">
                    Sube archivos Excel o CSV con tus datos financieros
                  </p>
                  <Button asChild variant="link" size="sm" className="p-0 h-auto">
                    <Link href="/import">Ir a Importar →</Link>
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/70 text-primary-foreground flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <div>
                  <h4 className="font-medium mb-1">Analiza tus datos</h4>
                  <p className="text-sm text-muted-foreground">
                    Visualiza análisis y tendencias de producción
                  </p>
                  <Button asChild variant="link" size="sm" className="p-0 h-auto">
                    <Link href="/analytics">Ver Análisis →</Link>
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/50 text-primary-foreground flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <div>
                  <h4 className="font-medium mb-1">Consulta con IA</h4>
                  <p className="text-sm text-muted-foreground">
                    Obtén insights y recomendaciones inteligentes
                  </p>
                  <Button asChild variant="link" size="sm" className="p-0 h-auto">
                    <Link href="/ai">Probar IA →</Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
