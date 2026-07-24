"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { changePasswordSchema, updateProfileSchema } from "@/lib/validation/account";

export type ChangePasswordActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export type UpdateProfileActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export async function updateProfile(
  _prevState: UpdateProfileActionState,
  formData: FormData
): Promise<UpdateProfileActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "You must be logged in." };
  }

  const parsed = updateProfileSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    location: formData.get("location"),
    interests: formData.getAll("interests"),
  });
  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const existing = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (existing && existing.id !== session.user.id) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: { email: ["That email address is already in use."] },
    };
  }

  await db.user.update({
    where: { id: session.user.id },
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      location: parsed.data.location,
      interests: parsed.data.interests,
    },
  });

  revalidatePath("/account");
  return { success: true, message: "Profile updated." };
}

export async function changePassword(
  _prevState: ChangePasswordActionState,
  formData: FormData
): Promise<ChangePasswordActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "You must be logged in." };
  }

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user?.passwordHash) {
    return { success: false, message: "This account has no password to change." };
  }

  const valid = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
  if (!valid) {
    return {
      success: false,
      message: "Current password is incorrect.",
      fieldErrors: { currentPassword: ["Current password is incorrect."] },
    };
  }

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 10);
  await db.user.update({
    where: { id: session.user.id },
    data: { passwordHash },
  });

  return { success: true, message: "Password updated." };
}

export async function updateProfilePhoto(url: string): Promise<{ success: boolean }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false };
  }

  await db.user.update({
    where: { id: session.user.id },
    data: { image: url || null },
  });

  return { success: true };
}
