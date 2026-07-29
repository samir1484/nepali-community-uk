"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function UserMenu() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="h-9 w-20" />;
  }

  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" nativeButton={false} render={<Link href="/login">Log in</Link>} />
        <Button nativeButton={false} render={<Link href="/register">Register</Link>} />
      </div>
    );
  }

  // Logging out lives on the My account page rather than the header — it keeps
  // the nav lighter, and it's a deliberate action rather than a one-tap slip.
  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-sm text-muted-foreground sm:inline">
        {session.user?.name}
      </span>
      <Button variant="outline" nativeButton={false} render={<Link href="/account">My account</Link>} />
    </div>
  );
}
