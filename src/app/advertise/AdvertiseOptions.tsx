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

/** "A", "A and B", "A, B and C" — reads like a person wrote it. */
function listToSentence(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/**
 * The option cards used to be decorative. Selecting them now carries the
 * choices into the enquiry form and scrolls down to it, so the person doesn't
 * have to re-describe what they just clicked.
 *
 * Several options can be picked at once — people commonly want, say, a featured
 * listing *and* event promotion, and forcing one choice made them re-type the
 * rest.
 */
export function AdvertiseOptions() {
  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  // Once someone edits the box themselves, their words win and the generated
  // summary stops rewriting it.
  const [messageEdited, setMessageEdited] = useState(false);

  function toggle(title: string) {
    const next = selected.includes(title)
      ? selected.filter((t) => t !== title)
      : [...selected, title];
    setSelected(next);

    if (!messageEdited) {
      setMessage(next.length === 0 ? "" : `I'm interested in: ${listToSentence(next)}.\n\n`);
    }

    // Only jump to the form on the first pick — scrolling away on every tap
    // would make choosing a second option annoying.
    if (selected.length === 0 && next.length === 1) {
      document.getElementById("advertise-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function handleMessageChange(value: string) {
    setMessageEdited(true);
    setMessage(value);
  }

  return (
    <>
      <h2 className="mt-10 text-xl font-semibold text-foreground">Ways to work with us</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Pick as many as you like — they&apos;ll fill in the form below. Tap again to
        remove one.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {OPTIONS.map((option) => {
          const isSelected = selected.includes(option.title);
          return (
            <button
              key={option.title}
              type="button"
              onClick={() => toggle(option.title)}
              aria-pressed={isSelected}
              className="text-left"
            >
              <Card
                className={cn(
                  "h-full transition-all duration-300 hover:border-primary active:scale-[0.98]",
                  isSelected && "border-primary ring-2 ring-primary/30"
                )}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-foreground">{option.title}</h3>
                    <span
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/40 text-transparent"
                      )}
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{option.description}</p>
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <p className="mt-3 text-sm text-muted-foreground">
          {selected.length} selected —{" "}
          <button
            type="button"
            onClick={() => {
              setSelected([]);
              if (!messageEdited) setMessage("");
            }}
            className="text-primary underline underline-offset-4"
          >
            clear all
          </button>
        </p>
      )}

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
        <AdvertiseForm message={message} onMessageChange={handleMessageChange} />
      </div>
    </>
  );
}
