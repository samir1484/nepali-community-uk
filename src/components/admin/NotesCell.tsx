"use client";

import { useState, useTransition } from "react";
import { updateMessageNotes } from "@/lib/actions/messages";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function toDateInputValue(date: Date | null): string {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

export function NotesCell({
  id,
  initialNotes,
  initialFollowUpAt,
}: {
  id: string;
  initialNotes: string;
  initialFollowUpAt: Date | null;
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [followUpAt, setFollowUpAt] = useState(toDateInputValue(initialFollowUpAt));
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const isOverdue = followUpAt !== "" && new Date(followUpAt) < new Date(new Date().toDateString());

  function save(nextNotes: string, nextFollowUpAt: string) {
    startTransition(async () => {
      await updateMessageNotes(id, nextNotes, nextFollowUpAt);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    });
  }

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <Label htmlFor={`notes-${id}`} className="text-xs text-muted-foreground">
          Notes
        </Label>
        <Textarea
          id={`notes-${id}`}
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => save(notes, followUpAt)}
          placeholder="Private admin notes..."
          className="text-sm"
        />
      </div>
      <div className="flex items-center gap-2">
        <div className="space-y-1">
          <Label htmlFor={`followup-${id}`} className="text-xs text-muted-foreground">
            Follow up
          </Label>
          <Input
            id={`followup-${id}`}
            type="date"
            value={followUpAt}
            onChange={(e) => {
              setFollowUpAt(e.target.value);
              save(notes, e.target.value);
            }}
            className={`text-sm ${isOverdue ? "border-destructive text-destructive" : ""}`}
          />
        </div>
        <span className="mt-4 text-xs text-muted-foreground">
          {isPending ? "Saving..." : saved ? "Saved" : isOverdue ? "Overdue" : ""}
        </span>
      </div>
    </div>
  );
}
