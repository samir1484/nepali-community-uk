"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, GalleryHorizontal, ClipboardList, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/sections", label: "Homepage Sections", icon: GalleryHorizontal, exact: false },
  { href: "/admin/listings", label: "Listings", icon: ClipboardList, exact: false },
  { href: "/admin/users", label: "Users", icon: Users, exact: false },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="w-56 shrink-0 border-r py-8 pr-4">
      <p className="px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Admin
      </p>
      <ul className="mt-3 space-y-1">
        {LINKS.map((link) => {
          const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon size={16} />
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
