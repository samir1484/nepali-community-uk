"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { SocialLink } from "@/generated/prisma/client";
import {
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
  type SocialLinkActionState,
} from "@/lib/actions/social";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";

const emptyDraft = { platform: "", url: "", order: 0, isActive: true };
type Draft = typeof emptyDraft;

function toDraft(link: SocialLink): Draft {
  return { platform: link.platform, url: link.url, order: link.order, isActive: link.isActive };
}

export function SocialLinksManager({ links }: { links: SocialLink[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const sorted = [...links].sort((a, b) => a.order - b.order);

  function startCreate() {
    setEditingId("new");
    setDraft(emptyDraft);
    setMessage(null);
  }

  function startEdit(link: SocialLink) {
    setEditingId(link.id);
    setDraft(toDraft(link));
    setMessage(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setMessage(null);
  }

  function buildFormData(): FormData {
    const fd = new FormData();
    fd.set("platform", draft.platform);
    fd.set("url", draft.url);
    fd.set("order", String(draft.order));
    if (draft.isActive) fd.set("isActive", "on");
    return fd;
  }

  function submit() {
    startTransition(async () => {
      const fd = buildFormData();
      const initial: SocialLinkActionState = { success: false, message: "" };
      const result =
        editingId === "new" ? await createSocialLink(initial, fd) : await updateSocialLink(editingId as string, initial, fd);

      if (!result.success) {
        setMessage({ type: "error", text: result.message });
        return;
      }
      setMessage({ type: "success", text: result.message });
      setEditingId(null);
      router.refresh();
    });
  }

  function remove(link: SocialLink) {
    if (!window.confirm(`Delete the "${link.platform}" link?`)) return;
    startTransition(async () => {
      const result = await deleteSocialLink(link.id);
      setMessage({ type: result.success ? "success" : "error", text: result.message });
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      {message && (
        <p
          className={`rounded-md px-3 py-2 text-sm ${
            message.type === "success" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
          }`}
        >
          {message.text}
        </p>
      )}

      {editingId ? (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="platform">Platform name</Label>
                <Input
                  id="platform"
                  placeholder="Facebook, Instagram, WhatsApp..."
                  value={draft.platform}
                  onChange={(e) => setDraft((d) => ({ ...d, platform: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  placeholder="https://..."
                  value={draft.url}
                  onChange={(e) => setDraft((d) => ({ ...d, url: e.target.value }))}
                />
              </div>
            </div>

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
                  onCheckedChange={(checked) => setDraft((d) => ({ ...d, isActive: checked === true }))}
                />
                Visible in footer
              </label>
            </div>

            <div className="flex gap-2">
              <Button type="button" onClick={submit} disabled={isPending}>
                {isPending ? "Saving..." : editingId === "new" ? "Add link" : "Save changes"}
              </Button>
              <Button type="button" variant="outline" onClick={cancelEdit} disabled={isPending}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={startCreate}>Add social link</Button>
      )}

      <div className="space-y-3">
        {sorted.length === 0 && <p className="text-sm text-muted-foreground">No social links yet.</p>}
        {sorted.map((link) => (
          <Card key={link.id}>
            <CardContent className="flex items-center justify-between gap-4 pt-6">
              <div className="min-w-0">
                <p className="font-medium text-foreground">
                  {link.platform} {!link.isActive && <span className="text-xs text-muted-foreground">(hidden)</span>}
                </p>
                <p className="truncate text-sm text-muted-foreground">{link.url}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button size="sm" variant="outline" onClick={() => startEdit(link)}>
                  Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => remove(link)}>
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
