import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const adminEmail = (process.env.ADMIN_EMAIL || "admin@corridapassosquealimentam.com.br").trim().toLowerCase();
const cookieName = "pqa-admin-session";

function secret() { return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || process.env.DATABASE_URL || "pqa-admin-development-secret"; }
function sign(value: string) { return createHmac("sha256", secret()).update(value).digest("base64url"); }

export function createAdminSession() {
  const value = `${adminEmail}.${Date.now() + 1000 * 60 * 60 * 12}`;
  return `${value}.${sign(value)}`;
}

export function isValidAdminSession(value?: string) {
  if (!value) return false;
  const [email, expires, signature] = value.split(".");
  const payload = `${email}.${expires}`;
  if (email !== adminEmail || !expires || !signature || Number(expires) < Date.now()) return false;
  const expected = sign(payload);
  return signature.length === expected.length && timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export async function hasAdminSession() { return isValidAdminSession((await cookies()).get(cookieName)?.value); }
export { cookieName };
