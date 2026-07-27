export const SITE_URL = "https://www.nepalicommunityuk.co.uk";
export const SITE_NAME = "Nepali Community UK";
export const DEFAULT_DESCRIPTION =
  "The UK's largest digital platform for the Nepali community — find Nepali jobs, rooms, events, and businesses, or connect with the diaspora across the United Kingdom.";
export const DEFAULT_OG_IMAGE = "/images/hero/hero-bg.jpg";

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}
