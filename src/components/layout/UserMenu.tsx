"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
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

  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-sm text-muted-foreground sm:inline">
        {session.user?.name}
      </span>
      <Button variant="ghost" nativeButton={false} render={<Link href="/account">My account</Link>} />
      <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>
        Log out
      </Button>
    </div>
  );
}
