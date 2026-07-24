"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerUser, type RegisterActionState } from "@/lib/actions/auth";
import { INTERESTS, USER_TYPES } from "@/lib/validation/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialState: RegisterActionState = { success: false, message: "" };

const USER_TYPE_LABELS: Record<(typeof USER_TYPES)[number], string> = {
  STUDENT: "Student",
  EMPLOYEE: "Employee",
  EMPLOYER: "Employer",
  LANDLORD: "Landlord",
  TENANT: "Tenant",
  BUSINESS_OWNER: "Business Owner",
  VOLUNTEER: "Volunteer",
  OTHER: "Other",
};

const INTEREST_LABELS: Record<(typeof INTERESTS)[number], string> = {
  JOBS: "Jobs",
  EVENTS: "Events",
  ROOMS: "Rooms",
  BLOGS: "Blogs",
  NEWS: "News",
  HOUSING: "Housing",
  BUSINESS: "Business",
  EDUCATION: "Education",
  FESTIVALS: "Festivals",
  TECHNOLOGY: "Technology",
  HEALTH: "Health",
  SPORTS: "Sports",
  IMMIGRATION: "Immigration",
};

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerUser, initialState);

  if (state.success) {
    return (
      <div className="rounded-lg border bg-card p-6 text-center">
        <p className="font-medium text-foreground">{state.message}</p>
        <Button
          className="mt-4"
          nativeButton={false}
          render={<Link href="/login">Go to login</Link>}
        />
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" required />
          <FieldError errors={state.fieldErrors?.name} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
          <FieldError errors={state.fieldErrors?.email} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required minLength={8} />
          <FieldError errors={state.fieldErrors?.password} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" required />
          <FieldError errors={state.fieldErrors?.phone} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" placeholder="e.g. London" required />
          <FieldError errors={state.fieldErrors?.location} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="occupation">Occupation</Label>
          <Input id="occupation" name="occupation" required />
          <FieldError errors={state.fieldErrors?.occupation} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="address">Address</Label>
          <Input id="address" name="address" placeholder="Street, city, postcode" required />
          <FieldError errors={state.fieldErrors?.address} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="userType">User type</Label>
        <Select name="userType" defaultValue="OTHER">
          <SelectTrigger id="userType" className="w-full">
            <SelectValue placeholder="Select user type" />
          </SelectTrigger>
          <SelectContent>
            {USER_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {USER_TYPE_LABELS[type]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError errors={state.fieldErrors?.userType} />
      </div>

      <div className="space-y-2">
        <Label>Interests</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {INTERESTS.map((interest) => (
            <label
              key={interest}
              className="flex items-center gap-2 text-sm text-foreground"
            >
              <Checkbox name="interests" value={interest} />
              {INTEREST_LABELS[interest]}
            </label>
          ))}
        </div>
        <FieldError errors={state.fieldErrors?.interests} />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Creating account..." : "Create account"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary underline underline-offset-4">
          Log in
        </Link>
      </p>
    </form>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="text-sm text-destructive">{errors[0]}</p>;
}
