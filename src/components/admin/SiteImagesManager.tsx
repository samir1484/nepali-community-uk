"use client";

import { useState, useTransition } from "react";
import { setSiteImage } from "@/lib/actions/settings";
import { IMAGE_SETTINGS, type ImageSettingKey } from "@/lib/siteImageSettings";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Label } from "@/components/ui/label";

export function SiteImagesManager({ current }: { current: Record<string, string> }) {
  const [values, setValues] = useState<Record<string, string>>(current);
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleChange(key: ImageSettingKey, url: string) {
    const fallback = IMAGE_SETTINGS.find((s) => s.key === key)?.default ?? "";
    setValues((v) => ({ ...v, [key]: url || fallback }));
    startTransition(async () => {
      await setSiteImage(key, url);
      setSavedKey(key);
      setTimeout(() => setSavedKey((k) => (k === key ? null : k)), 1500);
    });
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {IMAGE_SETTINGS.map((setting) => (
        <div key={setting.key} className="space-y-2 rounded-lg border bg-card p-4">
          <Label>{setting.label}</Label>
          <ImageUploader
            value={values[setting.key] ?? setting.default}
            onChange={(url) => handleChange(setting.key, url)}
          />
          <p className="text-xs text-muted-foreground">
            {isPending && savedKey === setting.key
              ? "Saving..."
              : savedKey === setting.key
                ? "Saved"
                : setting.default
                  ? `Default: ${setting.default}`
                  : "No default — shows a placeholder until set"}
          </p>
        </div>
      ))}
    </div>
  );
}
