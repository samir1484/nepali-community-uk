import Link from "next/link";
import Image from "next/image";
import { UserMenu } from "./UserMenu";
import { np } from "@/lib/translations";

const NAV_LINKS = [
  { href: "/jobs", label: "Jobs", labelNp: np.jobs },
  { href: "/rooms", label: "Rooms", labelNp: np.rooms },
  { href: "/events", label: "Events", labelNp: np.events },
  { href: "/volunteer", label: "Volunteer", labelNp: np.volunteer },
  { href: "/businesses", label: "Businesses", labelNp: np.business },
  { href: "/about", label: "About", labelNp: np.about },
  { href: "/contact", label: "Contact", labelNp: np.contact },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Nepali Community UK" width={40} height={40} className="h-10 w-10" priority />
          <span className="text-lg font-bold text-foreground">Nepali Community UK</span>
        </Link>

        <nav className="hidden items-center gap-3 xl:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label} <span className="font-nepali text-xs">{link.labelNp}</span>
            </Link>
          ))}
        </nav>

        <UserMenu />
      </div>
    </header>
  );
}
