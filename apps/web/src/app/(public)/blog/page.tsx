import { Calendar, Clock, ArrowRight, TrendingUp } from "lucide-react";
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

export default function BlogPage() {
  const posts = [
    {
      id: 1,
      title: "Claves para optimizar el flujo de caja en tu pyme en 2025",
      excerpt:
        "Descubre estrategias prácticas para mantener un flujo de caja saludable y asegurar la liquidez de tu negocio durante todo el año.",
      category: "Gestión Financiera",
      date: "15 de octubre, 2025",
      readTime: "5 min",
    },
    {
      id: 2,
      title: "Guía completa sobre el nuevo reglamento fiscal para autónomos",
      excerpt:
        "Todo lo que necesitas saber sobre los cambios fiscales de 2025 y cómo adaptarte para cumplir con la normativa sin sorpresas.",
      category: "Fiscalidad",
      date: "8 de octubre, 2025",
      readTime: "8 min",
    },
    {
      id: 3,
      title: "IA aplicada a la contabilidad: Automatiza y ahorra tiempo",
      excerpt:
        "Cómo la inteligencia artificial está transformando la gestión contable de pequeñas empresas, reduciendo errores y liberando tiempo valioso.",
      category: "Tecnología",
      date: "1 de octubre, 2025",
      readTime: "6 min",
    },
    {
      id: 4,
      title: "Ratios financieros esenciales que todo empresario debe conocer",
      excerpt:
        "Los indicadores clave que te ayudarán a evaluar la salud financiera de tu empresa y tomar decisiones más informadas.",
      category: "Análisis",
      date: "24 de septiembre, 2025",
      readTime: "7 min",
    },
    {
      id: 5,
      title: "Cómo preparar tu empresa para una auditoría sin estrés",
      excerpt:
        "Una guía paso a paso para organizar tu documentación financiera y enfrentar auditorías con confianza.",
      category: "Compliance",
      date: "17 de septiembre, 2025",
      readTime: "10 min",
    },
    {
      id: 6,
      title: "Estrategias de financiación para el crecimiento empresarial",
      excerpt:
        "Explora las diferentes opciones de financiación disponibles para pymes en España y cuál se adapta mejor a tu situación.",
      category: "Financiación",
      date: "10 de septiembre, 2025",
      readTime: "9 min",
    },
    {
      id: 7,
      title: "Control de costes: Identifica y elimina gastos innecesarios",
      excerpt:
        "Técnicas efectivas para analizar tu estructura de costes y encontrar oportunidades de ahorro sin comprometer la calidad.",
      category: "Gestión Financiera",
      date: "3 de septiembre, 2025",
      readTime: "6 min",
    },
    {
      id: 8,
      title: "Digitalización financiera: Por dónde empezar en tu pyme",
      excerpt:
        "Los primeros pasos para transformar digitalmente la gestión financiera de tu empresa y obtener resultados inmediatos.",
      category: "Tecnología",
      date: "27 de agosto, 2025",
      readTime: "5 min",
    },
  ];

  const categories = [
    "Todos",
    "Gestión Financiera",
    "Fiscalidad",
    "Tecnología",
    "Análisis",
    "Compliance",
    "Financiación",
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative px-4 py-20 md:py-32 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Blog de <span className="text-primary">Consultoría Financiera</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Insights, consejos y análisis para optimizar la gestión financiera
              de tu pyme o negocio como autónomo
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 py-8 border-b bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={category === "Todos" ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-4 py-2"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="px-4 py-12">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <Badge className="mb-4">Destacado</Badge>
            <Card className="border-2 border-primary/20 overflow-hidden">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="aspect-video md:aspect-auto bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <TrendingUp className="h-24 w-24 text-primary/40" />
                </div>
                <div className="p-6 flex flex-col justify-center">
                  <Badge className="w-fit mb-3">Gestión Financiera</Badge>
                  <h2 className="text-3xl font-bold mb-3">
                    {posts[0].title}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    {posts[0].excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {posts[0].date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {posts[0].readTime} de lectura
                    </div>
                  </div>
                  <Button variant="outline" className="w-fit">
                    Leer más
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="px-4 py-12 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.slice(1).map((post) => (
              <Card
                key={post.id}
                className="flex flex-col transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <CardHeader>
                  <Badge variant="outline" className="w-fit mb-2">
                    {post.category}
                  </Badge>
                  <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </div>
                  </div>
                  <Button variant="ghost" className="w-full">
                    Leer artículo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="px-4 py-20 bg-gradient-to-b from-background to-muted/50 border-y">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Recibe insights financieros en tu email
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Suscríbete a nuestra newsletter y recibe contenido exclusivo,
            consejos prácticos y las últimas novedades del sector financiero
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="tu@email.com"
              className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Button className="sm:w-auto">Suscribirse</Button>
          </div>
        </div>
      </section>
    </div>
  );
}

