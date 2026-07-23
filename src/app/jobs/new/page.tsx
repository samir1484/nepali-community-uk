import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ListingForm } from "@/components/listings/ListingForm";
import { PageBackground } from "@/components/layout/PageBackground";
import { typeBackgroundImage } from "@/lib/validation/listings";

export const metadata: Metadata = { title: "Post a Job | Nepali Community UK" };

export default async function NewJobPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/jobs/new");

  return (
    <PageBackground image={typeBackgroundImage("JOB")}>
      <div className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="text-3xl font-bold text-foreground">Post a job</h1>
        <p className="mt-2 text-muted-foreground">
          Your listing will be reviewed by an admin before it appears publicly.
        </p>
        <div className="mt-8">
          <ListingForm type="JOB" />
        </div>
      </div>
    </PageBackground>
  );
}
