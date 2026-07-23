import { db } from "@/lib/db";
import { UsersTable } from "@/components/admin/UsersTable";

export default async function AdminUsersPage() {
  const users = await db.user.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Users</h1>
      <p className="mt-1 text-muted-foreground">
        Everyone registered on Nepali Community UK, with their contact details and role.
      </p>

      <div className="mt-8">
        <UsersTable users={users} />
      </div>
    </div>
  );
}
