"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/rbac";

const ROLES = ["USER", "MODERATOR", "ADMIN"] as const;

export async function updateUserRole(
  userId: string,
  role: string
): Promise<{ success: boolean; message: string }> {
  await requireAdmin();

  if (!ROLES.includes(role as (typeof ROLES)[number])) {
    return { success: false, message: "Invalid role." };
  }

  await db.user.update({
    where: { id: userId },
    data: { role: role as (typeof ROLES)[number] },
  });

  revalidatePath("/admin/users");
  return { success: true, message: "Role updated." };
}
