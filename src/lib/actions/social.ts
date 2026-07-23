"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/rbac";
import { socialLinkSchema } from "@/lib/validation/social";

export type SocialLinkActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

function parseFormData(formData: FormData) {
  return {
    platform: formData.get("platform"),
    url: formData.get("url"),
    order: formData.get("order"),
    isActive: formData.get("isActive"),
  };
}

export async function createSocialLink(
  _prevState: SocialLinkActionState,
  formData: FormData
): Promise<SocialLinkActionState> {
  await requireAdmin();

  const parsed = socialLinkSchema.safeParse(parseFormData(formData));
  if (!parsed.success) {
    return { success: false, message: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await db.socialLink.create({ data: parsed.data });

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
  return { success: true, message: "Social link added." };
}

export async function updateSocialLink(
  id: string,
  _prevState: SocialLinkActionState,
  formData: FormData
): Promise<SocialLinkActionState> {
  await requireAdmin();

  const parsed = socialLinkSchema.safeParse(parseFormData(formData));
  if (!parsed.success) {
    return { success: false, message: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await db.socialLink.update({ where: { id }, data: parsed.data });

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
  return { success: true, message: "Social link updated." };
}

export async function deleteSocialLink(id: string): Promise<{ success: boolean; message: string }> {
  await requireAdmin();

  await db.socialLink.delete({ where: { id } });

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
  return { success: true, message: "Social link deleted." };
}
