import { Building2, Users, Target, Award, Heart, Lightbulb } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AcercaDePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative px-4 py-20 md:py-32 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Transformamos el futuro financiero de{" "}
              <span className="text-primary">tu negocio</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Somos un equipo de expertos en consultoría financiera
              especializados en pymes y autónomos en España. Combinamos
              experiencia tradicional con tecnología de vanguardia.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="border-2">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Nuestra Misión</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Democratizar el acceso a consultoría financiera de calidad,
                  proporcionando a pymes y autónomos las herramientas y el
                  conocimiento que necesitan para tomar decisiones informadas,
                  optimizar sus recursos y alcanzar el éxito sostenible.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Nuestra Visión</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Ser la plataforma de referencia en España para la gestión
                  financiera inteligente de pymes y autónomos, reconocidos por
                  nuestra innovación tecnológica, cercanía con el cliente y
                  resultados tangibles que impulsan el crecimiento empresarial.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-4 py-20 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Nuestros Valores
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Los principios que guían cada decisión y acción en nuestra
              empresa
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Compromiso</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Nos comprometemos con el éxito de cada cliente, dedicando
                  nuestro mejor esfuerzo y experiencia a cada proyecto.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Innovación</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Integramos constantemente las últimas tecnologías para
                  ofrecer soluciones más eficientes y efectivas.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Cercanía</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Construimos relaciones duraderas basadas en la confianza, la
                  transparencia y el trato personalizado.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Excelencia</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Mantenemos los más altos estándares de calidad en cada
                  servicio que ofrecemos, buscando siempre superar expectativas.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Orientación a resultados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Nos enfocamos en generar valor real y medible para nuestros
                  clientes, con estrategias concretas y accionables.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Integridad</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Actuamos con ética y transparencia en todas nuestras
                  operaciones, priorizando siempre el interés de nuestros
                  clientes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Nuestro Equipo</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Profesionales con amplia experiencia en consultoría financiera y
              tecnología
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-8">
            <Card>
              <CardContent className="p-8">
                <div className="space-y-4">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Nuestro equipo está formado por{" "}
                    <strong>consultores financieros certificados</strong>,{" "}
                    <strong>economistas</strong>,{" "}
                    <strong>expertos en fiscalidad</strong> y{" "}
                    <strong>desarrolladores tecnológicos</strong> que trabajan
                    juntos para ofrecer soluciones integrales.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Con más de <strong>20 años de experiencia combinada</strong>{" "}
                    en el sector financiero español, entendemos los desafíos
                    únicos que enfrentan las pymes y autónomos, desde la gestión
                    del flujo de caja hasta el cumplimiento normativo.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Nos mantenemos constantemente actualizados con las últimas
                    regulaciones, tecnologías y mejores prácticas del sector
                    para garantizar que nuestros clientes siempre reciban el
                    asesoramiento más relevante y efectivo.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-gradient-to-b from-muted/50 to-background border-y">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            ¿Quieres conocer más sobre nosotros?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Agenda una consulta gratuita y descubre cómo podemos ayudarte a
            alcanzar tus objetivos financieros
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href={"/contacto"}>Contáctanos</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/casos-de-exito">Ver casos de éxito</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

