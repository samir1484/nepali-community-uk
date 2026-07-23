import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatListingDetailRows } from "@/lib/listings";
import { typeLabel, typeToPath, type ListingTypeValue } from "@/lib/validation/listings";

export async function ListingDetailView({ type, id }: { type: ListingTypeValue; id: string }) {
  const listing = await db.listing.findUnique({
    where: { id },
    include: { author: { select: { name: true } } },
  });

  if (!listing || listing.type !== type || listing.status !== "APPROVED") {
    notFound();
  }

  const rows = formatListingDetailRows(type, listing.details);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <Link href={`/${typeToPath(type)}`} className="text-sm text-primary underline underline-offset-4">
        ← Back to {typeLabel(type).toLowerCase()}s
      </Link>

      <h1 className="mt-4 text-3xl font-bold text-foreground">{listing.title}</h1>
      <p className="mt-1 text-muted-foreground">
        {listing.location} · Posted by {listing.author.name}
      </p>

      <dl className="mt-6 grid gap-3 rounded-lg border bg-card p-4 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label}>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {row.label}
            </dt>
            <dd className="mt-0.5 text-foreground">{row.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 whitespace-pre-wrap text-foreground">{listing.description}</div>
    </div>
  );
}
