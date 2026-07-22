import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NepalFlag } from "@/components/layout/NepalFlag";
import { CultureGallery } from "@/components/home/CultureGallery";
import { firstExistingPublicFile } from "@/lib/media";

const HIGHLIGHTS = [
  {
    title: "Jobs & Careers",
    description: "Find and post job opportunities within the community.",
  },
  {
    title: "Rooms & Housing",
    description: "Browse room listings shared by fellow community members.",
  },
  {
    title: "Events & Festivals",
    description: "Stay up to date with Nepali cultural events across the UK.",
  },
  {
    title: "Business Directory",
    description: "Discover and support Nepali-owned businesses.",
  },
];

export default function Home() {
  const heroVideo = firstExistingPublicFile([
    "images/hero/hero-video.mp4",
    "images/hero/hero-video.webm",
  ]);
  const heroBg = firstExistingPublicFile([
    "images/hero/hero-bg.jpg",
    "images/hero/hero-bg.jpeg",
    "images/hero/hero-bg.png",
    "images/hero/hero-bg.webp",
  ]);
  const flagGif = firstExistingPublicFile([
    "images/hero/flag.gif",
    "images/hero/flag.webp",
  ]);

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-crimson/10 via-background to-brand-blue/10">
        {heroVideo ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={heroBg ? `/${heroBg}` : undefined}
          >
            <source src={`/${heroVideo}`} />
          </video>
        ) : heroBg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/${heroBg}`}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
        {(heroVideo || heroBg) && (
          <div className="absolute inset-0 bg-background/80" />
        )}

        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:grid-cols-2 sm:items-center">
          <div className="text-center sm:text-left">
            <h1 className="max-w-xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              The UK&apos;s largest digital platform for the Nepali community
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">
              Connect with jobs, housing, events, news, and businesses built by and for
              the Nepali community across the United Kingdom.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:justify-start">
              <Button
                size="lg"
                nativeButton={false}
                render={<Link href="/register">Join the community</Link>}
              />
              <Button
                size="lg"
                variant="outline"
                nativeButton={false}
                render={<Link href="/about">Learn more</Link>}
              />
            </div>
          </div>

          <div className="flex justify-center sm:justify-end">
            {flagGif ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/${flagGif}`}
                alt="Flag of Nepal"
                className="h-48 w-40 object-contain drop-shadow-xl sm:h-64 sm:w-52"
              />
            ) : (
              <div style={{ perspective: "300px" }}>
                <NepalFlag className="h-48 w-40 drop-shadow-xl sm:h-64 sm:w-52" />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold text-foreground">
          Everything the community needs, in one place
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HIGHLIGHTS.map((item) => (
            <Card key={item.title}>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          These modules are launching soon — register now to be notified when they go
          live.
        </p>
      </section>

      <CultureGallery />

      <section className="border-t bg-secondary/40">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-16 text-center sm:flex-row sm:text-left">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground">Meet our founder</h2>
            <p className="mt-2 text-muted-foreground">
              Nepali Community UK was founded by Samir Khatiwada to bring the Nepali
              diaspora across the UK closer together.
            </p>
          </div>
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/founder">Read the story</Link>}
          />
        </div>
      </section>
    </div>
  );
}
