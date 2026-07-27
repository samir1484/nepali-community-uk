"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Article } from "@/generated/prisma/client";
import {
  createArticle,
  updateArticle,
  deleteArticle,
  type ArticleActionState,
} from "@/lib/actions/articles";
import {
  ARTICLE_CATEGORIES,
  ARTICLE_CATEGORY_LABELS,
  ARTICLE_STATUSES,
  slugify,
} from "@/lib/validation/articles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUploader } from "@/components/admin/ImageUploader";

const emptyDraft = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "NEWS" as (typeof ARTICLE_CATEGORIES)[number],
  coverImage: "",
  externalUrl: "",
  status: "DRAFT" as (typeof ARTICLE_STATUSES)[number],
};

type Draft = typeof emptyDraft;

function toDraft(article: Article): Draft {
  return {
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content,
    category: article.category,
    coverImage: article.coverImage ?? "",
    externalUrl: article.externalUrl ?? "",
    status: article.status,
  };
}

export function ArticlesManager({ articles }: { articles: Article[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function startCreate() {
    setEditingId("new");
    setDraft(emptyDraft);
    setFieldErrors({});
    setMessage(null);
  }

  function startEdit(article: Article) {
    setEditingId(article.id);
    setDraft(toDraft(article));
    setFieldErrors({});
    setMessage(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setFieldErrors({});
    setMessage(null);
  }

  function submit() {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("title", draft.title);
      // Fall back to a slug derived from the title so admins can leave it blank.
      fd.set("slug", draft.slug.trim() || slugify(draft.title));
      fd.set("excerpt", draft.excerpt);
      fd.set("content", draft.content);
      fd.set("category", draft.category);
      fd.set("coverImage", draft.coverImage);
      fd.set("externalUrl", draft.externalUrl);
      fd.set("status", draft.status);

      const initial: ArticleActionState = { success: false, message: "" };
      const result =
        editingId === "new"
          ? await createArticle(initial, fd)
          : await updateArticle(editingId as string, initial, fd);

      if (!result.success) {
        setFieldErrors(result.fieldErrors ?? {});
        setMessage({ type: "error", text: result.message });
        return;
      }
      setFieldErrors({});
      setMessage({ type: "success", text: result.message });
      setEditingId(null);
      router.refresh();
    });
  }

  function remove(article: Article) {
    if (!window.confirm(`Delete "${article.title}"? This can't be undone.`)) return;
    startTransition(async () => {
      const result = await deleteArticle(article.id);
      setMessage({ type: result.success ? "success" : "error", text: result.message });
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      {message && (
        <p
          className={`rounded-md px-3 py-2 text-sm ${
            message.type === "success"
              ? "bg-primary/10 text-primary"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {message.text}
        </p>
      )}

      {editingId ? (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <h2 className="font-semibold text-foreground">
              {editingId === "new" ? "New article" : "Edit article"}
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={draft.category}
                  onValueChange={(v) => setDraft((d) => ({ ...d, category: v as Draft["category"] }))}
                >
                  <SelectTrigger id="category" className="w-full">
                    {/* Base UI renders the raw enum value unless given a mapper. */}
                    <SelectValue>
                      {(value) => ARTICLE_CATEGORY_LABELS[value as (typeof ARTICLE_CATEGORIES)[number]]}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {ARTICLE_CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {ARTICLE_CATEGORY_LABELS[c]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={draft.status}
                  onValueChange={(v) => setDraft((d) => ({ ...d, status: v as Draft["status"] }))}
                >
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue>
                      {(value) => (value === "PUBLISHED" ? "Published (live on the site)" : "Draft (not visible publicly)")}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft (not visible publicly)</SelectItem>
                    <SelectItem value="PUBLISHED">Published (live on the site)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={draft.title}
                onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              />
              <FieldError errors={fieldErrors.title} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Web address (optional)</Label>
              <Input
                id="slug"
                value={draft.slug}
                placeholder={draft.title ? slugify(draft.title) : "auto-generated-from-title"}
                onChange={(e) => setDraft((d) => ({ ...d, slug: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">
                Appears as /news/your-web-address. Leave blank to generate it from the title.
              </p>
              <FieldError errors={fieldErrors.slug} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Short summary</Label>
              <Textarea
                id="excerpt"
                rows={2}
                value={draft.excerpt}
                onChange={(e) => setDraft((d) => ({ ...d, excerpt: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">
                Shown on the news list and in Google results. Aim for one or two sentences.
              </p>
              <FieldError errors={fieldErrors.excerpt} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Article body</Label>
              <Textarea
                id="content"
                rows={12}
                value={draft.content}
                onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))}
              />
              <FieldError errors={fieldErrors.content} />
            </div>

            <div className="space-y-2">
              <Label>Cover image</Label>
              <ImageUploader
                value={draft.coverImage}
                onChange={(url) => setDraft((d) => ({ ...d, coverImage: url }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="externalUrl">Source or external link (optional)</Label>
              <Input
                id="externalUrl"
                type="url"
                placeholder="https://"
                value={draft.externalUrl}
                onChange={(e) => setDraft((d) => ({ ...d, externalUrl: e.target.value }))}
              />
              <FieldError errors={fieldErrors.externalUrl} />
            </div>

            <div className="flex gap-2">
              <Button onClick={submit} disabled={isPending}>
                {isPending ? "Saving..." : "Save"}
              </Button>
              <Button variant="outline" onClick={cancelEdit} disabled={isPending}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={startCreate}>New article</Button>
      )}

      <div className="space-y-3">
        {articles.length === 0 && (
          <p className="text-muted-foreground">No articles yet. Create your first one above.</p>
        )}

        {articles.map((article) => (
          <Card key={article.id}>
            <CardContent className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={article.status === "PUBLISHED" ? "default" : "secondary"}>
                    {article.status === "PUBLISHED" ? "Published" : "Draft"}
                  </Badge>
                  <Badge variant="outline">{ARTICLE_CATEGORY_LABELS[article.category]}</Badge>
                  <span className="font-medium text-foreground">{article.title}</span>
                </div>
                <p className="mt-1 truncate text-sm text-muted-foreground">{article.excerpt}</p>
                <p className="mt-1 text-xs text-muted-foreground">/news/{article.slug}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                {article.status === "PUBLISHED" && (
                  <Button
                    size="sm"
                    variant="outline"
                    nativeButton={false}
                    render={<Link href={`/news/${article.slug}`}>View</Link>}
                  />
                )}
                <Button size="sm" variant="outline" onClick={() => startEdit(article)} disabled={isPending}>
                  Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => remove(article)} disabled={isPending}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="text-sm text-destructive">{errors[0]}</p>;
}
