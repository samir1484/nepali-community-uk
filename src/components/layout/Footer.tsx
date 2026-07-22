import Link from "next/link";
import { PennantMotif } from "./PennantMotif";

const COMING_SOON = [
  "Jobs",
  "Room Listings",
  "Events",
  "Blogs",
  "Community News",
  "Business Directory",
  "Volunteer Portal",
  "Immigration Resources",
  "Student Support",
];

export function Footer() {
  return (
    <footer className="border-t bg-secondary text-secondary-foreground">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <PennantMotif className="h-6 w-12" />
              <span className="font-bold">Nepali Community UK</span>
            </div>
            <p className="mt-3 text-sm text-secondary-foreground/80">
              The UK&apos;s largest digital platform for the Nepali community.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide">Site</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:underline">
                  About
                </Link>
              </li>
              <li>
                <Link href="/founder" className="hover:underline">
                  Founder
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide">Coming soon</h3>
            <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm text-secondary-foreground/80">
              {COMING_SOON.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-secondary-foreground/20 pt-6 text-xs text-secondary-foreground/70">
          © {new Date().getFullYear()} Nepali Community UK. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
