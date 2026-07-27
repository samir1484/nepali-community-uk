import type { Metadata } from "next";
import { ListingsPage } from "@/components/listings/ListingsPage";

export const metadata: Metadata = {
  title: "Nepali Jobs in the UK",
  description:
    "Browse and post job opportunities for the Nepali community across the UK — full-time, part-time, contract and internship roles from employers who welcome Nepali applicants.",
  alternates: { canonical: "/jobs" },
  openGraph: {
    title: "Nepali Jobs in the UK | Nepali Community UK",
    description:
      "Browse and post job opportunities for the Nepali community across the UK.",
    url: "/jobs",
  },
};

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ location?: string }>;
}) {
  const params = await searchParams;
  return <ListingsPage type="JOB" location={params.location} />;
}
