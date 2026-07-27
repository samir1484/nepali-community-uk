import type { Metadata } from "next";
import { db } from "@/lib/db";
import { SITE_NAME, DEFAULT_OG_IMAGE } from "@/lib/seo";
import { typeToPath, typeLabel, type ListingTypeValue } from "@/lib/validation/listings";

function truncate(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).trimEnd()}…`;
}

export async function buildListingMetadata(
  type: ListingTypeValue,
  id: string
): Promise<Metadata> {
  const listing = await db.listing.findUnique({
    where: { id },
    select: { title: true, description: true, location: true, type: true, status: true, images: true },
  });

  if (!listing || listing.type !== type || listing.status !== "APPROVED") {
    return { title: typeLabel(type), robots: { index: false, follow: false } };
  }

  const title = `${listing.title} — ${listing.location}`;
  const description = truncate(listing.description, 155);
  const url = `/${typeToPath(type)}/${id}`;
  const image = listing.images[0] ?? DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [{ url: image, alt: listing.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
