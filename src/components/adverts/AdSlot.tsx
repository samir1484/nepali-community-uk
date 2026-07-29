import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import type { AdPlacementValue } from "@/lib/validation/adverts";

/**
 * Renders the active adverts for a placement, or a "your advert could be here"
 * card linking to /advertise when there are none. The placeholder is the point:
 * empty ad space is how you sell ad space, and it costs nothing to show.
 *
 * Advertiser links carry rel="sponsored nofollow" — Google requires paid links
 * to be marked, and unmarked ones can earn a manual penalty.
 */
export async function AdSlot({ placement }: { placement: AdPlacementValue }) {
  const adverts = await db.advert
    .findMany({
      where: { placement, isActive: true },
      orderBy: { order: "asc" },
      take: 3,
    })
    .catch(() => []);

  if (adverts.length === 0) {
    return (
      <aside className="rounded-lg border border-dashed bg-card/60 p-6 text-center">
        <p className="text-sm font-medium text-foreground">Your advert could be here</p>
        <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
          Reach the Nepali community across the UK. Featured listings, event promotion and
          sponsored posts start from around £20 a month.
        </p>
        <Link
          href="/advertise"
          className="mt-3 inline-block rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary transition-all duration-300 hover:bg-primary/10 active:scale-95"
        >
          Advertise with us
        </Link>
      </aside>
    );
  }

  return (
    <aside className="space-y-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">Advertisement</p>
      {adverts.map((advert) => {
        const content = (
          <div className="flex gap-4 rounded-lg border bg-card p-4 transition-all duration-300 hover:border-primary">
            {advert.imageUrl && (
              <Image
                src={advert.imageUrl}
                alt=""
                width={96}
                height={96}
                className="size-24 shrink-0 rounded-md object-cover"
              />
            )}
            <div className="min-w-0">
              <p className="font-semibold text-foreground">{advert.title}</p>
              {advert.body && (
                <p className="mt-1 text-sm text-muted-foreground">{advert.body}</p>
              )}
            </div>
          </div>
        );

        return advert.linkUrl ? (
          <a
            key={advert.id}
            href={advert.linkUrl}
            target="_blank"
            rel="noopener noreferrer sponsored nofollow"
            className="block active:scale-[0.99]"
          >
            {content}
          </a>
        ) : (
          <div key={advert.id}>{content}</div>
        );
      })}
    </aside>
  );
}
