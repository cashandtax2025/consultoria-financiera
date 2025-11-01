"use client";

import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactoPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success(
      "¡Mensaje enviado! Nos pondremos en contacto contigo pronto."
    );
    setLoading(false);

    // Reset form
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative px-4 py-20 md:py-32 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="text-primary">Hablemos</span> de tu negocio
            </h1>
            <p className="text-xl text-muted-foreground">
              Estamos aquí para ayudarte a transformar la gestión financiera de
              tu empresa. Agenda una consulta gratuita o envíanos tu consulta.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Envíanos un mensaje</CardTitle>
                  <CardDescription>
                    Completa el formulario y nos pondremos en contacto contigo
                    en menos de 24 horas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre*</Label>
                        <Input
                          id="nombre"
                          name="nombre"
                          placeholder="Tu nombre"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="apellidos">Apellidos*</Label>
                        <Input
                          id="apellidos"
                          name="apellidos"
                          placeholder="Tus apellidos"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email*</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="tu@email.com"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telefono">Teléfono</Label>
                        <Input
                          id="telefono"
                          name="telefono"
                          type="tel"
                          placeholder="+34 600 000 000"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="empresa">Empresa</Label>
                      <Input
                        id="empresa"
                        name="empresa"
                        placeholder="Nombre de tu empresa"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tipo">Tipo de consulta*</Label>
                      <Select name="tipo" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el tipo de consulta" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="consultoria">
                            Consultoría financiera
                          </SelectItem>
                          <SelectItem value="analisis">
                            Análisis financiero
                          </SelectItem>
                          <SelectItem value="automatizacion">
                            Automatización y extracción de datos
                          </SelectItem>
                          <SelectItem value="asesoria">
                            Asesoría personalizada
                          </SelectItem>
                          <SelectItem value="demo">
                            Solicitar demostración
                          </SelectItem>
                          <SelectItem value="otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mensaje">Mensaje*</Label>
                      <Textarea
                        id="mensaje"
                        name="mensaje"
                        placeholder="Cuéntanos sobre tu proyecto o consulta..."
                        rows={6}
                        required
                      />
                    </div>

                    <Button type="submit" size="lg" disabled={loading}>
                      {loading ? (
                        "Enviando..."
                      ) : (
                        <>
                          Enviar mensaje
                          <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>

                    <p className="text-sm text-muted-foreground">
                      * Campos obligatorios. Al enviar este formulario, aceptas
                      nuestra{" "}
                      <a href="/privacidad" className="text-primary hover:underline">
                        Política de Privacidad
                      </a>
                      .
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información de contacto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Email</p>
                      <a
                        href="mailto:info@consultoriafinanciera.es"
                        className="text-muted-foreground hover:text-primary"
                      >
                        info@consultoriafinanciera.es
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Teléfono</p>
                      <a
                        href="tel:+34900123456"
                        className="text-muted-foreground hover:text-primary"
                      >
                        +34 900 123 456
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Oficina</p>
                      <p className="text-muted-foreground">
                        Calle Serrano, 123
                        <br />
                        28006 Madrid, España
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Horario</p>
                      <p className="text-muted-foreground">
                        Lunes a Viernes: 9:00 - 18:00
                        <br />
                        Sábado y Domingo: Cerrado
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>¿Prefieres agendar una llamada?</CardTitle>
                  <CardDescription>
                    Reserva una consulta gratuita de 30 minutos con uno de
                    nuestros expertos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Agendar consulta
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">
                      Respuesta garantizada en 24h
                    </strong>
                    <br />
                    Nos comprometemos a responder todas las consultas en un
                    plazo máximo de 24 horas laborables.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-20 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Preguntas frecuentes
            </h2>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  ¿Cuánto tiempo tarda la primera consulta?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  La consulta inicial es gratuita y dura aproximadamente 30
                  minutos. En ella analizamos tu situación actual y te
                  presentamos cómo podemos ayudarte.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  ¿Trabajáis con autónomos y pequeñas empresas?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sí, nos especializamos en pymes y autónomos. Ofrecemos
                  soluciones adaptadas a diferentes tamaños y necesidades de
                  negocio.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  ¿Qué sectores atendéis?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Trabajamos con empresas de todos los sectores: comercio,
                  servicios, hostelería, construcción, tecnología, y más.
                  Adaptamos nuestras soluciones a las particularidades de cada
                  sector.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  ¿Ofrecéis servicios presenciales u online?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Ofrecemos ambas modalidades. Puedes elegir reuniones
                  presenciales en nuestra oficina de Madrid o consultas online
                  por videollamada desde cualquier lugar de España.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

