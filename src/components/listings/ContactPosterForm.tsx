"use client";

import { useActionState } from "react";
import { useSession } from "next-auth/react";
import { contactListingPoster, type ContactPosterActionState } from "@/lib/actions/listingContact";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const initialState: ContactPosterActionState = { success: false, message: "" };

export function ContactPosterForm({
  listingId,
  posterName,
}: {
  listingId: string;
  posterName: string;
}) {
  const { data: session } = useSession();
  const action = contactListingPoster.bind(null, listingId);
  const [state, formAction, isPending] = useActionState(action, initialState);

  if (state.success) {
    return (
      <div className="rounded-lg border bg-card p-4 text-sm">
        <p className="font-medium text-foreground">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4 rounded-lg border bg-card p-4">
      <h2 className="font-semibold text-foreground">Contact {posterName}</h2>

      {state.message && !state.success && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.message}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Your name</Label>
          <Input id="contact-name" name="name" defaultValue={session?.user?.name ?? ""} required />
          <FieldError errors={state.fieldErrors?.name} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email">Your email</Label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            defaultValue={session?.user?.email ?? ""}
            required
          />
          <FieldError errors={state.fieldErrors?.email} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea id="contact-message" name="message" rows={4} required />
        <FieldError errors={state.fieldErrors?.message} />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Sending..." : "Send message"}
      </Button>
    </form>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="text-sm text-destructive">{errors[0]}</p>;
}
