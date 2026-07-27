import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/listings/ListingCard";
import { LocationLinks } from "@/components/listings/LocationLinks";
import { typeLabel, typeToPath, type ListingTypeValue } from "@/lib/validation/listings";
import { PageBackground } from "@/components/layout/PageBackground";
import { getListingBackground } from "@/lib/settings";
import { findLocation } from "@/lib/locations";

/** Per-type wording so each landing page reads naturally and isn't boilerplate. */
const COPY: Record<
  ListingTypeValue,
  { heading: (place: string) => string; intro: (place: string) => string; empty: string }
> = {
  JOB: {
    heading: (place) => `Nepali Jobs in ${place}`,
    intro: (place) =>
      `Job opportunities in and around ${place}, shared by and for the Nepali community. Full-time, part-time and temporary roles posted by local employers and community members.`,
    empty: "No jobs posted here yet",
  },
  ROOM: {
    heading: (place) => `Nepali Rooms & Housing in ${place}`,
    intro: (place) =>
      `Rooms, flatshares and housing to rent in ${place}, posted by members of the Nepali community. A good place to look if you'd like to live near other Nepali families or students.`,
    empty: "No rooms listed here yet",
  },
  EVENT: {
    heading: (place) => `Nepali Events in ${place}`,
    intro: (place) =>
      `Nepali cultural events, festivals, Dashain and Tihar celebrations and community gatherings happening in and around ${place}.`,
    empty: "No events listed here yet",
  },
  VOLUNTEER: {
    heading: (place) => `Volunteer Opportunities in ${place}`,
    intro: (place) =>
      `Ways to give back to the Nepali community in ${place} — volunteering with local community groups, cultural organisations and charities.`,
    empty: "No volunteer opportunities listed here yet",
  },
  BUSINESS: {
    heading: (place) => `Nepali Businesses in ${place}`,
    intro: (place) =>
      `Nepali-owned businesses in ${place} — restaurants, grocers, shops, tradespeople and professional services run by members of the community.`,
    empty: "No businesses listed here yet",
  },
};

export async function LocationListingsPage({
  type,
  slug,
}: {
  type: ListingTypeValue;
  slug: string;
}) {
  const location = findLocation(slug);
  if (!location) notFound();

  const listings = await db.listing.findMany({
    where: {
      type,
      status: "APPROVED",
      location: { contains: location.match, mode: "insensitive" },
    },
    orderBy: { createdAt: "desc" },
  });

  const heading = COPY[type].heading(location.name);
  const intro = COPY[type].intro(location.name);
  const backgroundImage = await getListingBackground(type);
  const path = typeToPath(type);

  return (
    <PageBackground image={backgroundImage}>
      <div className="mx-auto max-w-6xl px-4 py-16">
        <Link href={`/${path}`} className="text-sm text-primary underline underline-offset-4">
          ← All {typeLabel(type).toLowerCase()}s across the UK
        </Link>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{heading}</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">{intro}</p>
          </div>
          <Button
            nativeButton={false}
            render={<Link href={`/${path}/new`}>Post a {typeLabel(type).toLowerCase()}</Link>}
          />
        </div>

        {listings.length === 0 ? (
          <div className="mt-10 rounded-lg border bg-card p-6">
            <p className="font-medium text-foreground">
              {COPY[type].empty} in {location.name}.
            </p>
            <p className="mt-1 text-muted-foreground">
              Be the first to post one — it only takes a minute, and members with matching
              interests get an email when it goes live.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                id={listing.id}
                type={listing.type}
                title={listing.title}
                location={listing.location}
                details={listing.details}
                images={listing.images}
                createdAt={listing.createdAt}
              />
            ))}
          </div>
        )}

        <div className="mt-12 border-t pt-8">
          <LocationLinks type={type} currentSlug={location.slug} />
        </div>
      </div>
    </PageBackground>
  );
}
