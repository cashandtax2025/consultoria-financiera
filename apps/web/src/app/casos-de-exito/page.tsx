/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
import {
  TrendingUp,
  Users,
  Building2,
  Package,
  ShoppingCart,
  Utensils,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CasosExitoPage() {
  const cases = [
    {
      id: 1,
      company: "Distribuidora García",
      sector: "Comercio mayorista",
      icon: Package,
      challenge:
        "Dificultad para controlar márgenes de beneficio por producto y falta de visibilidad en tiempo real del inventario y flujo de caja.",
      solution:
        "Implementamos un sistema de análisis automatizado con dashboards personalizados que permitieron identificar productos poco rentables y optimizar la gestión de inventario.",
      results: [
        "+35% incremento en margen neto",
        "-45% reducción en stock obsoleto",
        "15 horas/semana ahorradas en reporting",
      ],
      period: "6 meses",
    },
    {
      id: 2,
      company: "Construcciones Martínez",
      sector: "Construcción",
      icon: Building2,
      challenge:
        "Dificultades para gestionar múltiples proyectos simultáneos, con sobrecostes frecuentes y problemas de liquidez entre proyectos.",
      solution:
        "Diseñamos un sistema de contabilidad analítica por proyecto con alertas tempranas de desviaciones presupuestarias y planificación del flujo de caja por obra.",
      results: [
        "+28% mejora en márgenes de proyecto",
        "-60% reducción en sobrecostes",
        "Visibilidad completa de rentabilidad por obra",
      ],
      period: "8 meses",
    },
    {
      id: 3,
      company: "E-commerce López",
      sector: "Comercio electrónico",
      icon: ShoppingCart,
      challenge:
        "Crecimiento rápido sin estructuras financieras adecuadas. Desconocían su CAC real, LTV de clientes y rentabilidad por canal de venta.",
      solution:
        "Implementamos un modelo de análisis de métricas clave (CAC, LTV, margen por canal) con integración directa a sus plataformas de venta y publicidad digital.",
      results: [
        "+52% mejora en ROI de marketing",
        "Identificación de canales no rentables",
        "Optimización de inversión publicitaria",
      ],
      period: "4 meses",
    },
    {
      id: 4,
      company: "Restaurante El Rincón",
      sector: "Hostelería",
      icon: Utensils,
      challenge:
        "Costes de materias primas descontrolados, dificultad para fijar precios rentables y ausencia de control de desperdicio.",
      solution:
        "Desarrollamos un sistema de control de costes por plato (escandallo) y análisis de rentabilidad del menú, con seguimiento semanal de mermas y desperdicios.",
      results: [
        "+42% aumento en rentabilidad",
        "-30% reducción de desperdicio",
        "Optimización completa del menú",
      ],
      period: "5 meses",
    },
    {
      id: 5,
      company: "Consultoría TechPro",
      sector: "Servicios profesionales",
      icon: Users,
      challenge:
        "Dificultad para dimensionar proyectos correctamente, con frecuentes pérdidas por subestimación de horas y falta de seguimiento de rentabilidad por cliente.",
      solution:
        "Implementamos un modelo de valoración de proyectos con análisis de rentabilidad real vs. estimada, y sistema de alertas por desviaciones horarias.",
      results: [
        "+38% incremento en facturación por proyecto",
        "95% de precisión en estimaciones",
        "Identificación de clientes más rentables",
      ],
      period: "6 meses",
    },
    {
      id: 6,
      company: "Farmacia Central",
      sector: "Retail farmacéutico",
      icon: Package,
      challenge:
        "Gestión ineficiente del inventario con capital inmovilizado, dificultad para negociar con proveedores y desconocimiento de productos más rentables.",
      solution:
        "Desarrollamos un análisis ABC de productos, optimización de puntos de reorden y estrategias de negociación basadas en datos de rotación y margen.",
      results: [
        "+25% mejora en rotación de inventario",
        "-€18.000 en capital liberado",
        "Mejores condiciones con proveedores",
      ],
      period: "7 meses",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative px-4 py-20 md:py-32 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Casos de <span className="text-primary">Éxito</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Historias reales de pymes y autónomos que transformaron su gestión
              financiera y alcanzaron resultados extraordinarios con nuestra
              ayuda
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-12 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">200+</div>
                <p className="text-muted-foreground">Empresas asesoradas</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">+35%</div>
                <p className="text-muted-foreground">
                  Mejora promedio en rentabilidad
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">97%</div>
                <p className="text-muted-foreground">
                  Tasa de satisfacción
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="space-y-12">
            {cases.map((caseStudy, index) => {
              const Icon = caseStudy.icon;
              return (
                <Card
                  key={caseStudy.id}
                  className={`overflow-hidden ${
                    index === 0 ? "border-2 border-primary/20" : ""
                  }`}
                >
                  {index === 0 && (
                    <Badge className="absolute top-4 right-4">Destacado</Badge>
                  )}
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Company Info */}
                    <div className="bg-muted/50 p-8 flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">
                        {caseStudy.company}
                      </h3>
                      <Badge variant="outline" className="mb-3">
                        {caseStudy.sector}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        Proyecto de {caseStudy.period}
                      </p>
                    </div>

                    {/* Case Details */}
                    <div className="md:col-span-2 p-8 space-y-6">
                      <div>
                        <h4 className="font-semibold text-sm text-primary mb-2">
                          EL DESAFÍO
                        </h4>
                        <p className="text-muted-foreground">
                          {caseStudy.challenge}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm text-primary mb-2">
                          NUESTRA SOLUCIÓN
                        </h4>
                        <p className="text-muted-foreground">
                          {caseStudy.solution}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm text-primary mb-3">
                          RESULTADOS ALCANZADOS
                        </h4>
                        <div className="grid gap-3 sm:grid-cols-3">
                          {caseStudy.results.map((result, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-2 bg-primary/5 p-3 rounded-lg"
                            >
                              <TrendingUp className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                              <span className="text-sm font-medium">
                                {result}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 py-20 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Lo que dicen nuestros clientes
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>María García</CardTitle>
                <CardDescription>CEO, Distribuidora García</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground italic">
                  "Nunca imaginé que podríamos mejorar tanto nuestros márgenes.
                  El equipo identificó problemas que llevábamos años arrastrando
                  y nos dieron soluciones prácticas y medibles."
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Carlos Martínez</CardTitle>
                <CardDescription>
                  Director, Construcciones Martínez
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground italic">
                  "La visibilidad que ahora tenemos sobre cada proyecto es
                  increíble. Tomamos decisiones basadas en datos reales, no en
                  intuición, y los resultados hablan por sí solos."
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ana López</CardTitle>
                <CardDescription>Fundadora, E-commerce López</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground italic">
                  "Gracias a su análisis descubrimos que estábamos perdiendo
                  dinero en algunos canales de venta. Ahora invertimos solo
                  donde realmente genera retorno."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-gradient-to-b from-background to-muted/50 border-y">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            ¿Quieres ser nuestro próximo caso de éxito?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Agenda una consulta gratuita y descubre cómo podemos ayudarte a
            alcanzar tus objetivos financieros
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href={"/contacto"}>
                Agendar consulta gratuita
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Comenzar ahora</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

