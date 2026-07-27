"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { sendAdvertiseEnquiry, type AdvertiseActionState } from "@/lib/actions/advertise";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const initialState: AdvertiseActionState = { success: false, message: "" };

export function AdvertiseForm() {
  const [state, formAction, isPending] = useActionState(sendAdvertiseEnquiry, initialState);

  useEffect(() => {
    if (state.message && state.success) toast.success(state.message);
  }, [state]);

  if (state.success) {
    return (
      <div className="rounded-lg border bg-card p-6 text-center">
        <p className="font-medium text-foreground">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6 rounded-lg border bg-card p-6">
      {state.message && !state.success && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.message}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Your name</Label>
          <Input id="name" name="name" required />
          <FieldError errors={state.fieldErrors?.name} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
          <FieldError errors={state.fieldErrors?.email} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="organisation">Business or organisation</Label>
          <Input id="organisation" name="organisation" required />
          <FieldError errors={state.fieldErrors?.organisation} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="websiteUrl">Website (optional)</Label>
          <Input id="websiteUrl" name="websiteUrl" type="url" placeholder="https://" />
          <FieldError errors={state.fieldErrors?.websiteUrl} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="budget">Approximate budget (optional)</Label>
        <Input id="budget" name="budget" placeholder="e.g. £100 per month" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">What would you like to promote?</Label>
        <Textarea id="message" name="message" rows={5} required />
        <FieldError errors={state.fieldErrors?.message} />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Sending..." : "Send enquiry"}
      </Button>
    </form>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="text-sm text-destructive">{errors[0]}</p>;
}
