"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email/mailer";
import { listingInquiryTemplate } from "@/lib/email/templates/listingInquiry";

const contactPosterSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  message: z.string().trim().min(10, "Message must be at least 10 characters"),
});

export type ContactPosterActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export async function contactListingPoster(
  listingId: string,
  _prevState: ContactPosterActionState,
  formData: FormData
): Promise<ContactPosterActionState> {
  const parsed = contactPosterSchema.safeParse({
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

  const listing = await db.listing.findUnique({
    where: { id: listingId },
    include: { author: { select: { name: true, email: true } } },
  });

  if (!listing || listing.status !== "APPROVED") {
    return { success: false, message: "This listing is no longer available." };
  }

  const { subject, html } = listingInquiryTemplate({
    posterName: listing.author.name,
    listingTitle: listing.title,
    senderName: parsed.data.name,
    senderEmail: parsed.data.email,
    message: parsed.data.message,
  });

  await sendEmail({
    to: listing.author.email,
    subject,
    html,
    replyTo: parsed.data.email,
  });

  return { success: true, message: "Your message has been sent. They'll be in touch soon." };
}
