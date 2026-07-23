import "server-only";
import { auth } from "@/auth";

export class NotAuthorizedError extends Error {
  constructor() {
    super("Not authorized");
    this.name = "NotAuthorizedError";
  }
}

export async function requireAdmin() {
  const session = await auth();
  const role = session?.user?.role;

  if (!session?.user || (role !== "ADMIN" && role !== "MODERATOR")) {
    throw new NotAuthorizedError();
  }

  return session;
}
