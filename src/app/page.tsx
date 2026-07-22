import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PennantMotif } from "@/components/layout/PennantMotif";

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
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-crimson/10 via-background to-brand-blue/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-20 text-center">
          <PennantMotif className="h-16 w-32" />
          <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            The UK&apos;s largest digital platform for the Nepali community
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Connect with jobs, housing, events, news, and businesses built by and for
            the Nepali community across the United Kingdom.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
