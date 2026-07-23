import Link from "next/link";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminDashboardPage() {
  const userCount = await db.user.count();
  const sectionCount = await db.homeSection.count();
  const pendingListingCount = await db.listing.count({ where: { status: "PENDING" } });
  const newMessageCount = await db.contactMessage.count({
    where: { notes: null, followUpAt: null },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
      <p className="mt-1 text-muted-foreground">Manage the Nepali Community UK website.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/users">
          <Card className="transition-colors hover:border-primary">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Registered users</p>
              <p className="mt-1 text-3xl font-bold text-foreground">{userCount}</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/listings">
          <Card className="transition-colors hover:border-primary">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Listings awaiting review</p>
              <p className="mt-1 text-3xl font-bold text-foreground">{pendingListingCount}</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/messages">
          <Card className="transition-colors hover:border-primary">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">New messages</p>
              <p className="mt-1 text-3xl font-bold text-foreground">{newMessageCount}</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/sections">
          <Card className="transition-colors hover:border-primary">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Homepage sections</p>
              <p className="mt-1 text-3xl font-bold text-foreground">{sectionCount}</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
