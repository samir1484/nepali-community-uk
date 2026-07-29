"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Advert } from "@/generated/prisma/client";
import {
  createAdvert,
  updateAdvert,
  deleteAdvert,
  type AdvertActionState,
} from "@/lib/actions/adverts";
import { AD_PLACEMENTS, AD_PLACEMENT_LABELS } from "@/lib/validation/adverts";
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

const emptyDraft = {
  placement: "HOMEPAGE" as (typeof AD_PLACEMENTS)[number],
  title: "",
  body: "",
  imageUrl: "",
  linkUrl: "",
  order: 0,
  isActive: true,
};

type Draft = typeof emptyDraft;

function toDraft(advert: Advert): Draft {
  return {
    placement: advert.placement,
    title: advert.title,
    body: advert.body ?? "",
    imageUrl: advert.imageUrl ?? "",
    linkUrl: advert.linkUrl ?? "",
    order: advert.order,
    isActive: advert.isActive,
  };
}

export function AdvertsManager({ adverts }: { adverts: Advert[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit() {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("placement", draft.placement);
      fd.set("title", draft.title);
      fd.set("body", draft.body);
      fd.set("imageUrl", draft.imageUrl);
      fd.set("linkUrl", draft.linkUrl);
      fd.set("order", String(draft.order));
      if (draft.isActive) fd.set("isActive", "on");

      const initial: AdvertActionState = { success: false, message: "" };
      const result =
        editingId === "new"
          ? await createAdvert(initial, fd)
          : await updateAdvert(editingId as string, initial, fd);

      if (!result.success) {
        setFieldErrors(result.fieldErrors ?? {});
        setMessage({ type: "error", text: result.message });
        return;
      }
      setFieldErrors({});
      setMessage({ type: "success", text: result.message });
      setEditingId(null);
      router.refresh();
    });
  }

  function remove(advert: Advert) {
    if (!window.confirm(`Delete "${advert.title}"? This can't be undone.`)) return;
    startTransition(async () => {
      const result = await deleteAdvert(advert.id);
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
              {editingId === "new" ? "New advert" : "Edit advert"}
            </h2>

            <div className="space-y-2">
              <Label htmlFor="placement">Where it shows</Label>
              <Select
                value={draft.placement}
                onValueChange={(v) => setDraft((d) => ({ ...d, placement: v as Draft["placement"] }))}
              >
                <SelectTrigger id="placement" className="w-full">
                  <SelectValue>
                    {(v) => AD_PLACEMENT_LABELS[v as (typeof AD_PLACEMENTS)[number]]}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {AD_PLACEMENTS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {AD_PLACEMENT_LABELS[p]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Advertiser / headline</Label>
              <Input
                id="title"
                value={draft.title}
                onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              />
              <FieldError errors={fieldErrors.title} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">Short description (optional)</Label>
              <Textarea
                id="body"
                rows={2}
                value={draft.body}
                onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))}
              />
              <FieldError errors={fieldErrors.body} />
            </div>

            <div className="space-y-2">
              <Label>Advert image (optional)</Label>
              <ImageUploader
                value={draft.imageUrl}
                onChange={(url) => setDraft((d) => ({ ...d, imageUrl: url }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkUrl">Link to the advertiser (optional)</Label>
              <Input
                id="linkUrl"
                type="url"
                placeholder="https://"
                value={draft.linkUrl}
                onChange={(e) => setDraft((d) => ({ ...d, linkUrl: e.target.value }))}
              />
              <FieldError errors={fieldErrors.linkUrl} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="order">Order</Label>
                <Input
                  id="order"
                  type="number"
                  min={0}
                  value={draft.order}
                  onChange={(e) => setDraft((d) => ({ ...d, order: Number(e.target.value) }))}
                />
              </div>
              <label className="flex items-end gap-2 pb-2 text-sm text-foreground">
                <Checkbox
                  checked={draft.isActive}
                  onCheckedChange={(c) => setDraft((d) => ({ ...d, isActive: c === true }))}
                />
                Live on the site
              </label>
            </div>

            <div className="flex gap-2">
              <Button onClick={submit} disabled={isPending}>
                {isPending ? "Saving..." : "Save"}
              </Button>
              <Button variant="outline" onClick={() => setEditingId(null)} disabled={isPending}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          onClick={() => {
            setEditingId("new");
            setDraft(emptyDraft);
            setFieldErrors({});
            setMessage(null);
          }}
        >
          New advert
        </Button>
      )}

      <div className="space-y-3">
        {adverts.length === 0 && (
          <p className="text-muted-foreground">
            No adverts yet. Every ad space currently shows a &quot;Your advert could be
            here&quot; card linking to the Advertise page.
          </p>
        )}

        {adverts.map((advert) => (
          <Card key={advert.id}>
            <CardContent className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={advert.isActive ? "default" : "secondary"}>
                    {advert.isActive ? "Live" : "Paused"}
                  </Badge>
                  <Badge variant="outline">{AD_PLACEMENT_LABELS[advert.placement]}</Badge>
                  <span className="font-medium text-foreground">{advert.title}</span>
                </div>
                {advert.body && (
                  <p className="mt-1 truncate text-sm text-muted-foreground">{advert.body}</p>
                )}
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingId(advert.id);
                    setDraft(toDraft(advert));
                    setFieldErrors({});
                    setMessage(null);
                  }}
                  disabled={isPending}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => remove(advert)}
                  disabled={isPending}
                >
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

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="text-sm text-destructive">{errors[0]}</p>;
}
