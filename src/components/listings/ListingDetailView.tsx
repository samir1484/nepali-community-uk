import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { formatListingDetailRows, mapsEmbedUrl, mapsSearchUrl } from "@/lib/listings";
import { typePluralLabel, typeToPath, typeBackgroundImage, type ListingTypeValue } from "@/lib/validation/listings";
import type { JobDetails, EventDetails } from "@/lib/validation/listings";
import { Button } from "@/components/ui/button";
import { ContactPosterForm } from "@/components/listings/ContactPosterForm";
import { PageBackground } from "@/components/layout/PageBackground";

export async function ListingDetailView({ type, id }: { type: ListingTypeValue; id: string }) {
  const listing = await db.listing.findUnique({
    where: { id },
    include: { author: { select: { name: true, email: true } } },
  });

  if (!listing || listing.type !== type || listing.status !== "APPROVED") {
    notFound();
  }

  const rows = formatListingDetailRows(type, listing.details);

  const applyEmail = type === "JOB" ? (listing.details as JobDetails).applyEmail : undefined;
  const ticketUrl = type === "EVENT" ? (listing.details as EventDetails).ticketUrl : undefined;
  const showContactForm = type === "ROOM" || type === "BUSINESS" || type === "VOLUNTEER" || (type === "JOB" && !applyEmail);

  return (
    <PageBackground image={typeBackgroundImage(type)}>
    <div className="mx-auto max-w-2xl px-4 py-16">
      <Link href={`/${typeToPath(type)}`} className="text-sm text-primary underline underline-offset-4">
        ← Back to {typePluralLabel(type)}
      </Link>

      <h1 className="mt-4 text-3xl font-bold text-foreground">{listing.title}</h1>
      <p className="mt-1 text-muted-foreground">
        {listing.location} · Posted by {listing.author.name}
      </p>

      {applyEmail && (
        <Button
          className="mt-4"
          nativeButton={false}
          render={
            <a href={`mailto:${applyEmail}?subject=${encodeURIComponent(`Application for ${listing.title}`)}`}>
              Apply Now
            </a>
          }
        />
      )}

      {ticketUrl && (
        <Button
          className="mt-4"
          nativeButton={false}
          render={
            <a href={ticketUrl} target="_blank" rel="noopener noreferrer">
              Get Tickets
            </a>
          }
        />
      )}

      {listing.images.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {listing.images.map((url) => (
            <div key={url} className="relative aspect-square overflow-hidden rounded-lg border">
              <Image src={url} alt="" fill className="object-cover" />
            </div>
          ))}
        </div>
      )}

      <dl className="mt-6 grid gap-3 rounded-lg border bg-card p-4 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label}>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {row.label}
            </dt>
            <dd className="mt-0.5 text-foreground">
              {row.href ? (
                <a
                  href={row.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  {row.value}
                </a>
              ) : (
                row.value
              )}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 whitespace-pre-wrap text-foreground">{listing.description}</div>

      {type === "BUSINESS" && (
        <div className="mt-6">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Find us
          </h2>
          <div className="mt-2 overflow-hidden rounded-lg border">
            <iframe
              src={mapsEmbedUrl(listing.location)}
              className="h-64 w-full"
              loading="lazy"
              title={`Map showing ${listing.location}`}
            />
          </div>
          <a
            href={mapsSearchUrl(listing.location)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm text-primary underline underline-offset-4"
          >
            View larger map
          </a>
        </div>
      )}

      {showContactForm && (
        <div className="mt-8">
          <ContactPosterForm listingId={listing.id} posterName={listing.author.name} />
        </div>
      )}
    </div>
    </PageBackground>
  );
}
