"use client";

import { useActionState, useState } from "react";
import { updateProfile, type UpdateProfileActionState } from "@/lib/actions/account";
import { INTERESTS, INTEREST_LABELS } from "@/lib/validation/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const initialState: UpdateProfileActionState = { success: false, message: "" };

type ProfileDetailsFormProps = {
  initialName: string;
  initialEmail: string;
  initialPhone: string;
  initialLocation: string;
  initialInterests: string[];
};

export function ProfileDetailsForm({
  initialName,
  initialEmail,
  initialPhone,
  initialLocation,
  initialInterests,
}: ProfileDetailsFormProps) {
  const [state, formAction, isPending] = useActionState(updateProfile, initialState);

  // Controlled fields: a plain uncontrolled form here would get its inputs
  // snapped back to their page-load values after every successful save
  // (React resets uncontrolled form fields on action success), which looks
  // like the save silently reverted even though it persisted correctly.
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone);
  const [location, setLocation] = useState(initialLocation);
  const [interests, setInterests] = useState<string[]>(initialInterests);

  function toggleInterest(interest: string, checked: boolean) {
    setInterests((prev) => (checked ? [...prev, interest] : prev.filter((i) => i !== interest)));
  }

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

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required />
          <FieldError errors={state.fieldErrors?.name} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <FieldError errors={state.fieldErrors?.email} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Contact number</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <FieldError errors={state.fieldErrors?.phone} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            placeholder="e.g. London"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          <FieldError errors={state.fieldErrors?.location} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Interests</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {interests.map((interest) => (
            <input key={interest} type="hidden" name="interests" value={interest} />
          ))}
          {INTERESTS.map((interest) => (
            <label key={interest} className="flex items-center gap-2 text-sm text-foreground">
              <Checkbox
                checked={interests.includes(interest)}
                onCheckedChange={(checked) => toggleInterest(interest, checked === true)}
              />
              {INTEREST_LABELS[interest]}
            </label>
          ))}
        </div>
        <FieldError errors={state.fieldErrors?.interests} />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="text-sm text-destructive">{errors[0]}</p>;
}
