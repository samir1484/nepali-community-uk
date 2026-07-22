"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { sendContactMessage, type ContactActionState } from "@/lib/actions/contact";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const initialState: ContactActionState = { success: false, message: "" };

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(sendContactMessage, initialState);

  useEffect(() => {
    if (state.message && state.success) {
      toast.success(state.message);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-6">
      {state.message && !state.success && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.message}
        </p>
      )}
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required />
        <FieldError errors={state.fieldErrors?.name} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
        <FieldError errors={state.fieldErrors?.email} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" rows={5} required />
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
