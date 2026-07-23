import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = session?.user?.role;

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }
  if (role !== "ADMIN" && role !== "MODERATOR") {
    redirect("/?error=not_allowed");
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl">
      <AdminNav />
      <main className="flex-1 px-4 py-8 sm:px-8">{children}</main>
    </div>
  );
}
