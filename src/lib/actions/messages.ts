"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/rbac";

export async function updateMessageNotes(
  id: string,
  notes: string,
  followUpAt: string
): Promise<{ success: boolean }> {
  await requireAdmin();

  await db.contactMessage.update({
    where: { id },
    data: {
      notes: notes.trim() || null,
      followUpAt: followUpAt ? new Date(followUpAt) : null,
    },
  });

  revalidatePath("/admin/messages");
  return { success: true };
}
