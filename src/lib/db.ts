import { Pool } from "pg";

const globalForDb = globalThis as unknown as { pqaPool?: Pool };

export function getDb() {
  const rawConnectionString = process.env.DATABASE_URL;
  if (!rawConnectionString) return null;

  // pg lets `sslmode=require` from the connection string override the SSL
  // object. DigitalOcean's managed certificate needs the explicit runtime
  // option below, while Prisma continues to use the original DATABASE_URL.
  const connectionString = new URL(rawConnectionString);
  connectionString.searchParams.delete("sslmode");
  globalForDb.pqaPool ??= new Pool({ connectionString: connectionString.toString(), max: 5, idleTimeoutMillis: 10000, connectionTimeoutMillis: 10000, ssl: { rejectUnauthorized: false } });
  return globalForDb.pqaPool;
}
