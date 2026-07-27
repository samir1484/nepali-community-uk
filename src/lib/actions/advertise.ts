"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email/mailer";
import { externalUrlSchema } from "@/lib/validation/listings";

const advertiseSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  organisation: z.string().trim().min(2, "Business or organisation name is required"),
  websiteUrl: externalUrlSchema,
  budget: z.string().trim().optional().or(z.literal("")),
  message: z.string().trim().min(10, "Tell us a little about what you'd like to promote"),
});

export type AdvertiseActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendAdvertiseEnquiry(
  _prevState: AdvertiseActionState,
  formData: FormData
): Promise<AdvertiseActionState> {
  const parsed = advertiseSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    organisation: formData.get("organisation"),
    websiteUrl: formData.get("websiteUrl"),
    budget: formData.get("budget"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, email, organisation, websiteUrl, budget, message } = parsed.data;

  // Kept in the same ContactMessage table as the other enquiry types so it shows
  // up in the existing admin Messages CRM rather than needing its own screen.
  const messageBody = [
    `Organisation: ${organisation}`,
    websiteUrl ? `Website: ${websiteUrl}` : null,
    budget ? `Budget: ${budget}` : null,
    "",
    message,
  ]
    .filter((line) => line !== null)
    .join("\n");

  await db.contactMessage.create({
    data: { source: "ADVERTISING", name, email, messageBody },
  });

  const receiver = process.env.CONTACT_RECEIVER_EMAIL ?? "sameerkhatiwada4@gmail.com";
  const html = `
    <h2>New advertising enquiry</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Organisation:</strong> ${escapeHtml(organisation)}</p>
    ${websiteUrl ? `<p><strong>Website:</strong> ${escapeHtml(websiteUrl)}</p>` : ""}
    ${budget ? `<p><strong>Budget:</strong> ${escapeHtml(budget)}</p>` : ""}
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
  `;

  // Don't fail the enquiry if the mail provider hiccups — it's already saved.
  await sendEmail({
    to: receiver,
    subject: `Advertising enquiry from ${organisation}`,
    html,
    replyTo: email,
  }).catch(() => {});

  return {
    success: true,
    message: "Thanks! We've received your enquiry and will be in touch shortly.",
  };
}
