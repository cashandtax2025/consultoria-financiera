/** @jsxImportSource react */
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";

interface BaseLayoutProps {
  previewText: string;
  children: ReactNode;
}

const APP_NAME = "Consultoría Financiera";
const FOOTER_TEXT = `© ${new Date().getFullYear()} ${APP_NAME}. Todos los derechos reservados.`;

export const BaseLayout = ({ previewText, children }: BaseLayoutProps) => {
  return (
    <Html lang="es">
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-zinc-50 px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[520px] rounded-xl border border-zinc-200 border-solid bg-white p-[40px] shadow-lg">
            <Text className="mb-8 text-center font-bold text-2xl text-zinc-900 tracking-tight">
              {APP_NAME}
            </Text>
            {children}
            <Hr className="mx-0 my-[32px] w-full border border-zinc-100 border-solid" />
            <Text className="text-center text-[12px] text-zinc-400 leading-[20px]">
              {FOOTER_TEXT}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
