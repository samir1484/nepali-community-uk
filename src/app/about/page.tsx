import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Nepali Community UK",
  description: "Learn about the mission behind Nepali Community UK.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
        About Nepali Community UK
      </h1>
      <div className="mt-6 space-y-4 text-muted-foreground">
        <p>
          Nepali Community UK is being built to become the United Kingdom&apos;s
          largest digital platform for the Nepali diaspora — a single place to find
          jobs, housing, events, news, and businesses run by and for our community.
        </p>
        <p>
          Whether you&apos;re a student navigating a new city, a professional looking
          for your next opportunity, a landlord or tenant searching for a room, or a
          business owner wanting to reach fellow community members, Nepali Community
          UK is designed to bring us closer together.
        </p>
        <p>
          We&apos;re starting with the foundations — community registration, a shared
          home for the platform, and a direct line to the founder — with jobs, rooms,
          events, blogs, news, business listings, volunteering, and immigration and
          student resources rolling out next.
        </p>
      </div>
    </div>
  );
}
