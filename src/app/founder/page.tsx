import type { Metadata } from "next";
import { db } from "@/lib/db";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const metadata: Metadata = {
  title: "Founder | Nepali Community UK",
  description: "Meet Samir Khatiwada, founder of Nepali Community UK.",
};

async function getFounderImageUrl(): Promise<string | null> {
  const setting = await db.siteSetting.findUnique({
    where: { key: "founder.imageUrl" },
  });
  if (!setting) return null;
  const value = setting.value as { url?: string };
  return value.url ?? null;
}

export default async function FounderPage() {
  const imageUrl = await getFounderImageUrl();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
        <Avatar className="h-32 w-32">
          {imageUrl ? <AvatarImage src={imageUrl} alt="Samir Khatiwada" /> : null}
          <AvatarFallback className="text-3xl">SK</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Samir Khatiwada</h1>
          <p className="text-muted-foreground">Founder, Nepali Community UK</p>
        </div>
      </div>

      <div className="mt-8 space-y-4 text-muted-foreground">
        <p>
          Samir founded Nepali Community UK to give the Nepali diaspora across the
          United Kingdom a single, trusted home online — a place to find jobs, housing,
          events, news, and each other.
        </p>
        <p>
          Get in touch directly at{" "}
          <a href="mailto:sameerkhatiwada4@gmail.com" className="text-primary underline underline-offset-4">
            sameerkhatiwada4@gmail.com
          </a>{" "}
          or{" "}
          <a href="tel:+447426600263" className="text-primary underline underline-offset-4">
            07426 600263
          </a>
          .
        </p>
      </div>
    </div>
  );
}
