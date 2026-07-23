import type { Metadata } from "next";
import { ListingsPage } from "@/components/listings/ListingsPage";

export const metadata: Metadata = {
  title: "Jobs | Nepali Community UK",
  description: "Find and post job opportunities within the Nepali community across the UK.",
};

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ location?: string }>;
}) {
  const params = await searchParams;
  return <ListingsPage type="JOB" location={params.location} />;
}
