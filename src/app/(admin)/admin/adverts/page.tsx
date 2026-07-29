import { db } from "@/lib/db";
import { AdvertsManager } from "@/components/admin/AdvertsManager";

export default async function AdminAdvertsPage() {
  // Can't sort by placements now it's a list, so newest-first within each
  // manual order position, which is what you want when reviewing them anyway.
  const adverts = await db.advert.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Adverts</h1>
      <p className="mt-1 text-muted-foreground">
        Paid placements across the site. Any spot with no live advert shows a
        &quot;Your advert could be here&quot; card linking to the Advertise page, so empty
        space still sells itself.
      </p>

      <div className="mt-8">
        <AdvertsManager adverts={adverts} />
      </div>
    </div>
  );
}
