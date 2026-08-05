"use client";

import { useActionState } from "react";
import Link from "next/link";
import { resetPassword, type ResetPasswordState } from "@/lib/actions/passwordReset";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const initialState: ResetPasswordState = { success: false, message: "" };

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, isPending] = useActionState(
    resetPassword.bind(null, token),
    initialState
  );

  if (state.success) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <p className="font-medium text-foreground">{state.message}</p>
        <Button className="mt-4" nativeButton={false} render={<Link href="/login">Go to login</Link>} />
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      {state.message && !state.success && (
        <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <p>{state.message}</p>
          {/* An expired or reused link is a dead end without this. */}
          <Link href="/forgot-password" className="mt-1 inline-block underline underline-offset-4">
            Request a new link
          </Link>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="password">New password</Label>
        <Input id="password" name="password" type="password" required minLength={8} />
        <p className="text-xs text-muted-foreground">
          At least 8 characters. Make up a new password for this website — don&apos;t reuse
          your email password.
        </p>
        <FieldError errors={state.fieldErrors?.password} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <Input id="confirmPassword" name="confirmPassword" type="password" required minLength={8} />
        <FieldError errors={state.fieldErrors?.confirmPassword} />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Saving..." : "Set new password"}
      </Button>
    </form>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="text-sm text-destructive">{errors[0]}</p>;
}
