import { db } from "@/lib/db";
import { AdvertsManager } from "@/components/admin/AdvertsManager";

export default async function AdminAdvertsPage() {
  const adverts = await db.advert.findMany({
    orderBy: [{ placement: "asc" }, { order: "asc" }],
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
