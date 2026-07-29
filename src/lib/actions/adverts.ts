"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/rbac";
import { deleteImage } from "@/lib/storage";
import { advertSchema } from "@/lib/validation/adverts";

export type AdvertActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

function parseFormData(formData: FormData) {
  return {
    placements: formData.getAll("placements"),
    title: formData.get("title"),
    body: formData.get("body"),
    imageUrl: formData.get("imageUrl"),
    linkUrl: formData.get("linkUrl"),
    order: formData.get("order"),
    isActive: formData.get("isActive") === "on",
  };
}

/** Adverts show on public pages, so every page that can host one must refresh. */
function revalidateAdverts() {
  for (const path of ["/", "/jobs", "/rooms", "/events", "/businesses", "/news", "/admin/adverts"]) {
    revalidatePath(path);
  }
}

export async function createAdvert(
  _prevState: AdvertActionState,
  formData: FormData
): Promise<AdvertActionState> {
  await requireAdmin();

  const parsed = advertSchema.safeParse(parseFormData(formData));
  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  await db.advert.create({
    data: {
      placements: parsed.data.placements,
      title: parsed.data.title,
      body: parsed.data.body || null,
      imageUrl: parsed.data.imageUrl || null,
      linkUrl: parsed.data.linkUrl || null,
      order: parsed.data.order,
      isActive: parsed.data.isActive,
    },
  });

  revalidateAdverts();
  return { success: true, message: "Advert created." };
}

export async function updateAdvert(
  id: string,
  _prevState: AdvertActionState,
  formData: FormData
): Promise<AdvertActionState> {
  await requireAdmin();

  const parsed = advertSchema.safeParse(parseFormData(formData));
  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  await db.advert.update({
    where: { id },
    data: {
      placements: parsed.data.placements,
      title: parsed.data.title,
      body: parsed.data.body || null,
      imageUrl: parsed.data.imageUrl || null,
      linkUrl: parsed.data.linkUrl || null,
      order: parsed.data.order,
      isActive: parsed.data.isActive,
    },
  });

  revalidateAdverts();
  return { success: true, message: "Advert updated." };
}

export async function deleteAdvert(id: string): Promise<{ success: boolean; message: string }> {
  await requireAdmin();

  const advert = await db.advert.findUnique({ where: { id } });
  if (!advert) return { success: false, message: "Advert not found." };

  await db.advert.delete({ where: { id } });
  if (advert.imageUrl) await deleteImage(advert.imageUrl);

  revalidateAdverts();
  return { success: true, message: "Advert deleted." };
}
