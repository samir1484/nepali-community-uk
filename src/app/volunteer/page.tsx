import type { Metadata } from "next";
import { ListingsPage } from "@/components/listings/ListingsPage";

export const metadata: Metadata = {
  title: "Nepali Volunteer Opportunities in the UK",
  description:
    "Give back to the Nepali community in the UK — find local volunteering opportunities with charities, community groups and cultural organisations near you.",
  alternates: { canonical: "/volunteer" },
  openGraph: {
    title: "Nepali Volunteer Opportunities in the UK | Nepali Community UK",
    description: "Find local volunteering opportunities with Nepali community groups across the UK.",
    url: "/volunteer",
  },
};

export default async function VolunteerPage({
  searchParams,
}: {
  searchParams: Promise<{ location?: string }>;
}) {
  const params = await searchParams;
  return <ListingsPage type="VOLUNTEER" location={params.location} />;
}
