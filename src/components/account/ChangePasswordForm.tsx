"use client";

import { useActionState } from "react";
import { changePassword, type ChangePasswordActionState } from "@/lib/actions/account";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const initialState: ChangePasswordActionState = { success: false, message: "" };

export function ChangePasswordForm() {
  const [state, formAction, isPending] = useActionState(changePassword, initialState);

  return (
    <form action={formAction} className="space-y-4 rounded-lg border bg-card p-4">
      {state.message && (
        <p
          className={`rounded-md px-3 py-2 text-sm ${
            state.success ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
          }`}
        >
          {state.message}
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current password</Label>
        <Input id="currentPassword" name="currentPassword" type="password" required />
        <FieldError errors={state.fieldErrors?.currentPassword} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">New password</Label>
        <Input id="newPassword" name="newPassword" type="password" required minLength={8} />
        <FieldError errors={state.fieldErrors?.newPassword} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <Input id="confirmPassword" name="confirmPassword" type="password" required minLength={8} />
        <FieldError errors={state.fieldErrors?.confirmPassword} />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Updating..." : "Update password"}
      </Button>
    </form>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="text-sm text-destructive">{errors[0]}</p>;
}
