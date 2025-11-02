import { FileText, AlertCircle, CheckCircle, XCircle, Scale } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TerminosServicioPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative px-4 py-20 md:py-28 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Scale className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Términos de Servicio
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
                  <FileText className="h-5 w-5 text-primary" />
                  Aceptación de los Términos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Bienvenido a <strong>Consultoría Financiera</strong>. Estos
                  Términos de Servicio ("Términos") constituyen un acuerdo legal
                  entre tú (el "Usuario" o "Cliente") y Consultoría Financiera
                  S.L. (la "Empresa", "nosotros" o "nuestro"), con domicilio en
                  Calle Serrano, 123, 28006 Madrid, España.
                </p>
                <p>
                  Al acceder o utilizar nuestra plataforma, sitio web, servicios
                  de consultoría financiera o cualquier otro servicio relacionado
                  (colectivamente, los "Servicios"), aceptas estar sujeto a estos
                  Términos. Si no estás de acuerdo con estos Términos, no debes
                  utilizar nuestros Servicios.
                </p>
                <p>
                  Estos Términos se aplican a todos los usuarios de los
                  Servicios, incluidos visitantes, clientes registrados y
                  clientes de pago.
                </p>
              </CardContent>
            </Card>

            {/* Services Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Descripción de los Servicios
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Consultoría Financiera ofrece una plataforma de servicios de
                  consultoría financiera y herramientas tecnológicas para pymes y
                  autónomos, incluyendo:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Análisis financiero y evaluación de estados contables</li>
                  <li>Extracción y procesamiento automatizado de documentos financieros</li>
                  <li>Generación de informes y reportes personalizados</li>
                  <li>Asesoramiento financiero mediante inteligencia artificial</li>
                  <li>Consultoría financiera personalizada</li>
                  <li>Herramientas de visualización de datos y dashboards</li>
                  <li>Gestión de riesgos y análisis predictivo</li>
                </ul>
                <p>
                  Nos reservamos el derecho de modificar, suspender o
                  descontinuar cualquier aspecto de los Servicios en cualquier
                  momento, con o sin previo aviso.
                </p>
              </CardContent>
            </Card>

            {/* Registration */}
            <Card>
              <CardHeader>
                <CardTitle>Registro y Cuenta de Usuario</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Requisitos de registro
                  </h3>
                  <p>
                    Para acceder a ciertos Servicios, debes crear una cuenta
                    proporcionando información precisa, actualizada y completa.
                    Debes tener al menos 18 años y capacidad legal para celebrar
                    contratos.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Responsabilidad de la cuenta
                  </h3>
                  <p>
                    Eres responsable de mantener la confidencialidad de tus
                    credenciales de acceso y de todas las actividades que ocurran
                    bajo tu cuenta. Debes notificarnos inmediatamente sobre
                    cualquier uso no autorizado de tu cuenta.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Veracidad de la información
                  </h3>
                  <p>
                    Te comprometes a proporcionar información verídica y
                    actualizada. La inexactitud de la información proporcionada
                    puede afectar la calidad de nuestros servicios y análisis.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Use of Services */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  Uso Aceptable de los Servicios
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>Al utilizar nuestros Servicios, te comprometes a:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Cumplir con todas las leyes y regulaciones aplicables</li>
                  <li>Utilizar los Servicios solo para fines legítimos y comerciales</li>
                  <li>No intentar acceder sin autorización a sistemas o datos</li>
                  <li>No interferir con el funcionamiento de los Servicios</li>
                  <li>No transmitir contenido malicioso o dañino</li>
                  <li>No suplantar identidades ni falsificar información</li>
                  <li>No realizar actividades fraudulentas o engañosas</li>
                  <li>Respetar los derechos de propiedad intelectual</li>
                </ul>
              </CardContent>
            </Card>

            {/* Prohibited Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-primary" />
                  Actividades Prohibidas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>Está expresamente prohibido:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Realizar ingeniería inversa, descompilar o desensamblar la plataforma</li>
                  <li>Utilizar bots, scrapers o herramientas automatizadas no autorizadas</li>
                  <li>Revender o redistribuir los Servicios sin autorización</li>
                  <li>Compartir credenciales de acceso con terceros</li>
                  <li>Utilizar los Servicios para actividades ilegales o no éticas</li>
                  <li>Intentar obtener acceso no autorizado a sistemas o datos</li>
                  <li>Cargar contenido malicioso, virus o código dañino</li>
                  <li>Realizar pruebas de penetración sin autorización previa</li>
                </ul>
                <p>
                  Nos reservamos el derecho de suspender o cancelar tu cuenta si
                  detectamos violación de estos términos.
                </p>
              </CardContent>
            </Card>

            {/* Fees and Payment */}
            <Card>
              <CardHeader>
                <CardTitle>Tarifas y Pagos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Suscripciones y planes
                  </h3>
                  <p>
                    Algunos Servicios están sujetos a tarifas de suscripción.
                    Los detalles de precios, planes y modalidades de pago están
                    disponibles en nuestra plataforma.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Facturación y pagos
                  </h3>
                  <p>
                    Las suscripciones se facturan por adelantado de forma
                    mensual o anual, según el plan elegido. Los pagos se
                    procesarán automáticamente al inicio de cada período de
                    facturación.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Cambios de precios
                  </h3>
                  <p>
                    Nos reservamos el derecho de modificar nuestras tarifas con
                    previo aviso de 30 días. Los cambios no afectarán al período
                    de facturación actual.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Reembolsos
                  </h3>
                  <p>
                    Ofrecemos una garantía de satisfacción de 14 días para nuevos
                    clientes. Los reembolsos de servicios de consultoría
                    personalizados se evaluarán caso por caso.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Intellectual Property */}
            <Card>
              <CardHeader>
                <CardTitle>Propiedad Intelectual</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Derechos de la Empresa
                  </h3>
                  <p>
                    Todos los derechos, títulos e intereses en los Servicios,
                    incluyendo software, diseño, contenido, marcas comerciales y
                    tecnología, son propiedad exclusiva de Consultoría Financiera
                    o sus licenciantes. Estos Términos no te otorgan ningún
                    derecho de propiedad sobre los Servicios.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Licencia de uso
                  </h3>
                  <p>
                    Te otorgamos una licencia limitada, no exclusiva, no
                    transferible y revocable para utilizar los Servicios de
                    acuerdo con estos Términos durante la vigencia de tu
                    suscripción.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Tu contenido
                  </h3>
                  <p>
                    Conservas todos los derechos sobre los datos y documentos que
                    subas a la plataforma. Nos otorgas una licencia para
                    procesar, almacenar y analizar este contenido con el fin de
                    prestarte los Servicios.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Data and Privacy */}
            <Card>
              <CardHeader>
                <CardTitle>Datos y Privacidad</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  El tratamiento de tus datos personales se rige por nuestra{" "}
                  <Link href={"/privacidad"} className="text-primary hover:underline">
                    Política de Privacidad
                  </Link>
                  , que forma parte integral de estos Términos.
                </p>
                <p>
                  Implementamos medidas de seguridad de nivel bancario para
                  proteger tu información, incluyendo cifrado, controles de
                  acceso y auditorías regulares.
                </p>
                <p>
                  No compartimos tu información financiera con terceros sin tu
                  consentimiento, excepto según se establece en nuestra Política
                  de Privacidad.
                </p>
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <Card>
              <CardHeader>
                <CardTitle>Limitación de Responsabilidad y Garantías</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Naturaleza de los Servicios
                  </h3>
                  <p>
                    Nuestros Servicios proporcionan herramientas de análisis y
                    asesoramiento financiero. Los informes y recomendaciones no
                    constituyen asesoramiento legal, fiscal o de inversión
                    definitivo. Debes consultar con profesionales especializados
                    antes de tomar decisiones importantes.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Sin garantías
                  </h3>
                  <p>
                    Los Servicios se proporcionan "tal cual" y "según
                    disponibilidad". No garantizamos que los Servicios sean
                    ininterrumpidos, libres de errores o completamente seguros.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Limitación de responsabilidad
                  </h3>
                  <p>
                    En la medida permitida por la ley, no seremos responsables de
                    daños indirectos, incidentales, especiales, consecuentes o
                    punitivos, incluyendo pérdida de beneficios, datos o uso.
                    Nuestra responsabilidad total no excederá el monto pagado por
                    ti en los 12 meses anteriores.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Termination */}
            <Card>
              <CardHeader>
                <CardTitle>Terminación</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Por el Usuario
                  </h3>
                  <p>
                    Puedes cancelar tu suscripción en cualquier momento desde la
                    configuración de tu cuenta. La cancelación será efectiva al
                    final del período de facturación actual.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Por la Empresa
                  </h3>
                  <p>
                    Podemos suspender o cancelar tu acceso a los Servicios si
                    violas estos Términos, realizas actividades fraudulentas o
                    incumples con las obligaciones de pago.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Efectos de la terminación
                  </h3>
                  <p>
                    Tras la terminación, perderás acceso a los Servicios. Podemos
                    conservar copias de tus datos según nuestras obligaciones
                    legales y de retención.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Disputes */}
            <Card>
              <CardHeader>
                <CardTitle>Resolución de Disputas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Ley aplicable
                  </h3>
                  <p>
                    Estos Términos se rigen por las leyes de España, sin
                    referencia a sus principios de conflicto de leyes.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Jurisdicción
                  </h3>
                  <p>
                    Las partes se someten a la jurisdicción exclusiva de los
                    tribunales de Madrid, España, para cualquier disputa derivada
                    de estos Términos.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Resolución amistosa
                  </h3>
                  <p>
                    Antes de iniciar acciones legales, las partes acuerdan
                    intentar resolver las disputas de buena fe mediante
                    negociación directa.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Modifications */}
            <Card>
              <CardHeader>
                <CardTitle>Modificaciones a los Términos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Nos reservamos el derecho de modificar estos Términos en
                  cualquier momento. Las modificaciones significativas serán
                  notificadas por email o mediante aviso en la plataforma con al
                  menos 30 días de anticipación.
                </p>
                <p>
                  El uso continuado de los Servicios después de la entrada en
                  vigor de los cambios constituye tu aceptación de los Términos
                  modificados.
                </p>
              </CardContent>
            </Card>

            {/* General */}
            <Card>
              <CardHeader>
                <CardTitle>Disposiciones Generales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Acuerdo completo:</strong> Estos Términos constituyen
                    el acuerdo completo entre las partes.
                  </li>
                  <li>
                    <strong>Divisibilidad:</strong> Si alguna disposición es
                    inválida, las demás permanecerán en vigor.
                  </li>
                  <li>
                    <strong>No renuncia:</strong> La falta de ejercicio de un
                    derecho no constituye renuncia al mismo.
                  </li>
                  <li>
                    <strong>Asignación:</strong> No puedes transferir tus
                    derechos bajo estos Términos sin nuestro consentimiento.
                  </li>
                  <li>
                    <strong>Fuerza mayor:</strong> No seremos responsables por
                    incumplimientos causados por eventos fuera de nuestro control.
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle>Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Si tienes preguntas sobre estos Términos de Servicio, puedes
                  contactarnos:
                </p>
                <div className="space-y-2">
                  <p>
                    <strong className="text-foreground">
                      Consultoría Financiera S.L.
                    </strong>
                  </p>
                  <p>
                    <strong className="text-foreground">Email:</strong>{" "}
                    <a
                      href="mailto:legal@consultoriafinanciera.es"
                      className="text-primary hover:underline"
                    >
                      legal@consultoriafinanciera.es
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
                    <strong className="text-foreground">Teléfono:</strong> +34
                    900 123 456
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

