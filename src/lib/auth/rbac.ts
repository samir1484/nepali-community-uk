import "server-only";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export class NotAuthorizedError extends Error {
  constructor() {
    super("Not authorized");
    this.name = "NotAuthorizedError";
  }
}

/**
 * Sessions are JWTs, so blocking someone doesn't invalidate the token they're
 * already holding — it would keep working until it expired. Every privileged
 * action therefore re-checks the flag against the database rather than
 * trusting the session, which makes a block bite on the blocked user's very
 * next action instead of days later.
 */
async function assertNotBlocked(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { isBlocked: true },
  });
  if (!user || user.isBlocked) throw new NotAuthorizedError();
}

/** Any signed-in member who isn't blocked. */
export async function requireActiveUser() {
  const session = await auth();
  if (!session?.user?.id) throw new NotAuthorizedError();
  await assertNotBlocked(session.user.id);
  return session;
}

export async function requireAdmin() {
  const session = await auth();
  const role = session?.user?.role;

  if (!session?.user?.id || (role !== "ADMIN" && role !== "MODERATOR")) {
    throw new NotAuthorizedError();
  }

  await assertNotBlocked(session.user.id);
  return session;
}
