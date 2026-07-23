import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ListingForm } from "@/components/listings/ListingForm";

export const metadata: Metadata = { title: "Post an Event | Nepali Community UK" };

export default async function NewEventPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/events/new");

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-bold text-foreground">Post an event</h1>
      <p className="mt-2 text-muted-foreground">
        Your listing will be reviewed by an admin before it appears publicly.
      </p>
      <div className="mt-8">
        <ListingForm type="EVENT" />
      </div>
    </div>
  );
}
