"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset, type RequestResetState } from "@/lib/actions/passwordReset";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const initialState: RequestResetState = { success: false, message: "" };

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(requestPasswordReset, initialState);

  if (state.success) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <p className="font-medium text-foreground">{state.message}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          The link works once and expires in an hour.
        </p>
        <Button className="mt-4" nativeButton={false} render={<Link href="/login">Back to login</Link>} />
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      {state.message && !state.success && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.message}
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="you@example.com" required />
        <p className="text-xs text-muted-foreground">
          The email address you registered with on this website.
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Sending..." : "Send reset link"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Remembered it?{" "}
        <Link href="/login" className="text-primary underline underline-offset-4">
          Log in
        </Link>
      </p>
    </form>
  );
}
