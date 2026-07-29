"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AdvertiseForm } from "./AdvertiseForm";

const OPTIONS = [
  {
    title: "Featured business listing",
    description:
      "Get your business pinned to the top of the Business Directory, with photos, services and a link to your own website.",
  },
  {
    title: "Event promotion",
    description:
      "Put your event in front of members who have told us they're interested in Nepali events — including an email alert when it goes live.",
  },
  {
    title: "Sponsored article",
    description:
      "Tell your story properly with a dedicated post in our News & Blog section, shareable across the community.",
  },
  {
    title: "Homepage placement",
    description:
      "A banner or highlight card on the homepage, seen by everyone who visits Nepali Community UK.",
  },
];

/**
 * The option cards used to be decorative. Selecting one now carries the choice
 * into the enquiry form and scrolls down to it, so the person doesn't have to
 * re-describe what they just clicked.
 */
export function AdvertiseOptions() {
  const [selected, setSelected] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  function choose(title: string) {
    setSelected(title);
    // Only prefill an untouched box — never overwrite what someone has typed.
    if (!message.trim()) setMessage(`I'm interested in: ${title}.\n\n`);
    document.getElementById("advertise-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <h2 className="mt-10 text-xl font-semibold text-foreground">Ways to work with us</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Pick the one closest to what you have in mind — it&apos;ll fill in the form below.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {OPTIONS.map((option) => {
          const isSelected = selected === option.title;
          return (
            <button key={option.title} type="button" onClick={() => choose(option.title)} className="text-left">
              <Card
                className={cn(
                  "h-full transition-all duration-300 hover:border-primary active:scale-[0.98]",
                  isSelected && "border-primary ring-2 ring-primary/30"
                )}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-foreground">{option.title}</h3>
                    {isSelected && (
                      <span className="shrink-0 rounded-full bg-primary px-2 py-0.5 text-[11px] font-medium text-primary-foreground">
                        Selected
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{option.description}</p>
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        Pricing depends on what you need and how long you&apos;d like to run it — budgets
        start around £20 a month. Tell us what you have in mind and we&apos;ll come back
        with options. We&apos;re happy to work with small local businesses as well as
        larger organisations.
      </p>

      <h2 id="advertise-form" className="mt-10 scroll-mt-24 text-xl font-semibold text-foreground">
        Get in touch
      </h2>
      <div className="mt-4">
        <AdvertiseForm message={message} onMessageChange={setMessage} />
      </div>
    </>
  );
}
