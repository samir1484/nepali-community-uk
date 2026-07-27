import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { SITE_URL } from "@/lib/seo";
import { typeToPath } from "@/lib/validation/listings";

export const revalidate = 3600;

const STATIC_ROUTES = [
  { path: "/", priority: 1.0, changeFrequency: "daily" as const },
  { path: "/jobs", priority: 0.9, changeFrequency: "daily" as const },
  { path: "/rooms", priority: 0.9, changeFrequency: "daily" as const },
  { path: "/events", priority: 0.9, changeFrequency: "daily" as const },
  { path: "/businesses", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/volunteer", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/news", priority: 0.9, changeFrequency: "daily" as const },
  { path: "/advertise", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/founder", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/register", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/login", priority: 0.3, changeFrequency: "yearly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  let listingEntries: MetadataRoute.Sitemap = [];
  try {
    const listings = await db.listing.findMany({
      where: { status: "APPROVED" },
      select: { id: true, type: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 5000,
    });
    listingEntries = listings.map((listing) => ({
      url: `${SITE_URL}/${typeToPath(listing.type)}/${listing.id}`,
      lastModified: listing.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // A DB hiccup shouldn't return a 500 for the whole sitemap — still serve
    // the static routes so crawlers get something useful.
  }

  let articleEntries: MetadataRoute.Sitemap = [];
  try {
    const articles = await db.article.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
      orderBy: { publishedAt: "desc" },
      take: 1000,
    });
    articleEntries = articles.map((article) => ({
      url: `${SITE_URL}/news/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
  } catch {
    // Same reasoning as above — degrade to the routes we can still list.
  }

  return [...staticEntries, ...listingEntries, ...articleEntries];
}
