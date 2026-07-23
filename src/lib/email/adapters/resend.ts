import { Resend } from "resend";
import type { SendEmailInput } from "../mailer";

let client: Resend | null = null;

function getClient() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not set but EMAIL_PROVIDER=resend");
  }
  if (!client) {
    client = new Resend(process.env.RESEND_API_KEY);
  }
  return client;
}

export async function sendViaResend(input: SendEmailInput) {
  await getClient().emails.send({
    from: process.env.SMTP_FROM ?? "Nepali Community UK <no-reply@nepalicommunity.uk>",
    to: input.to,
    subject: input.subject,
    html: input.html,
    replyTo: input.replyTo,
  });
}
