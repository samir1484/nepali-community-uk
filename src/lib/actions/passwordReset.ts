"use server";

import { randomBytes, createHash } from "node:crypto";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email/mailer";
import { passwordResetTemplate } from "@/lib/email/templates/passwordReset";
import { checkRateLimit } from "@/lib/rateLimit";
import { SITE_URL } from "@/lib/seo";

const TOKEN_TTL_MINUTES = 60;

/** Only the hash is stored, so the raw token exists solely in the emailed link. */
function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export type RequestResetState = { success: boolean; message: string };

const emailSchema = z.string().trim().toLowerCase().email("Enter a valid email address");

export async function requestPasswordReset(
  _prevState: RequestResetState,
  formData: FormData
): Promise<RequestResetState> {
  const parsed = emailSchema.safeParse(formData.get("email"));

  // Always the same reply, whatever happens. Saying "no account found" would
  // turn this form into a way to check which emails are registered here.
  const genericSuccess: RequestResetState = {
    success: true,
    message:
      "If that email is registered, we've sent a reset link. Check your inbox, and your spam folder just in case.",
  };

  if (!parsed.success) {
    return { success: false, message: "Enter a valid email address." };
  }

  const email = parsed.data;

  // Keyed on the email so one address can't be used to spam someone's inbox.
  const { allowed } = await checkRateLimit(`pwreset:${email}`, 900, 3);
  if (!allowed) return genericSuccess;

  const user = await db.user.findUnique({ where: { email } });
  if (!user || user.isBlocked) return genericSuccess;

  const token = randomBytes(32).toString("hex");

  // Any earlier unused links stop working the moment a new one is issued.
  await db.passwordResetToken.updateMany({
    where: { userId: user.id, usedAt: null },
    data: { usedAt: new Date() },
  });

  await db.passwordResetToken.create({
    data: {
      tokenHash: hashToken(token),
      userId: user.id,
      expiresAt: new Date(Date.now() + TOKEN_TTL_MINUTES * 60 * 1000),
    },
  });

  const { subject, html } = passwordResetTemplate({
    name: user.name,
    resetUrl: `${SITE_URL}/reset-password/${token}`,
  });

  try {
    await sendEmail({ to: user.email, subject, html });
  } catch (err) {
    // Don't leak delivery failures back to the form — that would also reveal
    // the account exists. Log it so a broken mailer is still visible.
    console.error("password reset email failed", err);
  }

  return genericSuccess;
}

export type ResetPasswordState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

const newPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

/** Shared by the page (to decide what to render) and the submit action. */
export async function isResetTokenValid(token: string): Promise<boolean> {
  if (!token) return false;
  const row = await db.passwordResetToken
    .findUnique({ where: { tokenHash: hashToken(token) } })
    .catch(() => null);
  return Boolean(row && !row.usedAt && row.expiresAt > new Date());
}

export async function resetPassword(
  token: string,
  _prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const parsed = newPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const row = await db.passwordResetToken.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });

  const expired = !row || row.usedAt !== null || row.expiresAt <= new Date();
  if (expired) {
    return {
      success: false,
      message: "This reset link has expired or has already been used. Please request a new one.",
    };
  }
  if (row.user.isBlocked) {
    return { success: false, message: "This account is not active. Please contact us." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  // Mark used and change the password together, so a crash between the two
  // can't leave a link that still works after the password changed.
  await db.$transaction([
    db.user.update({ where: { id: row.userId }, data: { passwordHash } }),
    db.passwordResetToken.update({ where: { id: row.id }, data: { usedAt: new Date() } }),
  ]);

  return { success: true, message: "Password updated. You can now log in." };
}
