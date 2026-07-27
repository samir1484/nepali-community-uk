import type { Metadata } from "next";
import { LocationListingsPage } from "@/components/listings/LocationListingsPage";
import { buildLocationMetadata } from "@/lib/locationMetadata";
import { UK_LOCATIONS } from "@/lib/locations";

// generateStaticParams + Prisma would otherwise freeze these pages at build
// time — Next can't tag a Prisma call for revalidation the way it does fetch.
// Re-render at most every 5 minutes so a newly posted listing shows up here
// without waiting for a redeploy.
export const revalidate = 300;

export function generateStaticParams() {
  return UK_LOCATIONS.map((l) => ({ location: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ location: string }>;
}): Promise<Metadata> {
  const { location } = await params;
  return buildLocationMetadata("JOB", location);
}

export default async function JobsInLocationPage({
  params,
}: {
  params: Promise<{ location: string }>;
}) {
  const { location } = await params;
  return <LocationListingsPage type="JOB" slug={location} />;
}
