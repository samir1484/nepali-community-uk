import nodemailer from "nodemailer";
import type { SendEmailInput } from "../mailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? "localhost",
  port: Number(process.env.SMTP_PORT ?? 1025),
  secure: false,
});

export async function sendViaSmtp(input: SendEmailInput) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? "Nepali Community UK <no-reply@nepalicommunity.uk>",
    to: input.to,
    subject: input.subject,
    html: input.html,
  });
}
