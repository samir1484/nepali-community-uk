import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { PageBackground } from "@/components/layout/PageBackground";
import { getSiteImage } from "@/lib/settings";
import { ARTICLE_CATEGORY_LABELS, NEWS_CATEGORIES } from "@/lib/validation/articles";
import { np } from "@/lib/translations";
import { AdSlot } from "@/components/adverts/AdSlot";

export const metadata: Metadata = {
  title: "Nepali Community News & Blog UK",
  description:
    "News, guides and stories for the Nepali community in the UK — visa and immigration updates, student advice, community events coverage and member stories.",
  alternates: { canonical: "/news" },
  openGraph: {
    title: "Nepali Community News & Blog UK | Nepali Community UK",
    description: "News, guides and stories for the Nepali community across the UK.",
    url: "/news",
  },
};

export default async function NewsPage() {
  const articles = await db.article.findMany({
    // Immigration/student guides live at /resources, not here.
    where: { status: "PUBLISHED", category: { in: [...NEWS_CATEGORIES] } },
    orderBy: { publishedAt: "desc" },
  });

  const backgroundImage = await getSiteImage("page.news.image", "/images/culture/stupa-alt.webp");

  return (
    <PageBackground image={backgroundImage}>
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-3xl font-bold text-foreground">
          News &amp; Blog <span className="font-nepali text-2xl text-muted-foreground">{np.newsHeading}</span>
        </h1>
        <p className="mt-1 max-w-2xl text-muted-foreground">
          Updates, guides and stories for the Nepali community across the United Kingdom.
        </p>

        {articles.length === 0 ? (
          <p className="mt-10 text-muted-foreground">
            No articles published yet — check back soon.
          </p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link key={article.id} href={`/news/${article.slug}`}>
                <Card className="h-full overflow-hidden transition-all duration-300 hover:border-primary active:scale-[0.98]">
                  {article.coverImage && (
                    <Image
                      src={article.coverImage}
                      alt={article.title}
                      width={640}
                      height={360}
                      className="h-40 w-full object-cover"
                    />
                  )}
                  <CardContent className="pt-6">
                    <span className="text-xs font-medium uppercase tracking-wide text-primary">
                      {ARTICLE_CATEGORY_LABELS[article.category]}
                    </span>
                    <h2 className="mt-1 font-semibold text-foreground">{article.title}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">{article.excerpt}</p>
                    {article.publishedAt && (
                      <p className="mt-3 text-xs text-muted-foreground">
                        {article.publishedAt.toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12">
          <AdSlot placement="NEWS" />
        </div>
      </div>
    </PageBackground>
  );
}
