import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ListingForm } from "@/components/listings/ListingForm";
import { PageBackground } from "@/components/layout/PageBackground";
import { getListingBackground } from "@/lib/settings";

export const metadata: Metadata = { title: "Post a Job | Nepali Community UK" };

// Photo uploads go to Supabase Storage — safety margin against Vercel's
// default function timeout on a cold start.
export const maxDuration = 30;

export default async function NewJobPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/jobs/new");
  const backgroundImage = await getListingBackground("JOB");

  return (
    <PageBackground image={backgroundImage}>
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
