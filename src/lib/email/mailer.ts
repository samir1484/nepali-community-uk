export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail(input: SendEmailInput): Promise<void> {
  const provider = process.env.EMAIL_PROVIDER ?? "smtp";

  if (provider === "resend") {
    const { sendViaResend } = await import("./adapters/resend");
    return sendViaResend(input);
  }

  const { sendViaSmtp } = await import("./adapters/smtp");
  return sendViaSmtp(input);
}
