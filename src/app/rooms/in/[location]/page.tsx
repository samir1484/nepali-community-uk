import type { Metadata } from "next";
import { LocationListingsPage } from "@/components/listings/LocationListingsPage";
import { buildLocationMetadata } from "@/lib/locationMetadata";
import { UK_LOCATIONS } from "@/lib/locations";

// See jobs/in/[location]/page.tsx — ISR keeps these off a build-time freeze.
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
  return buildLocationMetadata("ROOM", location);
}

export default async function RoomsInLocationPage({
  params,
}: {
  params: Promise<{ location: string }>;
}) {
  const { location } = await params;
  return <LocationListingsPage type="ROOM" slug={location} />;
}
