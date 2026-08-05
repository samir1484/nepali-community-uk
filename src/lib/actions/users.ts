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

export async function setUserBlocked(
  userId: string,
  blocked: boolean
): Promise<{ success: boolean; message: string }> {
  const session = await requireAdmin();

  // Blocking yourself would lock you out of the admin area with no way back in.
  if (session.user.id === userId) {
    return { success: false, message: "You can't block your own account." };
  }

  const target = await db.user.findUnique({
    where: { id: userId },
    select: { role: true, name: true },
  });
  if (!target) return { success: false, message: "User not found." };

  // Staff have to be demoted first, so a block can't take out a colleague in
  // a single click.
  if (blocked && (target.role === "ADMIN" || target.role === "MODERATOR")) {
    return { success: false, message: "Change their role to User before blocking them." };
  }

  await db.user.update({
    where: { id: userId },
    data: { isBlocked: blocked, blockedAt: blocked ? new Date() : null },
  });

  revalidatePath("/admin/users");
  return {
    success: true,
    message: blocked ? `${target.name} has been blocked.` : `${target.name} has been unblocked.`,
  };
}
