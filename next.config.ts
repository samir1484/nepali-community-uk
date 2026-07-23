import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The local dev database (`prisma dev`) can't handle concurrent connections —
  // static generation's parallel workers each open their own DB connection, which
  // otherwise intermittently breaks the build. Force serial generation until
  // DIRECT_DATABASE_URL points at a real Postgres instance.
  experimental: {
    cpus: 1,
  },
};

export default nextConfig;
