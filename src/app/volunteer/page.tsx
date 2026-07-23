import type { Metadata } from "next";
import { ListingsPage } from "@/components/listings/ListingsPage";

export const metadata: Metadata = {
  title: "Volunteer Opportunities | Nepali Community UK",
  description: "Give back to the community through local volunteer opportunities.",
};

export default async function VolunteerPage({
  searchParams,
}: {
  searchParams: Promise<{ location?: string }>;
}) {
  const params = await searchParams;
  return <ListingsPage type="VOLUNTEER" location={params.location} />;
}
