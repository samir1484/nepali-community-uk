import Link from "next/link";
import Image from "next/image";
import { UserMenu } from "./UserMenu";

const NAV_LINKS = [
  { href: "/jobs", label: "Jobs" },
  { href: "/rooms", label: "Rooms" },
  { href: "/events", label: "Events" },
  { href: "/volunteer", label: "Volunteer" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Nepali Community UK" width={40} height={40} className="h-10 w-10" priority />
          <span className="text-lg font-bold text-foreground">Nepali Community UK</span>
        </Link>

        <nav className="hidden items-center gap-4 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <UserMenu />
      </div>
    </header>
  );
}
