"use client";

import { useState } from "react";
import Link from "next/link";
import { MenuIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV_LINKS } from "./Header";
import { np } from "@/lib/translations";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className={buttonVariants({ variant: "ghost", size: "icon-sm", className: "xl:hidden" })}
      >
        <MenuIcon />
        <span className="sr-only">Open menu</span>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              {link.label} <span className="font-nepali text-xs text-muted-foreground">{link.labelNp}</span>
            </Link>
          ))}
          <Link
            href="/advertise"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-md border border-primary/40 px-2 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
          >
            Advertise with us{" "}
            <span className="font-nepali text-xs text-muted-foreground">{np.advertise}</span>
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
