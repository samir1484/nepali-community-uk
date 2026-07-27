import "server-only";
import { db } from "@/lib/db";

/**
 * Fixed-window rate limiter backed by the database, so the count holds across
 * serverless instances (an in-memory counter would reset per cold start and be
 * trivially bypassed). Call at the top of every public route that accepts
 * unauthenticated input.
 */
export async function checkRateLimit(
  bucketKey: string,
  windowSeconds: number,
  max: number
): Promise<{ allowed: boolean; remaining: number }> {
  const windowStart = new Date(Date.now() - windowSeconds * 1000);

  try {
    const used = await db.rateLimitEvent.count({
      where: { bucketKey, createdAt: { gte: windowStart } },
    });

    if (used >= max) return { allowed: false, remaining: 0 };

    await db.rateLimitEvent.create({ data: { bucketKey } });
    return { allowed: true, remaining: max - used - 1 };
  } catch (err) {
    // Fail open on infrastructure errors rather than locking out real users,
    // but log loudly so it doesn't hide a broken limiter.
    console.error("rate limit check failed", err);
    return { allowed: true, remaining: max };
  }
}

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}
