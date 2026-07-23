import Link from "next/link";
import Image from "next/image";
import { np } from "@/lib/translations";

const COMMUNITY_LINKS = [
  { href: "/jobs", label: "Jobs", labelNp: np.jobs },
  { href: "/rooms", label: "Rooms & Housing", labelNp: np.roomsHousing },
  { href: "/events", label: "Events", labelNp: np.events },
  { href: "/volunteer", label: "Volunteer", labelNp: np.volunteer },
  { href: "/businesses", label: "Business Directory", labelNp: np.business },
];

const COMING_SOON = ["Blogs", "Community News", "Immigration Resources", "Student Support"];

export function Footer() {
  return (
    <footer className="border-t bg-secondary text-secondary-foreground">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="Nepali Community UK" width={32} height={32} className="h-8 w-8" />
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
                  About <span className="font-nepali text-xs text-secondary-foreground/70">{np.about}</span>
                </Link>
              </li>
              <li>
                <Link href="/founder" className="hover:underline">
                  Founder <span className="font-nepali text-xs text-secondary-foreground/70">{np.founder}</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  Contact <span className="font-nepali text-xs text-secondary-foreground/70">{np.contact}</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide">Community</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {COMMUNITY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:underline">
                    {link.label}{" "}
                    <span className="font-nepali text-xs text-secondary-foreground/70">{link.labelNp}</span>
                  </Link>
                </li>
              ))}
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
