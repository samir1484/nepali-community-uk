"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/rbac";
import { deleteImage } from "@/lib/storage";
import { articleSchema } from "@/lib/validation/articles";

export type ArticleActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

function parseFormData(formData: FormData) {
  return {
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    category: formData.get("category"),
    coverImage: formData.get("coverImage"),
    externalUrl: formData.get("externalUrl"),
    status: formData.get("status"),
  };
}

function revalidateArticle(slug: string) {
  revalidatePath("/admin/news");
  revalidatePath("/news");
  revalidatePath(`/news/${slug}`);
}

export async function createArticle(
  _prevState: ArticleActionState,
  formData: FormData
): Promise<ArticleActionState> {
  await requireAdmin();
  const session = await auth();

  const parsed = articleSchema.safeParse(parseFormData(formData));
  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const existing = await db.article.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: { slug: ["That web address is already used by another article."] },
    };
  }

  await db.article.create({
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      excerpt: parsed.data.excerpt,
      content: parsed.data.content,
      category: parsed.data.category,
      coverImage: parsed.data.coverImage || null,
      externalUrl: parsed.data.externalUrl || null,
      status: parsed.data.status,
      publishedAt: parsed.data.status === "PUBLISHED" ? new Date() : null,
      authorId: session?.user?.id ?? null,
    },
  });

  revalidateArticle(parsed.data.slug);
  return { success: true, message: "Article created." };
}

export async function updateArticle(
  id: string,
  _prevState: ArticleActionState,
  formData: FormData
): Promise<ArticleActionState> {
  await requireAdmin();

  const parsed = articleSchema.safeParse(parseFormData(formData));
  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const current = await db.article.findUnique({ where: { id } });
  if (!current) return { success: false, message: "Article not found." };

  const clash = await db.article.findUnique({ where: { slug: parsed.data.slug } });
  if (clash && clash.id !== id) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: { slug: ["That web address is already used by another article."] },
    };
  }

  await db.article.update({
    where: { id },
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      excerpt: parsed.data.excerpt,
      content: parsed.data.content,
      category: parsed.data.category,
      coverImage: parsed.data.coverImage || null,
      externalUrl: parsed.data.externalUrl || null,
      status: parsed.data.status,
      // Stamp the publish date the first time it actually goes live, and keep
      // that original date on later edits so re-editing doesn't reorder the feed.
      publishedAt:
        parsed.data.status === "PUBLISHED" ? (current.publishedAt ?? new Date()) : null,
    },
  });

  revalidateArticle(parsed.data.slug);
  if (current.slug !== parsed.data.slug) revalidatePath(`/news/${current.slug}`);
  return { success: true, message: "Article updated." };
}

export async function deleteArticle(id: string): Promise<{ success: boolean; message: string }> {
  await requireAdmin();

  const article = await db.article.findUnique({ where: { id } });
  if (!article) return { success: false, message: "Article not found." };

  await db.article.delete({ where: { id } });
  if (article.coverImage) await deleteImage(article.coverImage);

  revalidateArticle(article.slug);
  return { success: true, message: "Article deleted." };
}
