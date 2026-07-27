import "server-only";
import { db } from "@/lib/db";
import { LISTING_TYPES, type ListingTypeValue } from "@/lib/validation/listings";
import { UK_LOCATIONS } from "@/lib/locations";

export type GroundingData = {
  counts: Record<ListingTypeValue, number>;
  latestArticles: Array<{ title: string; slug: string }>;
  /** Locations that actually have something posted, for "where are the jobs?" */
  activeLocations: string[];
  contactEmail: string;
};

const FALLBACK: GroundingData = {
  counts: { JOB: 0, ROOM: 0, EVENT: 0, VOLUNTEER: 0, BUSINESS: 0 },
  latestArticles: [],
  activeLocations: [],
  contactEmail: "sameerkhatiwada4@gmail.com",
};

/**
 * Real numbers from the database, so the bot says "3 jobs are listed" rather
 * than inventing figures. Degrades to zeros on a DB hiccup — the responder is
 * written to handle empty data by pointing at the relevant page instead.
 */
export async function getGroundingData(): Promise<GroundingData> {
  try {
    const [grouped, articles, approved] = await Promise.all([
      db.listing.groupBy({
        by: ["type"],
        where: { status: "APPROVED" },
        _count: { _all: true },
      }),
      db.article.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        take: 3,
        select: { title: true, slug: true },
      }),
      db.listing.findMany({
        where: { status: "APPROVED" },
        select: { location: true },
      }),
    ]);

    const counts = { ...FALLBACK.counts };
    for (const row of grouped) {
      counts[row.type as ListingTypeValue] = row._count._all;
    }

    const activeLocations = UK_LOCATIONS.filter((loc) =>
      approved.some((l) => l.location.toLowerCase().includes(loc.match.toLowerCase()))
    ).map((loc) => loc.name);

    return {
      counts,
      latestArticles: articles,
      activeLocations,
      contactEmail: process.env.CONTACT_RECEIVER_EMAIL ?? FALLBACK.contactEmail,
    };
  } catch (err) {
    console.error("chat grounding lookup failed", err);
    return FALLBACK;
  }
}

export function totalListings(data: GroundingData): number {
  return LISTING_TYPES.reduce((sum, type) => sum + data.counts[type], 0);
}
