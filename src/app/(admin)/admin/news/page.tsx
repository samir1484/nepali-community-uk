import { db } from "@/lib/db";
import { ArticlesManager } from "@/components/admin/ArticlesManager";

export default async function AdminNewsPage() {
  const articles = await db.article.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">News &amp; Blog</h1>
      <p className="mt-1 text-muted-foreground">
        Write community news and blog posts. Drafts stay hidden until you set them to
        Published.
      </p>

      <div className="mt-8">
        <ArticlesManager articles={articles} />
      </div>
    </div>
  );
}
