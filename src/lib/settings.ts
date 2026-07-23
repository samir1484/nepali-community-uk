import "server-only";
import { db } from "@/lib/db";
import { typeBackgroundImage, type ListingTypeValue } from "@/lib/validation/listings";
import { IMAGE_SETTINGS, type ImageSettingKey } from "@/lib/siteImageSettings";

export async function getSiteImage(key: ImageSettingKey, fallback: string): Promise<string> {
  const setting = await db.siteSetting.findUnique({ where: { key } });
  if (!setting) return fallback;
  const value = setting.value as { url?: string };
  return value.url || fallback;
}

export async function getListingBackground(type: ListingTypeValue): Promise<string> {
  return getSiteImage(`listing.${type}.image` as ImageSettingKey, typeBackgroundImage(type));
}

export async function getAllSiteImages(): Promise<Record<string, string>> {
  const rows = await db.siteSetting.findMany({
    where: { key: { in: IMAGE_SETTINGS.map((s) => s.key) } },
  });
  const map: Record<string, string> = {};
  for (const row of rows) {
    const value = row.value as { url?: string };
    if (value.url) map[row.key] = value.url;
  }
  return map;
}
