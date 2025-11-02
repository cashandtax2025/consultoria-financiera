"use client";

import { Cookie, Settings, BarChart, Shield, Eye } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

export default function CookiesPage() {
  const [preferences, setPreferences] = useState({
    essential: true, // Always enabled
    analytics: true,
    marketing: false,
    functional: true,
  });

  const handleSavePreferences = () => {
    // Save to localStorage
    localStorage.setItem("cookiePreferences", JSON.stringify(preferences));
    toast.success("Preferencias de cookies guardadas correctamente");
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    setPreferences(allAccepted);
    localStorage.setItem("cookiePreferences", JSON.stringify(allAccepted));
    toast.success("Todas las cookies aceptadas");
  };

  const handleRejectAll = () => {
    const onlyEssential = {
      essential: true, // Can't be disabled
      analytics: false,
      marketing: false,
      functional: false,
    };
    setPreferences(onlyEssential);
    localStorage.setItem("cookiePreferences", JSON.stringify(onlyEssential));
    toast.success("Solo cookies esenciales activadas");
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative px-4 py-20 md:py-28 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Cookie className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Política de Cookies
            </h1>
            <p className="text-lg text-muted-foreground">
              Última actualización: 1 de noviembre de 2025
            </p>
          </div>
        </div>
      </section>

      {/* Cookie Preferences */}
      <section className="px-4 py-12 bg-muted/30 border-y">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Configuración de Cookies
              </CardTitle>
              <CardDescription>
                Personaliza tus preferencias de cookies. Puedes cambiarlas en
                cualquier momento.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Essential */}
              <div className="flex items-start justify-between p-4 border rounded-lg bg-background">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Label className="text-base font-semibold">
                      Cookies Esenciales
                    </Label>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                      Siempre activas
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Necesarias para el funcionamiento básico del sitio web.
                    Incluyen autenticación, seguridad y preferencias básicas.
                  </p>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    className="h-5 w-5"
                  />
                </div>
              </div>

              {/* Functional */}
              <div className="flex items-start justify-between p-4 border rounded-lg">
                <div className="space-y-2 flex-1">
                  <Label className="text-base font-semibold">
                    Cookies Funcionales
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Permiten funcionalidades mejoradas como recordar tus
                    preferencias, idioma y configuraciones personalizadas.
                  </p>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    checked={preferences.functional}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        functional: e.target.checked,
                      })
                    }
                    className="h-5 w-5"
                  />
                </div>
              </div>

              {/* Analytics */}
              <div className="flex items-start justify-between p-4 border rounded-lg">
                <div className="space-y-2 flex-1">
                  <Label className="text-base font-semibold">
                    Cookies Analíticas
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Nos ayudan a entender cómo los usuarios interactúan con el
                    sitio para mejorar la experiencia. Los datos son anónimos y
                    agregados.
                  </p>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        analytics: e.target.checked,
                      })
                    }
                    className="h-5 w-5"
                  />
                </div>
              </div>

              {/* Marketing */}
              <div className="flex items-start justify-between p-4 border rounded-lg">
                <div className="space-y-2 flex-1">
                  <Label className="text-base font-semibold">
                    Cookies de Marketing
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Utilizadas para mostrar anuncios relevantes y medir la
                    efectividad de campañas publicitarias.
                  </p>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        marketing: e.target.checked,
                      })
                    }
                    className="h-5 w-5"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button onClick={handleSavePreferences} className="flex-1">
                  Guardar preferencias
                </Button>
                <Button
                  onClick={handleAcceptAll}
                  variant="outline"
                  className="flex-1"
                >
                  Aceptar todas
                </Button>
                <Button
                  onClick={handleRejectAll}
                  variant="outline"
                  className="flex-1"
                >
                  Rechazar todas
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
            {/* Introduction */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  ¿Qué son las cookies?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Las cookies son pequeños archivos de texto que se almacenan en
                  tu dispositivo cuando visitas un sitio web. Se utilizan
                  ampliamente para hacer que los sitios web funcionen de manera
                  más eficiente y para proporcionar información a los
                  propietarios del sitio.
                </p>
                <p>
                  En <strong>Consultoría Financiera</strong>, utilizamos cookies
                  y tecnologías similares para mejorar tu experiencia, entender
                  cómo utilizas nuestros servicios y personalizar el contenido.
                </p>
                <p>
                  Esta Política de Cookies explica qué cookies utilizamos, por
                  qué las utilizamos y cómo puedes controlarlas.
                </p>
              </CardContent>
            </Card>

            {/* Types of Cookies */}
            <Card>
              <CardHeader>
                <CardTitle>Tipos de Cookies que Utilizamos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-muted-foreground">
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    1. Cookies Esenciales (Obligatorias)
                  </h3>
                  <p className="mb-2">
                    Estas cookies son necesarias para que el sitio web funcione y
                    no se pueden desactivar en nuestros sistemas.
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg mt-3">
                    <p className="text-sm font-semibold mb-2">Ejemplos:</p>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Cookies de autenticación y sesión de usuario</li>
                      <li>Cookies de seguridad y prevención de fraude</li>
                      <li>Cookies de equilibrio de carga del servidor</li>
                      <li>Cookies de preferencias de privacidad</li>
                    </ul>
                    <p className="text-sm mt-3">
                      <strong>Duración:</strong> Sesión o hasta 1 año
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary" />
                    2. Cookies Funcionales
                  </h3>
                  <p className="mb-2">
                    Permiten que el sitio web recuerde tus elecciones (como tu
                    idioma o región) y proporcionar características mejoradas y
                    más personalizadas.
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg mt-3">
                    <p className="text-sm font-semibold mb-2">Ejemplos:</p>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Preferencias de idioma e idioma</li>
                      <li>Configuraciones de visualización (tema oscuro/claro)</li>
                      <li>Reproducción de video y preferencias de contenido</li>
                      <li>Estado de elementos expandidos/colapsados</li>
                    </ul>
                    <p className="text-sm mt-3">
                      <strong>Duración:</strong> Hasta 2 años
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <BarChart className="h-4 w-4 text-primary" />
                    3. Cookies Analíticas
                  </h3>
                  <p className="mb-2">
                    Estas cookies nos permiten contar visitas y fuentes de
                    tráfico para poder medir y mejorar el rendimiento de nuestro
                    sitio. Toda la información recopilada es anónima.
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg mt-3">
                    <p className="text-sm font-semibold mb-2">
                      Servicios utilizados:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>
                        <strong>Google Analytics:</strong> Análisis de uso y
                        comportamiento (anonimizado)
                      </li>
                      <li>
                        <strong>Plausible/Fathom:</strong> Analítica respetuosa
                        con la privacidad
                      </li>
                    </ul>
                    <p className="text-sm mt-3">
                      <strong>Datos recopilados:</strong> Páginas visitadas,
                      tiempo en el sitio, origen del tráfico, dispositivo/navegador
                    </p>
                    <p className="text-sm mt-2">
                      <strong>Duración:</strong> Hasta 2 años
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-3">
                    4. Cookies de Marketing y Publicidad
                  </h3>
                  <p className="mb-2">
                    Estas cookies pueden ser establecidas por nosotros o por
                    nuestros socios publicitarios para construir un perfil de tus
                    intereses y mostrarte anuncios relevantes.
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg mt-3">
                    <p className="text-sm font-semibold mb-2">
                      Servicios utilizados:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>
                        <strong>Google Ads:</strong> Publicidad personalizada
                      </li>
                      <li>
                        <strong>Facebook Pixel:</strong> Retargeting y medición
                        de conversiones
                      </li>
                      <li>
                        <strong>LinkedIn Insight:</strong> Publicidad B2B
                      </li>
                    </ul>
                    <p className="text-sm mt-3">
                      <strong>Duración:</strong> Hasta 2 años
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Third Party */}
            <Card>
              <CardHeader>
                <CardTitle>Cookies de Terceros</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Además de nuestras propias cookies, utilizamos cookies de
                  terceros para diversos propósitos:
                </p>

                <div className="space-y-3">
                  <div className="border-l-2 border-primary pl-4">
                    <p className="font-semibold text-foreground">Google LLC</p>
                    <p className="text-sm">
                      Analytics, Ads, reCAPTCHA - Análisis web, publicidad y
                      seguridad
                    </p>
                    <a
                      href="https://policies.google.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      Política de privacidad →
                    </a>
                  </div>

                  <div className="border-l-2 border-primary pl-4">
                    <p className="font-semibold text-foreground">Meta (Facebook)</p>
                    <p className="text-sm">
                      Facebook Pixel - Publicidad y remarketing
                    </p>
                    <a
                      href="https://www.facebook.com/privacy/explanation"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      Política de privacidad →
                    </a>
                  </div>

                  <div className="border-l-2 border-primary pl-4">
                    <p className="font-semibold text-foreground">LinkedIn</p>
                    <p className="text-sm">
                      Insight Tag - Publicidad B2B y análisis
                    </p>
                    <a
                      href="https://www.linkedin.com/legal/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      Política de privacidad →
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Control */}
            <Card>
              <CardHeader>
                <CardTitle>Cómo Controlar las Cookies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Configuración en este sitio
                  </h3>
                  <p>
                    Puedes usar el panel de configuración en la parte superior de
                    esta página para gestionar tus preferencias de cookies en
                    cualquier momento.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Configuración del navegador
                  </h3>
                  <p>
                    La mayoría de los navegadores te permiten rechazar o eliminar
                    cookies. Aquí están los enlaces a las instrucciones para los
                    navegadores más populares:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>
                      <a
                        href="https://support.google.com/chrome/answer/95647"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Google Chrome
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://support.mozilla.org/es/kb/impedir-que-los-sitios-web-guarden-sus-preferencia"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Mozilla Firefox
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://support.apple.com/es-es/guide/safari/sfri11471/mac"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Safari
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Microsoft Edge
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Consecuencias de desactivar cookies
                  </h3>
                  <p>
                    Si desactivas ciertas cookies, es posible que algunas
                    funcionalidades del sitio no funcionen correctamente. Por
                    ejemplo:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 mt-2">
                    <li>No podrás mantener la sesión iniciada</li>
                    <li>
                      Tus preferencias no se guardarán entre sesiones
                    </li>
                    <li>Algunas funciones personalizadas no estarán disponibles</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Updates */}
            <Card>
              <CardHeader>
                <CardTitle>Actualizaciones de esta Política</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Podemos actualizar esta Política de Cookies ocasionalmente para
                  reflejar cambios en las cookies que utilizamos o por otras
                  razones operativas, legales o regulatorias.
                </p>
                <p>
                  Te recomendamos revisar esta página periódicamente para estar
                  informado sobre cómo utilizamos las cookies.
                </p>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle>Más Información</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Si tienes preguntas sobre nuestra Política de Cookies o cómo
                  utilizamos las cookies, puedes contactarnos:
                </p>
                <div className="space-y-2">
                  <p>
                    <strong className="text-foreground">Email:</strong>{" "}
                    <a
                      href="mailto:privacidad@consultoriafinanciera.es"
                      className="text-primary hover:underline"
                    >
                      privacidad@consultoriafinanciera.es
                    </a>
                  </p>
                </div>
                <p className="pt-4 border-t">
                  Para más información sobre cómo tratamos tus datos personales,
                  consulta nuestra{" "}
                  <Link href="/privacidad" className="text-primary hover:underline">
                    Política de Privacidad
                  </Link>
                  .
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

