import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { PageBackground } from "@/components/layout/PageBackground";
import { getSiteImage } from "@/lib/settings";
import { AdviceDisclaimer } from "@/components/resources/AdviceDisclaimer";
import { IMMIGRATION_LINKS, STUDENT_LINKS, ARRIVAL_STEPS, type ResourceLink } from "@/lib/resources";
import { ARTICLE_CATEGORY_LABELS, RESOURCE_CATEGORIES } from "@/lib/validation/articles";
import { np } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Immigration & Student Resources for Nepalis in the UK",
  description:
    "Practical information for Nepali people in the UK — visas and immigration, student support, arriving checklist, working rights and where to get properly regulated advice.",
  alternates: { canonical: "/resources" },
  openGraph: {
    title: "Immigration & Student Resources | Nepali Community UK",
    description:
      "Visas, student support, arriving in the UK and where to find regulated immigration advice.",
    url: "/resources",
  },
};

export const revalidate = 3600;

export default async function ResourcesPage() {
  const guides = await db.article
    .findMany({
      where: { status: "PUBLISHED", category: { in: [...RESOURCE_CATEGORIES] } },
      orderBy: { publishedAt: "desc" },
      select: { id: true, title: true, slug: true, excerpt: true, category: true },
    })
    .catch(() => []);

  const backgroundImage = await getSiteImage("page.news.image", "/images/culture/stupa-alt.webp");

  return (
    <PageBackground image={backgroundImage}>
      <div className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-3xl font-bold text-foreground">
          Immigration &amp; Student Resources{" "}
          <span className="font-nepali text-2xl text-muted-foreground">{np.resourcesHeading}</span>
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          The things Nepali people in the UK most often need to find — visas, student
          support, and what to sort out when you first arrive.
        </p>

        <div className="mt-6">
          <AdviceDisclaimer />
        </div>

        {guides.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold text-foreground">Our guides</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {guides.map((guide) => (
                <Link key={guide.id} href={`/resources/${guide.slug}`}>
                  <Card className="h-full transition-all duration-300 hover:border-primary active:scale-[0.98]">
                    <CardContent className="pt-6">
                      <span className="text-xs font-medium uppercase tracking-wide text-primary">
                        {ARTICLE_CATEGORY_LABELS[guide.category]}
                      </span>
                      <h3 className="mt-1 font-semibold text-foreground">{guide.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{guide.excerpt}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-12">
          <h2 className="text-xl font-semibold text-foreground">Just arrived? Start here</h2>
          <ol className="mt-4 space-y-3">
            {ARRIVAL_STEPS.map((step, index) => (
              <li key={step.title} className="flex gap-3 rounded-lg border bg-card p-4">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {index + 1}
                </span>
                <div>
                  <p className="font-medium text-foreground">{step.title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <LinkSection
          heading="Visas & immigration"
          intro="Official sources. Rules change often, so always check the date on the page you land on."
          links={IMMIGRATION_LINKS}
        />

        <LinkSection
          heading="Students"
          intro="Studying in the UK, working alongside your course, and staying on afterwards."
          links={STUDENT_LINKS}
        />

        <section className="mt-12 rounded-lg border bg-card p-6">
          <h2 className="font-semibold text-foreground">Something missing?</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            If there&apos;s a question the community keeps asking that isn&apos;t covered
            here, tell us and we&apos;ll add it.
          </p>
          <Link
            href="/contact"
            className="mt-3 inline-block text-sm text-primary underline underline-offset-4"
          >
            Get in touch
          </Link>
        </section>
      </div>
    </PageBackground>
  );
}

function LinkSection({
  heading,
  intro,
  links,
}: {
  heading: string;
  intro: string;
  links: ResourceLink[];
}) {
  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold text-foreground">{heading}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{intro}</p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <li key={link.url}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-full flex-col rounded-lg border bg-card p-4 transition-all duration-300 hover:border-primary active:scale-[0.98]"
            >
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                {link.title}
                <ExternalLink size={13} className="shrink-0 text-muted-foreground" />
              </span>
              <span className="mt-1 text-sm text-muted-foreground">{link.description}</span>
              <span className="mt-2 text-xs uppercase tracking-wide text-primary">
                {link.source}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
