"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { HomeSection } from "@/generated/prisma/client";
import { createSection, updateSection, deleteSection, type SectionActionState } from "@/lib/actions/sections";
import { SECTION_TYPES } from "@/lib/validation/sections";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUploader } from "@/components/admin/ImageUploader";

const TYPE_LABELS: Record<(typeof SECTION_TYPES)[number], string> = {
  HIGHLIGHT: "Highlight card (small feature card)",
  SHOWCASE: "Showcase panel (full-bleed photo section)",
};

const emptyDraft = {
  type: "SHOWCASE" as (typeof SECTION_TYPES)[number],
  title: "",
  caption: "",
  imageUrl: "",
  order: 0,
  isActive: true,
};

type Draft = typeof emptyDraft;

function toDraft(section: HomeSection): Draft {
  return {
    type: section.type,
    title: section.title,
    caption: section.caption ?? "",
    imageUrl: section.imageUrl ?? "",
    order: section.order,
    isActive: section.isActive,
  };
}

export function SectionsManager({ sections }: { sections: HomeSection[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const sorted = [...sections].sort((a, b) => a.order - b.order);

  function startCreate() {
    setEditingId("new");
    setDraft(emptyDraft);
    setMessage(null);
  }

  function startEdit(section: HomeSection) {
    setEditingId(section.id);
    setDraft(toDraft(section));
    setMessage(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setMessage(null);
  }

  function buildFormData(): FormData {
    const fd = new FormData();
    fd.set("type", draft.type);
    fd.set("title", draft.title);
    fd.set("caption", draft.caption);
    fd.set("imageUrl", draft.imageUrl);
    fd.set("order", String(draft.order));
    if (draft.isActive) fd.set("isActive", "on");
    return fd;
  }

  function submit() {
    startTransition(async () => {
      const fd = buildFormData();
      const initial: SectionActionState = { success: false, message: "" };
      const result =
        editingId === "new"
          ? await createSection(initial, fd)
          : await updateSection(editingId as string, initial, fd);

      if (!result.success) {
        setMessage({ type: "error", text: result.message });
        return;
      }
      setMessage({ type: "success", text: result.message });
      setEditingId(null);
      router.refresh();
    });
  }

  function remove(section: HomeSection) {
    if (!window.confirm(`Delete "${section.title}"? This can't be undone.`)) return;
    startTransition(async () => {
      const result = await deleteSection(section.id);
      setMessage({ type: result.success ? "success" : "error", text: result.message });
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      {message && (
        <p
          className={`rounded-md px-3 py-2 text-sm ${
            message.type === "success"
              ? "bg-primary/10 text-primary"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {message.text}
        </p>
      )}

      {editingId ? (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <h2 className="font-semibold text-foreground">
              {editingId === "new" ? "New section" : "Edit section"}
            </h2>

            <div className="space-y-2">
              <Label htmlFor="type">Section type</Label>
              <Select
                value={draft.type}
                onValueChange={(v) => setDraft((d) => ({ ...d, type: v as Draft["type"] }))}
              >
                <SelectTrigger id="type" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SECTION_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {TYPE_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={draft.title}
                onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="caption">Caption / description</Label>
              <Textarea
                id="caption"
                rows={3}
                value={draft.caption}
                onChange={(e) => setDraft((d) => ({ ...d, caption: e.target.value }))}
              />
            </div>

            {draft.type === "SHOWCASE" && (
              <div className="space-y-2">
                <Label>Background photo</Label>
                <ImageUploader
                  value={draft.imageUrl}
                  onChange={(url) => setDraft((d) => ({ ...d, imageUrl: url }))}
                />
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="order">Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={draft.order}
                  onChange={(e) => setDraft((d) => ({ ...d, order: Number(e.target.value) }))}
                />
              </div>
              <label className="flex items-center gap-2 pt-6 text-sm">
                <Checkbox
                  checked={draft.isActive}
                  onCheckedChange={(checked) =>
                    setDraft((d) => ({ ...d, isActive: checked === true }))
                  }
                />
                Visible on homepage
              </label>
            </div>

            <div className="flex gap-2">
              <Button type="button" onClick={submit} disabled={isPending}>
                {isPending ? "Saving..." : editingId === "new" ? "Create section" : "Save changes"}
              </Button>
              <Button type="button" variant="outline" onClick={cancelEdit} disabled={isPending}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={startCreate}>Add section</Button>
      )}

      <div className="space-y-3">
        {sorted.length === 0 && (
          <p className="text-sm text-muted-foreground">No sections yet.</p>
        )}
        {sorted.map((section) => (
          <Card key={section.id}>
            <CardContent className="flex items-center justify-between gap-4 pt-6">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Badge variant={section.type === "SHOWCASE" ? "default" : "secondary"}>
                    {section.type}
                  </Badge>
                  {!section.isActive && <Badge variant="outline">Hidden</Badge>}
                  <span className="text-xs text-muted-foreground">order {section.order}</span>
                </div>
                <p className="mt-1 truncate font-medium text-foreground">{section.title}</p>
                {section.caption && (
                  <p className="truncate text-sm text-muted-foreground">{section.caption}</p>
                )}
              </div>
              <div className="flex shrink-0 gap-2">
                <Button size="sm" variant="outline" onClick={() => startEdit(section)}>
                  Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => remove(section)}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
