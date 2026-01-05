/** @jsxImportSource react */
import { Button, Heading, Link, Section, Text } from "@react-email/components";
import { BaseLayout } from "./base-layout";

interface ResetPasswordEmailProps {
  userName?: string;
  resetLink?: string;
}

export const ResetPasswordEmail = ({
  userName = "Usuario",
  resetLink = "",
}: ResetPasswordEmailProps) => {
  return (
    <BaseLayout previewText="Restablece tu contraseña">
      <Heading className="mx-0 mt-0 mb-6 p-0 text-center font-semibold text-[22px] text-zinc-800">
        Restablecer contraseña
      </Heading>

      <Text className="text-[15px] text-zinc-600 leading-[26px]">
        Hola <span className="font-semibold text-zinc-800">{userName}</span>,
      </Text>

      <Text className="text-[15px] text-zinc-600 leading-[26px]">
        Hemos recibido una solicitud para restablecer la contraseña de tu
        cuenta. Si no has sido tú, puedes ignorar este mensaje de forma segura.
      </Text>

      <Section className="mt-8 mb-8 text-center">
        <Button
          className="rounded-lg bg-zinc-900 px-8 py-4 text-center font-semibold text-[15px] text-white no-underline shadow-md"
          href={resetLink}
        >
          Restablecer contraseña
        </Button>
      </Section>

      <Text className="text-[14px] text-zinc-500 leading-[24px]">
        Este enlace expira en <strong>1 hora</strong> por motivos de seguridad.
      </Text>

      <Text className="mt-4 text-[13px] text-zinc-400 leading-[22px]">
        ¿No puedes ver el botón? Copia y pega este enlace en tu navegador:{" "}
        <Link className="break-all text-zinc-600 underline" href={resetLink}>
          {resetLink}
        </Link>
      </Text>

      <Text className="mt-6 rounded-lg bg-amber-50 p-4 text-[13px] text-amber-700 leading-[20px]">
        ⚠️ Si no has solicitado restablecer tu contraseña, te recomendamos
        revisar la seguridad de tu cuenta o contactar con soporte.
      </Text>
    </BaseLayout>
  );
};

export function reactResetPasswordEmail(props: ResetPasswordEmailProps) {
  return <ResetPasswordEmail {...props} />;
}
