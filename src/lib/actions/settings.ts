"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/rbac";
import { IMAGE_SETTINGS, type ImageSettingKey } from "@/lib/siteImageSettings";

const VALID_KEYS = new Set(IMAGE_SETTINGS.map((s) => s.key));

export async function setSiteImage(
  key: ImageSettingKey,
  url: string
): Promise<{ success: boolean; message: string }> {
  await requireAdmin();

  if (!VALID_KEYS.has(key)) {
    return { success: false, message: "Unknown setting key." };
  }

  if (url) {
    await db.siteSetting.upsert({
      where: { key },
      create: { key, value: { url } },
      update: { value: { url } },
    });
  } else {
    await db.siteSetting.deleteMany({ where: { key } });
  }

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
  return { success: true, message: "Saved." };
}
