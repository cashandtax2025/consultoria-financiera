/** @jsxImportSource react */
import { Button, Heading, Link, Section, Text } from "@react-email/components";
import { BaseLayout } from "./base-layout";

interface EmailVerificationProps {
  userName?: string;
  verificationUrl?: string;
}

export const EmailVerificationEmail = ({
  userName = "Usuario",
  verificationUrl = "",
}: EmailVerificationProps) => {
  return (
    <BaseLayout previewText="Verifica tu dirección de correo electrónico">
      <Heading className="mx-0 mt-0 mb-6 p-0 text-center font-semibold text-[22px] text-zinc-800">
        ¡Bienvenido/a!
      </Heading>

      <Text className="text-[15px] text-zinc-600 leading-[26px]">
        Hola <span className="font-semibold text-zinc-800">{userName}</span>,
      </Text>

      <Text className="text-[15px] text-zinc-600 leading-[26px]">
        Gracias por registrarte. Para completar tu registro y acceder a todas
        las funcionalidades, por favor verifica tu dirección de correo
        electrónico.
      </Text>

      <Section className="mt-8 mb-8 text-center">
        <Button
          className="rounded-lg bg-zinc-900 px-8 py-4 text-center font-semibold text-[15px] text-white no-underline shadow-md"
          href={verificationUrl}
        >
          Verificar correo electrónico
        </Button>
      </Section>

      <Text className="text-[14px] text-zinc-500 leading-[24px]">
        Este enlace de verificación expira en <strong>24 horas</strong> por
        motivos de seguridad.
      </Text>

      <Text className="mt-4 text-[13px] text-zinc-400 leading-[22px]">
        ¿No puedes ver el botón? Copia y pega este enlace en tu navegador:{" "}
        <Link
          className="break-all text-zinc-600 underline"
          href={verificationUrl}
        >
          {verificationUrl}
        </Link>
      </Text>

      <Text className="mt-6 rounded-lg bg-zinc-50 p-4 text-[13px] text-zinc-500 leading-[20px]">
        Si no te has registrado en nuestra plataforma, puedes ignorar este
        mensaje.
      </Text>
    </BaseLayout>
  );
};

export function reactEmailVerificationEmail(props: EmailVerificationProps) {
  return <EmailVerificationEmail {...props} />;
}
