import { Shield, Eye, Lock, Database, Mail, UserCheck } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PrivacidadPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative px-4 py-20 md:py-28 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Política de Privacidad
            </h1>
            <p className="text-lg text-muted-foreground">
              Última actualización: 1 de noviembre de 2025
            </p>
          </div>
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
                  Introducción
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  En <strong>Consultoría Financiera</strong> (en adelante, "nosotros",
                  "nuestro" o la "Empresa"), nos comprometemos a proteger y
                  respetar tu privacidad. Esta Política de Privacidad explica
                  cómo recopilamos, usamos, compartimos y protegemos tu
                  información personal cuando utilizas nuestra plataforma y
                  servicios.
                </p>
                <p>
                  Esta política se aplica a todos los usuarios de nuestros
                  servicios de consultoría financiera, ya sean clientes,
                  visitantes del sitio web o usuarios registrados de la
                  plataforma.
                </p>
                <p>
                  Al utilizar nuestros servicios, aceptas las prácticas descritas
                  en esta Política de Privacidad. Si no estás de acuerdo con
                  esta política, te rogamos que no utilices nuestros servicios.
                </p>
              </CardContent>
            </Card>

            {/* Data Collection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  Información que Recopilamos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    1. Información que nos proporcionas
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Datos de registro:</strong> Nombre, apellidos,
                      email, teléfono, nombre de empresa, NIF/CIF
                    </li>
                    <li>
                      <strong>Información financiera:</strong> Documentos
                      contables, facturas, extractos bancarios, estados
                      financieros que nos proporcionas para nuestros servicios
                    </li>
                    <li>
                      <strong>Información de comunicación:</strong> Contenido de
                      mensajes, consultas y comunicaciones que mantienes con
                      nuestro equipo
                    </li>
                    <li>
                      <strong>Información de pago:</strong> Datos necesarios para
                      procesar pagos (procesados de forma segura por proveedores
                      certificados)
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    2. Información recopilada automáticamente
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Datos de uso:</strong> Páginas visitadas, funciones
                      utilizadas, tiempo de uso, clics y navegación
                    </li>
                    <li>
                      <strong>Información técnica:</strong> Dirección IP, tipo de
                      navegador, dispositivo, sistema operativo, idioma
                    </li>
                    <li>
                      <strong>Cookies y tecnologías similares:</strong> Para más
                      información, consulta nuestra{" "}
                      <Link href={"/cookies"} className="text-primary hover:underline">
                        Política de Cookies
                      </Link>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Data Usage */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-primary" />
                  Cómo Utilizamos tu Información
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>Utilizamos la información recopilada para:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Prestar nuestros servicios:</strong> Análisis
                    financiero, consultoría, generación de informes y
                    recomendaciones personalizadas
                  </li>
                  <li>
                    <strong>Gestión de cuenta:</strong> Crear y administrar tu
                    cuenta, autenticar usuarios y proporcionar soporte técnico
                  </li>
                  <li>
                    <strong>Comunicación:</strong> Responder a tus consultas,
                    enviarte actualizaciones sobre el servicio y notificaciones
                    importantes
                  </li>
                  <li>
                    <strong>Mejora del servicio:</strong> Analizar el uso de la
                    plataforma para mejorar funcionalidades y experiencia de
                    usuario
                  </li>
                  <li>
                    <strong>Cumplimiento legal:</strong> Cumplir con obligaciones
                    legales y regulatorias aplicables
                  </li>
                  <li>
                    <strong>Seguridad:</strong> Proteger contra fraudes, accesos
                    no autorizados y otras actividades maliciosas
                  </li>
                  <li>
                    <strong>Marketing (con consentimiento):</strong> Enviarte
                    información sobre servicios, promociones y contenido relevante
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Data Sharing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Compartir tu Información
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  No vendemos tu información personal a terceros. Compartimos tu
                  información solo en las siguientes circunstancias:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Proveedores de servicios:</strong> Empresas que nos
                    ayudan a operar la plataforma (hosting, procesamiento de
                    pagos, análisis, soporte)
                  </li>
                  <li>
                    <strong>Requisitos legales:</strong> Cuando sea necesario por
                    ley, orden judicial o procedimiento legal
                  </li>
                  <li>
                    <strong>Protección de derechos:</strong> Para proteger
                    nuestros derechos, propiedad o seguridad, o los de nuestros
                    usuarios
                  </li>
                  <li>
                    <strong>Transacciones empresariales:</strong> En caso de
                    fusión, adquisición o venta de activos
                  </li>
                  <li>
                    <strong>Con tu consentimiento:</strong> Cuando nos des
                    permiso explícito para compartir tu información
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  Seguridad de la Información
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Implementamos medidas de seguridad técnicas, administrativas y
                  físicas apropiadas para proteger tu información personal contra
                  acceso no autorizado, alteración, divulgación o destrucción:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Cifrado SSL/TLS para transmisión de datos</li>
                  <li>Cifrado de datos sensibles en reposo</li>
                  <li>Controles de acceso estrictos y autenticación multifactor</li>
                  <li>Auditorías de seguridad regulares</li>
                  <li>Copias de seguridad frecuentes y planes de recuperación</li>
                  <li>Formación continua del personal en seguridad de datos</li>
                </ul>
                <p>
                  Sin embargo, ningún sistema es completamente seguro. Te
                  recomendamos que también tomes medidas para proteger tu cuenta,
                  como usar contraseñas seguras y no compartirlas.
                </p>
              </CardContent>
            </Card>

            {/* User Rights */}
            <Card>
              <CardHeader>
                <CardTitle>Tus Derechos (RGPD)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Bajo el Reglamento General de Protección de Datos (RGPD)
                  europeo, tienes los siguientes derechos:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Derecho de acceso:</strong> Solicitar una copia de tu
                    información personal
                  </li>
                  <li>
                    <strong>Derecho de rectificación:</strong> Corregir
                    información inexacta o incompleta
                  </li>
                  <li>
                    <strong>Derecho de supresión:</strong> Solicitar la
                    eliminación de tu información (derecho al olvido)
                  </li>
                  <li>
                    <strong>Derecho de limitación:</strong> Restringir el
                    procesamiento de tu información
                  </li>
                  <li>
                    <strong>Derecho de portabilidad:</strong> Recibir tu
                    información en formato estructurado y transferible
                  </li>
                  <li>
                    <strong>Derecho de oposición:</strong> Oponerte al
                    procesamiento de tu información para ciertos fines
                  </li>
                  <li>
                    <strong>Derecho a retirar consentimiento:</strong> En
                    cualquier momento, sin afectar la legalidad del procesamiento
                    previo
                  </li>
                </ul>
                <p>
                  Para ejercer cualquiera de estos derechos, contáctanos en{" "}
                  <a
                    href="mailto:privacidad@consultoriafinanciera.es"
                    className="text-primary hover:underline"
                  >
                    privacidad@consultoriafinanciera.es
                  </a>
                </p>
              </CardContent>
            </Card>

            {/* Retention */}
            <Card>
              <CardHeader>
                <CardTitle>Retención de Datos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Conservamos tu información personal solo durante el tiempo
                  necesario para los fines establecidos en esta política, a menos
                  que la ley requiera o permita un período de retención más largo.
                </p>
                <p>Los criterios para determinar los períodos de retención incluyen:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    El tiempo que mantengas una cuenta activa con nosotros
                  </li>
                  <li>
                    Obligaciones legales, fiscales o regulatorias (generalmente
                    6-7 años para documentos contables en España)
                  </li>
                  <li>Necesidades de resolución de disputas o litigios</li>
                  <li>Directrices emitidas por autoridades de protección de datos</li>
                </ul>
              </CardContent>
            </Card>

            {/* International Transfers */}
            <Card>
              <CardHeader>
                <CardTitle>Transferencias Internacionales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Tu información puede ser transferida y procesada en países
                  fuera del Espacio Económico Europeo (EEE). En tales casos,
                  garantizamos un nivel adecuado de protección mediante:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Cláusulas contractuales estándar aprobadas por la UE</li>
                  <li>Certificaciones de Privacy Shield (cuando corresponda)</li>
                  <li>Otros mecanismos legales aprobados por autoridades competentes</li>
                </ul>
              </CardContent>
            </Card>

            {/* Children */}
            <Card>
              <CardHeader>
                <CardTitle>Menores de Edad</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Nuestros servicios no están dirigidos a menores de 18 años. No
                  recopilamos intencionalmente información personal de menores.
                  Si descubrimos que hemos recopilado información de un menor,
                  tomaremos medidas para eliminarla lo antes posible.
                </p>
              </CardContent>
            </Card>

            {/* Changes */}
            <Card>
              <CardHeader>
                <CardTitle>Cambios a esta Política</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Podemos actualizar esta Política de Privacidad periódicamente.
                  Te notificaremos sobre cambios significativos publicando la
                  nueva política en esta página y actualizando la fecha de "Última
                  actualización". Te recomendamos revisar esta política
                  regularmente.
                </p>
                <p>
                  El uso continuado de nuestros servicios después de cambios
                  constituye tu aceptación de la política modificada.
                </p>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle>Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Si tienes preguntas, inquietudes o solicitudes relacionadas con
                  esta Política de Privacidad o el tratamiento de tus datos
                  personales, puedes contactarnos:
                </p>
                <div className="space-y-2">
                  <p>
                    <strong className="text-foreground">
                      Responsable de Protección de Datos:
                    </strong>
                    <br />
                    Consultoría Financiera S.L.
                  </p>
                  <p>
                    <strong className="text-foreground">Email:</strong>{" "}
                    <a
                      href="mailto:privacidad@consultoriafinanciera.es"
                      className="text-primary hover:underline"
                    >
                      privacidad@consultoriafinanciera.es
                    </a>
                  </p>
                  <p>
                    <strong className="text-foreground">Dirección:</strong>
                    <br />
                    Calle Serrano, 123
                    <br />
                    28006 Madrid, España
                  </p>
                  <p>
                    <strong className="text-foreground">Teléfono:</strong> +34 900
                    123 456
                  </p>
                </div>
                <p className="pt-4 border-t">
                  También tienes derecho a presentar una reclamación ante la
                  Agencia Española de Protección de Datos (AEPD) si consideras
                  que el tratamiento de tus datos personales vulnera la
                  normativa.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

