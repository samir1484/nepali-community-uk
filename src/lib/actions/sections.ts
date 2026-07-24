"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/rbac";
import { deleteImage } from "@/lib/storage";
import { sectionSchema } from "@/lib/validation/sections";

export type SectionActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

function parseFormData(formData: FormData) {
  return {
    type: formData.get("type"),
    title: formData.get("title"),
    caption: formData.get("caption"),
    imageUrl: formData.get("imageUrl"),
    linkUrl: formData.get("linkUrl"),
    order: formData.get("order"),
    isActive: formData.get("isActive"),
  };
}

export async function createSection(
  _prevState: SectionActionState,
  formData: FormData
): Promise<SectionActionState> {
  await requireAdmin();

  const parsed = sectionSchema.safeParse(parseFormData(formData));
  if (!parsed.success) {
    return { success: false, message: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await db.homeSection.create({
    data: {
      type: parsed.data.type,
      title: parsed.data.title,
      caption: parsed.data.caption || null,
      imageUrl: parsed.data.imageUrl || null,
      linkUrl: parsed.data.linkUrl || null,
      order: parsed.data.order,
      isActive: parsed.data.isActive,
    },
  });

  revalidatePath("/admin/sections");
  revalidatePath("/");
  return { success: true, message: "Section created." };
}

export async function updateSection(
  id: string,
  _prevState: SectionActionState,
  formData: FormData
): Promise<SectionActionState> {
  await requireAdmin();

  const parsed = sectionSchema.safeParse(parseFormData(formData));
  if (!parsed.success) {
    return { success: false, message: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await db.homeSection.update({
    where: { id },
    data: {
      type: parsed.data.type,
      title: parsed.data.title,
      caption: parsed.data.caption || null,
      imageUrl: parsed.data.imageUrl || null,
      linkUrl: parsed.data.linkUrl || null,
      order: parsed.data.order,
      isActive: parsed.data.isActive,
    },
  });

  revalidatePath("/admin/sections");
  revalidatePath("/");
  return { success: true, message: "Section updated." };
}

export async function deleteSection(id: string): Promise<{ success: boolean; message: string }> {
  await requireAdmin();

  const section = await db.homeSection.findUnique({ where: { id } });
  if (!section) {
    return { success: false, message: "Section not found." };
  }

  await db.homeSection.delete({ where: { id } });

  if (section.imageUrl) {
    await deleteImage(section.imageUrl);
  }

  revalidatePath("/admin/sections");
  revalidatePath("/");
  return { success: true, message: "Section deleted." };
}
