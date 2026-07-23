import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL,
  // The local `prisma dev` database (used until DIRECT_DATABASE_URL points at a
  // real Postgres) breaks with "Connection terminated unexpectedly" under
  // concurrent connections, so we serialize through a single connection for now.
  // Raise this (e.g. 10) once pointed at a real Postgres instance in production.
  max: 1,
  idleTimeoutMillis: 8000,
});

export const db = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
