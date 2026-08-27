import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const adminEmail = (process.env.ADMIN_EMAIL || "admin@corridapassosquealimentam.com.br").trim().toLowerCase();
const cookieName = "pqa-admin-session";

function secret() { return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || process.env.DATABASE_URL || "pqa-admin-development-secret"; }
function sign(value: string) { return createHmac("sha256", secret()).update(value).digest("base64url"); }

export function createAdminSession() {
  const value = Buffer.from(JSON.stringify({ email: adminEmail, expires: Date.now() + 1000 * 60 * 60 * 12 })).toString("base64url");
  return `${value}.${sign(value)}`;
}

export function isValidAdminSession(value?: string) {
  if (!value) return false;
  const separator = value.lastIndexOf(".");
  if (separator <= 0) return false;
  const payload = value.slice(0, separator);
  const signature = value.slice(separator + 1);
  const expected = sign(payload);
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { email?: string; expires?: number };
    return session.email === adminEmail && Number(session.expires) >= Date.now();
  } catch { return false; }
}

export async function hasAdminSession() { return isValidAdminSession((await cookies()).get(cookieName)?.value); }
export { cookieName };
