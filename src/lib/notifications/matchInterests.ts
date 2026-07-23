import "server-only";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email/mailer";
import { listingMatchTemplate } from "@/lib/email/templates/listingMatch";
import { typeToPath, typeLabel } from "@/lib/validation/listings";
import type { Listing, Interest } from "@/generated/prisma/client";

const TYPE_INTERESTS: Record<Listing["type"], Interest[]> = {
  JOB: ["JOBS"],
  ROOM: ["ROOMS", "HOUSING"],
  EVENT: ["EVENTS"],
  BUSINESS: ["BUSINESS"],
  VOLUNTEER: [],
};

/**
 * Emails every user whose registered interests match an approved listing.
 * Idempotent via NotificationLog — safe to call more than once for the same listing.
 */
export async function notifyMatchingUsers(listing: Listing): Promise<void> {
  const interests = TYPE_INTERESTS[listing.type];
  if (interests.length === 0) return;

  const matchingUsers = await db.user.findMany({
    where: {
      interests: { hasSome: interests },
      id: { not: listing.authorId },
    },
    select: { id: true, name: true, email: true },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const listingUrl = `${appUrl}/${typeToPath(listing.type)}/${listing.id}`;

  for (const user of matchingUsers) {
    try {
      const alreadyNotified = await db.notificationLog.findUnique({
        where: { listingId_userId: { listingId: listing.id, userId: user.id } },
      });
      if (alreadyNotified) continue;

      const { subject, html } = listingMatchTemplate({
        userName: user.name,
        listingTitle: listing.title,
        typeLabel: typeLabel(listing.type),
        location: listing.location,
        listingUrl,
      });

      await sendEmail({ to: user.email, subject, html });

      await db.notificationLog.create({
        data: { listingId: listing.id, userId: user.id },
      });
    } catch (error) {
      // One failed email shouldn't block the rest of the batch or the approval itself.
      console.error(`Failed to notify user ${user.id} about listing ${listing.id}:`, error);
    }
  }
}
