import { db } from "@/lib/db";
import { ListingsManager } from "@/components/admin/ListingsManager";

export default async function AdminListingsPage() {
  const listings = await db.listing.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true, email: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Listings</h1>
      <p className="mt-1 text-muted-foreground">
        Review, approve, reject, or delete jobs, rooms, events, and volunteer opportunities
        posted by the community.
      </p>

      <div className="mt-8">
        <ListingsManager listings={listings} />
      </div>
    </div>
  );
}
