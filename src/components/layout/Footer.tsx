import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { db } from "@/lib/db";
import { np } from "@/lib/translations";

const COMMUNITY_LINKS = [
  { href: "/jobs", label: "Jobs", labelNp: np.jobs },
  { href: "/rooms", label: "Rooms & Housing", labelNp: np.roomsHousing },
  { href: "/events", label: "Events", labelNp: np.events },
  { href: "/volunteer", label: "Volunteer", labelNp: np.volunteer },
  { href: "/businesses", label: "Business Directory", labelNp: np.business },
];

const COMING_SOON = ["Blogs", "Community News", "Immigration Resources", "Student Support"];

export async function Footer() {
  const socialLinks = await db.socialLink.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  return (
    <footer className="relative overflow-hidden border-t bg-secondary text-secondary-foreground">
      <Image
        src="/images/footer/flags.jpg"
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-secondary/85" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-4 py-12">
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

        {socialLinks.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-3 border-t border-secondary-foreground/20 pt-6">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-secondary-foreground/30 px-3 py-1.5 text-xs font-medium transition-all duration-300 hover:bg-secondary-foreground/10 active:scale-95"
              >
                {link.platform}
                <ExternalLink size={12} />
              </a>
            ))}
          </div>
        )}

        <div
          className={`text-xs text-secondary-foreground/70 ${
            socialLinks.length > 0 ? "mt-6" : "mt-10 border-t border-secondary-foreground/20 pt-6"
          }`}
        >
          © {new Date().getFullYear()} Nepali Community UK. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
