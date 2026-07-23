import { db } from "@/lib/db";
import { SectionsManager } from "@/components/admin/SectionsManager";

export default async function AdminSectionsPage() {
  const sections = await db.homeSection.findMany({
    orderBy: [{ type: "asc" }, { order: "asc" }],
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Homepage Sections</h1>
      <p className="mt-1 text-muted-foreground">
        Add, edit, delete, or reorder the highlight cards and photo showcase panels shown
        on the homepage.
      </p>

      <div className="mt-8">
        <SectionsManager sections={sections} />
      </div>
    </div>
  );
}
