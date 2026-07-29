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
import { AdviceDisclaimer } from "@/components/resources/AdviceDisclaimer";
import { ARTICLE_CATEGORY_LABELS, isResourceCategory } from "@/lib/validation/articles";

async function getGuide(slug: string) {
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
  const guide = await getGuide(slug);

  // Mirrors the guard in /news/[slug]: each article is served from exactly one
  // section, so news items don't also resolve here.
  if (!guide || guide.status !== "PUBLISHED" || !isResourceCategory(guide.category)) {
    return { title: "Resource", robots: { index: false, follow: false } };
  }

  const image = guide.coverImage ?? DEFAULT_OG_IMAGE;
  return {
    title: guide.title,
    description: guide.excerpt,
    alternates: { canonical: `/resources/${guide.slug}` },
    openGraph: {
      type: "article",
      url: `/resources/${guide.slug}`,
      siteName: SITE_NAME,
      title: guide.title,
      description: guide.excerpt,
      publishedTime: guide.publishedAt?.toISOString(),
      images: [{ url: image, alt: guide.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.excerpt,
      images: [image],
    },
  };
}

export default async function ResourceGuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = await getGuide(slug);

  if (!guide || guide.status !== "PUBLISHED" || !isResourceCategory(guide.category)) notFound();

  const backgroundImage = await getSiteImage("page.news.image", "/images/culture/stupa-alt.webp");

  return (
    <PageBackground image={backgroundImage}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: guide.title,
          description: guide.excerpt,
          url: absoluteUrl(`/resources/${guide.slug}`),
          ...(guide.coverImage ? { image: [guide.coverImage] } : {}),
          ...(guide.publishedAt ? { datePublished: guide.publishedAt.toISOString() } : {}),
          dateModified: guide.updatedAt.toISOString(),
          author: { "@type": "Organization", name: guide.author?.name ?? SITE_NAME },
          publisher: {
            "@type": "Organization",
            name: SITE_NAME,
            logo: { "@type": "ImageObject", url: absoluteUrl("/logo.png") },
          },
        }}
      />

      <article className="mx-auto max-w-2xl px-4 py-16">
        <Link href="/resources" className="text-sm text-primary underline underline-offset-4">
          ← Back to Resources
        </Link>

        <span className="mt-4 block text-xs font-medium uppercase tracking-wide text-primary">
          {ARTICLE_CATEGORY_LABELS[guide.category]}
        </span>
        <h1 className="mt-1 text-3xl font-bold text-foreground">{guide.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {guide.publishedAt?.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>

        <div className="mt-6">
          <AdviceDisclaimer />
        </div>

        {guide.coverImage && (
          <div className="relative mt-6 aspect-video overflow-hidden rounded-lg border">
            <Image src={guide.coverImage} alt={guide.title} fill className="object-cover" />
          </div>
        )}

        <p className="mt-6 text-lg text-muted-foreground">{guide.excerpt}</p>
        <div className="mt-6 whitespace-pre-wrap text-foreground">{guide.content}</div>

        {guide.externalUrl && (
          <Button
            className="mt-8"
            nativeButton={false}
            render={
              <a href={guide.externalUrl} target="_blank" rel="noopener noreferrer">
                Official source
              </a>
            }
          />
        )}
      </article>
    </PageBackground>
  );
}
