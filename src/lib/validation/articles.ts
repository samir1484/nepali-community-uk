import { z } from "zod";
import { externalUrlSchema } from "@/lib/validation/listings";

export const ARTICLE_CATEGORIES = ["NEWS", "BLOG", "IMMIGRATION", "STUDENT"] as const;
export const ARTICLE_STATUSES = ["DRAFT", "PUBLISHED"] as const;

export type ArticleCategoryValue = (typeof ARTICLE_CATEGORIES)[number];

export const ARTICLE_CATEGORY_LABELS: Record<ArticleCategoryValue, string> = {
  NEWS: "News",
  BLOG: "Blog",
  IMMIGRATION: "Immigration guide",
  STUDENT: "Student support",
};

/**
 * The two sections articles can appear in. Each category belongs to exactly
 * one, so a given article is reachable from a single URL — otherwise /news and
 * /resources would both serve the same slug and compete in search results.
 */
export const NEWS_CATEGORIES = ["NEWS", "BLOG"] as const;
export const RESOURCE_CATEGORIES = ["IMMIGRATION", "STUDENT"] as const;

export function isResourceCategory(category: string): boolean {
  return (RESOURCE_CATEGORIES as readonly string[]).includes(category);
}

export const articleSchema = z.object({
  title: z.string().trim().min(3, "Title is required"),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only"),
  excerpt: z.string().trim().min(20, "Summary must be at least 20 characters").max(300, "Keep the summary under 300 characters"),
  content: z.string().trim().min(50, "Article body must be at least 50 characters"),
  category: z.enum(ARTICLE_CATEGORIES),
  coverImage: z.string().trim().optional().or(z.literal("")),
  externalUrl: externalUrlSchema,
  status: z.enum(ARTICLE_STATUSES),
});

export type ArticleInput = z.infer<typeof articleSchema>;

/** Turns a title into a URL-safe slug so admins don't have to hand-write one. */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
