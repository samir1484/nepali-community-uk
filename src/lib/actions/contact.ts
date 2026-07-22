"use server";

import { z } from "zod";
import { sendEmail } from "@/lib/email/mailer";
import { contactMessageTemplate } from "@/lib/email/templates/contact";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  message: z.string().trim().min(10, "Message must be at least 10 characters"),
});

export type ContactActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export async function sendContactMessage(
  _prevState: ContactActionState,
  formData: FormData
): Promise<ContactActionState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const receiver = process.env.CONTACT_RECEIVER_EMAIL ?? "sameerkhatiwada4@gmail.com";
  const { subject, html } = contactMessageTemplate(parsed.data);

  await sendEmail({ to: receiver, subject, html });

  return { success: true, message: "Thanks for reaching out — we'll get back to you soon." };
}
