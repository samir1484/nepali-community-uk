import Link from "next/link";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/listings/ListingCard";
import { LocationFilter } from "@/components/listings/LocationFilter";
import { typeLabel, typeToPath, type ListingTypeValue } from "@/lib/validation/listings";
import { np } from "@/lib/translations";
import { PageBackground } from "@/components/layout/PageBackground";
import { getListingBackground } from "@/lib/settings";

const TITLES: Record<ListingTypeValue, { heading: string; headingNp: string; description: string }> = {
  JOB: {
    heading: "Jobs",
    headingNp: np.jobsHeading,
    description: "Find and post job opportunities within the Nepali community across the UK.",
  },
  ROOM: {
    heading: "Rooms & Housing",
    headingNp: np.roomsHeading,
    description: "Browse room listings shared by fellow community members.",
  },
  EVENT: {
    heading: "Events",
    headingNp: np.eventsHeading,
    description: "Nepali cultural events, festivals, and meetups across the UK.",
  },
  VOLUNTEER: {
    heading: "Volunteer Opportunities",
    headingNp: np.volunteerHeading,
    description: "Give back to the community through local volunteer opportunities.",
  },
  BUSINESS: {
    heading: "Business Directory",
    headingNp: np.businessHeading,
    description: "Discover and support Nepali-owned businesses across the UK.",
  },
};

export async function ListingsPage({
  type,
  location,
}: {
  type: ListingTypeValue;
  location?: string;
}) {
  const trimmedLocation = location?.trim();

  const listings = await db.listing.findMany({
    where: {
      type,
      status: "APPROVED",
      ...(trimmedLocation
        ? { location: { contains: trimmedLocation, mode: "insensitive" } }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  const { heading, headingNp, description } = TITLES[type];
  const backgroundImage = await getListingBackground(type);

  return (
    <PageBackground image={backgroundImage}>
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {heading} <span className="font-nepali text-2xl text-muted-foreground">{headingNp}</span>
          </h1>
          <p className="mt-1 text-muted-foreground">{description}</p>
        </div>
        <Button
          nativeButton={false}
          render={<Link href={`/${typeToPath(type)}/new`}>Post a {typeLabel(type).toLowerCase()}</Link>}
        />
      </div>

      <div className="mt-8">
        <LocationFilter defaultValue={trimmedLocation} />
      </div>

      {listings.length === 0 ? (
        <p className="mt-10 text-muted-foreground">
          No listings yet{trimmedLocation ? ` in "${trimmedLocation}"` : ""}. Be the first to post one.
        </p>
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
    </div>
    </PageBackground>
  );
}
