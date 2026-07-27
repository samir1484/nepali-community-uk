import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { PageBackground } from "@/components/layout/PageBackground";
import { getSiteImage } from "@/lib/settings";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_NAME, DEFAULT_OG_IMAGE, absoluteUrl } from "@/lib/seo";
import { ARTICLE_CATEGORY_LABELS } from "@/lib/validation/articles";

async function getArticle(slug: string) {
  return db.article.findUnique({
    where: { slug },
    include: { author: { select: { name: true } } },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article || article.status !== "PUBLISHED") {
    return { title: "Article", robots: { index: false, follow: false } };
  }

  const image = article.coverImage ?? DEFAULT_OG_IMAGE;
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/news/${article.slug}` },
    openGraph: {
      type: "article",
      url: `/news/${article.slug}`,
      siteName: SITE_NAME,
      title: article.title,
      description: article.excerpt,
      publishedTime: article.publishedAt?.toISOString(),
      images: [{ url: image, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [image],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article || article.status !== "PUBLISHED") notFound();

  const backgroundImage = await getSiteImage("page.news.image", "/images/culture/stupa-alt.webp");

  return (
    <PageBackground image={backgroundImage}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.excerpt,
          url: absoluteUrl(`/news/${article.slug}`),
          ...(article.coverImage ? { image: [article.coverImage] } : {}),
          ...(article.publishedAt ? { datePublished: article.publishedAt.toISOString() } : {}),
          dateModified: article.updatedAt.toISOString(),
          author: { "@type": "Organization", name: article.author?.name ?? SITE_NAME },
          publisher: {
            "@type": "Organization",
            name: SITE_NAME,
            logo: { "@type": "ImageObject", url: absoluteUrl("/logo.png") },
          },
        }}
      />

      <article className="mx-auto max-w-2xl px-4 py-16">
        <Link href="/news" className="text-sm text-primary underline underline-offset-4">
          ← Back to News &amp; Blog
        </Link>

        <span className="mt-4 block text-xs font-medium uppercase tracking-wide text-primary">
          {ARTICLE_CATEGORY_LABELS[article.category]}
        </span>
        <h1 className="mt-1 text-3xl font-bold text-foreground">{article.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {article.publishedAt?.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          {article.author?.name ? ` · ${article.author.name}` : ""}
        </p>

        {article.coverImage && (
          <div className="relative mt-6 aspect-video overflow-hidden rounded-lg border">
            <Image src={article.coverImage} alt={article.title} fill className="object-cover" />
          </div>
        )}

        <p className="mt-6 text-lg text-muted-foreground">{article.excerpt}</p>

        <div className="mt-6 whitespace-pre-wrap text-foreground">{article.content}</div>

        {article.externalUrl && (
          <Button
            className="mt-8"
            nativeButton={false}
            render={
              <a href={article.externalUrl} target="_blank" rel="noopener noreferrer">
                Read the full story
              </a>
            }
          />
        )}
      </article>
    </PageBackground>
  );
}
