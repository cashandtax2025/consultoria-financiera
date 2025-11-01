"use client";

import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileText,
  Shield,
  TrendingUp,
  Users,
  Zap,
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

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative px-4 py-20 md:py-32 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Transformamos datos financieros en
                <span className="text-primary"> decisiones estratégicas</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Consultoría financiera integral con tecnología de vanguardia.
                Análisis inteligente, reportes automatizados y asesoramiento
                experto para hacer crecer tu negocio.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/login">
                    Comenzar ahora
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="#servicios">Conocer servicios</Link>
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-primary/5 rounded-3xl blur-3xl" />
                <Card className="relative">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Rendimiento en tiempo real
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Facturación mensual
                      </span>
                      <span className="text-2xl font-bold text-green-500">
                        +24%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Gastos optimizados
                      </span>
                      <span className="text-2xl font-bold text-blue-500">
                        -18%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Margen neto
                      </span>
                      <span className="text-2xl font-bold text-primary">
                        32%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="px-4 py-20 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Nuestros servicios
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Soluciones integrales diseñadas para optimizar la gestión
              financiera de tu empresa
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Análisis Financiero</CardTitle>
                <CardDescription>
                  Análisis profundo de tus estados financieros con
                  visualizaciones interactivas y métricas clave de rendimiento
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Extracción de Datos</CardTitle>
                <CardDescription>
                  Automatización de la extracción y procesamiento de documentos
                  financieros: facturas, albaranes y estados bancarios
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Reportes Estratégicos</CardTitle>
                <CardDescription>
                  Informes personalizados con insights accionables para la toma
                  de decisiones basada en datos
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Asesoría con IA</CardTitle>
                <CardDescription>
                  Asistente inteligente disponible 24/7 para responder consultas
                  financieras y ofrecer recomendaciones personalizadas
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Gestión de Riesgos</CardTitle>
                <CardDescription>
                  Identificación y mitigación proactiva de riesgos financieros
                  con herramientas predictivas
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Consultoría Personalizada</CardTitle>
                <CardDescription>
                  Acompañamiento experto adaptado a las necesidades específicas
                  de tu negocio y sector
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Por qué elegirnos
              </h2>
              <p className="text-lg text-muted-foreground">
                Combinamos experiencia financiera tradicional con tecnología
                innovadora para ofrecer un servicio superior
              </p>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">
                      Automatización inteligente
                    </h3>
                    <p className="text-muted-foreground">
                      Reducimos el tiempo dedicado a tareas repetitivas en un
                      80%, permitiéndote enfocarte en decisiones estratégicas
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Datos en tiempo real</h3>
                    <p className="text-muted-foreground">
                      Accede a información actualizada al instante con
                      dashboards interactivos y alertas personalizadas
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">
                      Seguridad garantizada
                    </h3>
                    <p className="text-muted-foreground">
                      Protección de nivel bancario para todos tus datos
                      financieros con cifrado de extremo a extremo
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">
                      Soporte especializado
                    </h3>
                    <p className="text-muted-foreground">
                      Equipo de expertos disponible para resolver tus dudas y
                      optimizar tu estrategia financiera
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle>Resultados comprobados</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center p-6 bg-primary/5 rounded-lg">
                    <div className="text-4xl font-bold text-primary mb-2">
                      93%
                    </div>
                    <p className="text-sm text-muted-foreground">
                      de nuestros clientes reportan mejora en sus márgenes
                    </p>
                  </div>
                  <div className="text-center p-6 bg-primary/5 rounded-lg">
                    <div className="text-4xl font-bold text-primary mb-2">
                      15h/semana
                    </div>
                    <p className="text-sm text-muted-foreground">
                      promedio de tiempo ahorrado en gestión administrativa
                    </p>
                  </div>
                  <div className="text-center p-6 bg-primary/5 rounded-lg">
                    <div className="text-4xl font-bold text-primary mb-2">
                      200+
                    </div>
                    <p className="text-sm text-muted-foreground">
                      empresas confían en nuestros servicios
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-gradient-to-b from-muted/50 to-background border-y">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            ¿Listo para transformar tu gestión financiera?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Únete a cientos de empresas que ya están tomando mejores decisiones
            con nuestras herramientas y consultoría experta
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/login">
                Comenzar gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#servicios">Agendar demostración</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 border-t bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Consultoría Financiera</h3>
              <p className="text-sm text-muted-foreground">
                Transformando datos en decisiones estratégicas desde 2024
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Servicios</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#servicios" className="hover:text-primary">
                    Análisis Financiero
                  </Link>
                </li>
                <li>
                  <Link href="#servicios" className="hover:text-primary">
                    Extracción de Datos
                  </Link>
                </li>
                <li>
                  <Link href="#servicios" className="hover:text-primary">
                    Reportes Estratégicos
                  </Link>
                </li>
                <li>
                  <Link href="#servicios" className="hover:text-primary">
                    Asesoría con IA
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-primary">
                    Acerca de
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Casos de éxito
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-primary">
                    Privacidad
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Términos de servicio
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2024 Consultoría Financiera. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
