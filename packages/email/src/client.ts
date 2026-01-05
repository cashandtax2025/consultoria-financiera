import { render } from "@react-email/components";
import type { ReactElement } from "react";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const emailSender = process.env.EMAIL_FROM || "noreply@example.com";

export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string | string[];
  subject: string;
  react: ReactElement;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log(
      "[Email] Skipping email send (RESEND_API_KEY not configured):",
      {
        to,
        subject,
      },
    );
    return;
  }

  const html = await render(react);
  const text = await render(react, { plainText: true });

  const toAddresses = Array.isArray(to) ? to : [to];

  try {
    await resend.emails.send({
      from: emailSender,
      to: toAddresses,
      subject,
      html,
      text,
    });
  } catch (error) {
    console.error("[Email] Failed to send email:", {
      to,
      subject,
      error: error instanceof Error ? error.message : error,
    });
  }
}
