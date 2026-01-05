/** @jsxImportSource react */
import { Button, Heading, Link, Section, Text } from "@react-email/components";
import { BaseLayout } from "./base-layout";

interface OrganizationInvitationProps {
  inviterName?: string;
  organizationName?: string;
  inviteLink?: string;
  role?: string;
}

const getRoleLabel = (role: string): string => {
  const roles: Record<string, string> = {
    owner: "Propietario",
    admin: "Administrador",
    member: "Miembro",
  };
  return roles[role] || "Miembro";
};

export const OrganizationInvitationEmail = ({
  inviterName = "Alguien",
  organizationName = "una organización",
  inviteLink = "",
  role = "member",
}: OrganizationInvitationProps) => {
  const roleLabel = getRoleLabel(role);

  return (
    <BaseLayout
      previewText={`Has sido invitado/a a unirte a ${organizationName}`}
    >
      <Heading className="mx-0 mt-0 mb-6 p-0 text-center font-semibold text-[22px] text-zinc-800">
        ¡Tienes una invitación!
      </Heading>

      <Text className="text-[15px] text-zinc-600 leading-[26px]">
        <span className="font-semibold text-zinc-800">{inviterName}</span> te ha
        invitado a unirte a{" "}
        <span className="font-semibold text-zinc-800">{organizationName}</span>{" "}
        como <span className="font-semibold text-zinc-800">{roleLabel}</span>.
      </Text>

      <Text className="text-[15px] text-zinc-600 leading-[26px]">
        Haz clic en el botón de abajo para aceptar la invitación y unirte al
        equipo.
      </Text>

      <Section className="mt-8 mb-8 text-center">
        <Button
          className="rounded-lg bg-zinc-900 px-8 py-4 text-center font-semibold text-[15px] text-white no-underline shadow-md"
          href={inviteLink}
        >
          Aceptar invitación
        </Button>
      </Section>

      <Text className="text-[14px] text-zinc-500 leading-[24px]">
        Esta invitación expira en <strong>48 horas</strong> por motivos de
        seguridad.
      </Text>

      <Text className="mt-4 text-[13px] text-zinc-400 leading-[22px]">
        ¿No puedes ver el botón? Copia y pega este enlace en tu navegador:{" "}
        <Link className="break-all text-zinc-600 underline" href={inviteLink}>
          {inviteLink}
        </Link>
      </Text>

      <Text className="mt-6 rounded-lg bg-zinc-50 p-4 text-[13px] text-zinc-500 leading-[20px]">
        Si no esperabas esta invitación, puedes ignorar este mensaje.
      </Text>
    </BaseLayout>
  );
};

export function reactOrganizationInvitationEmail(
  props: OrganizationInvitationProps,
) {
  return <OrganizationInvitationEmail {...props} />;
}
