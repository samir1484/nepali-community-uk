import type { Metadata } from "next";
import { db } from "@/lib/db";
import { findLocation } from "@/lib/locations";
import { typeToPath, type ListingTypeValue } from "@/lib/validation/listings";
import { SITE_NAME } from "@/lib/seo";

const TITLES: Record<ListingTypeValue, (place: string) => string> = {
  JOB: (place) => `Nepali Jobs in ${place}`,
  ROOM: (place) => `Nepali Rooms & Housing in ${place}`,
  EVENT: (place) => `Nepali Events in ${place}`,
  VOLUNTEER: (place) => `Volunteer Opportunities in ${place}`,
  BUSINESS: (place) => `Nepali Businesses in ${place}`,
};

const DESCRIPTIONS: Record<ListingTypeValue, (place: string) => string> = {
  JOB: (place) =>
    `Find Nepali jobs in ${place}. Full-time, part-time and temporary roles posted by employers and community members across the Nepali community in ${place}.`,
  ROOM: (place) =>
    `Rooms, flatshares and housing to rent in ${place}, posted by the Nepali community — single rooms, shared rooms, studios and whole properties.`,
  EVENT: (place) =>
    `Nepali events in ${place} — cultural festivals, Dashain and Tihar celebrations, and community gatherings near you.`,
  VOLUNTEER: (place) =>
    `Volunteer opportunities with Nepali community groups and charities in ${place}. Give back to the community near you.`,
  BUSINESS: (place) =>
    `Nepali-owned businesses in ${place} — restaurants, grocers, shops and professional services run by the Nepali community.`,
};

export async function buildLocationMetadata(
  type: ListingTypeValue,
  slug: string
): Promise<Metadata> {
  const location = findLocation(slug);
  if (!location) return { title: "Not found", robots: { index: false, follow: false } };

  const count = await db.listing
    .count({
      where: { type, status: "APPROVED", location: { contains: location.match, mode: "insensitive" } },
    })
    .catch(() => 0);

  const title = TITLES[type](location.name);
  const description = DESCRIPTIONS[type](location.name);
  const url = `/${typeToPath(type)}/in/${location.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title: `${title} | ${SITE_NAME}`, description, url },
    // A location page with nothing in it is thin content — letting Google index
    // dozens of empty pages hurts the whole site, so they stay out of the index
    // until somebody actually posts there. Links are still followed so the
    // crawler can reach the populated ones.
    robots: count === 0 ? { index: false, follow: true } : { index: true, follow: true },
  };
}
