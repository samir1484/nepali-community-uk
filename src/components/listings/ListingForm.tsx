"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createListing, type ListingActionState } from "@/lib/actions/listings";
import { JOB_TYPES, ROOM_TYPES, RENT_PERIODS, typeToPath, type ListingTypeValue } from "@/lib/validation/listings";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ListingImageUploader } from "@/components/listings/ListingImageUploader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialState: ListingActionState = { success: false, message: "" };

const JOB_TYPE_LABELS: Record<(typeof JOB_TYPES)[number], string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  TEMPORARY: "Temporary",
  INTERNSHIP: "Internship",
};

const ROOM_TYPE_LABELS: Record<(typeof ROOM_TYPES)[number], string> = {
  SINGLE: "Single room",
  SHARED: "Shared room",
  STUDIO: "Studio",
  WHOLE_PROPERTY: "Whole property",
};

export function ListingForm({ type }: { type: ListingTypeValue }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createListing, initialState);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (state.success) {
      const timeout = setTimeout(() => router.push(`/${typeToPath(type)}`), 1500);
      return () => clearTimeout(timeout);
    }
  }, [state.success, router, type]);

  if (state.success) {
    return (
      <div className="rounded-lg border bg-card p-6 text-center">
        <p className="font-medium text-foreground">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="type" value={type} />

      {state.message && !state.success && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.message}
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required />
        <FieldError errors={state.fieldErrors?.title} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={5} required />
        <FieldError errors={state.fieldErrors?.description} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input id="location" name="location" placeholder="e.g. London" required />
        <FieldError errors={state.fieldErrors?.location} />
      </div>

      <div className="space-y-2">
        <Label>Photos</Label>
        <ListingImageUploader value={images} onChange={setImages} />
      </div>

      {type === "JOB" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input id="company" name="company" required />
            <FieldError errors={state.fieldErrors?.company} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jobType">Job type</Label>
            <Select name="jobType" defaultValue="FULL_TIME">
              <SelectTrigger id="jobType" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {JOB_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {JOB_TYPE_LABELS[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError errors={state.fieldErrors?.jobType} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="salaryRange">Salary range (optional)</Label>
            <Input id="salaryRange" name="salaryRange" placeholder="e.g. £28,000–£32,000" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="applyEmail">Application email (optional)</Label>
            <Input id="applyEmail" name="applyEmail" type="email" />
            <FieldError errors={state.fieldErrors?.applyEmail} />
          </div>
        </>
      )}

      {type === "ROOM" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="rentAmount">Rent amount (£)</Label>
              <Input id="rentAmount" name="rentAmount" type="number" min="0" step="0.01" required />
              <FieldError errors={state.fieldErrors?.rentAmount} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rentPeriod">Rent period</Label>
              <Select name="rentPeriod" defaultValue="MONTHLY">
                <SelectTrigger id="rentPeriod" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RENT_PERIODS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p === "WEEKLY" ? "Weekly" : "Monthly"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="roomType">Room type</Label>
            <Select name="roomType" defaultValue="SINGLE">
              <SelectTrigger id="roomType" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROOM_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {ROOM_TYPE_LABELS[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="availableFrom">Available from (optional)</Label>
            <Input id="availableFrom" name="availableFrom" type="date" />
          </div>
        </>
      )}

      {type === "EVENT" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="startDate">Date</Label>
            <Input id="startDate" name="startDate" type="date" required />
            <FieldError errors={state.fieldErrors?.startDate} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox name="isOnline" />
            This is an online event
          </label>
        </>
      )}

      {type === "VOLUNTEER" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="organization">Organization</Label>
            <Input id="organization" name="organization" required />
            <FieldError errors={state.fieldErrors?.organization} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="commitment">Time commitment</Label>
            <Input id="commitment" name="commitment" placeholder="e.g. 2 hours/week" required />
            <FieldError errors={state.fieldErrors?.commitment} />
          </div>
        </>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="text-sm text-destructive">{errors[0]}</p>;
}
