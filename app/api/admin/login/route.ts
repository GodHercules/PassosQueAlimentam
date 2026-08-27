import { NextRequest, NextResponse } from "next/server";
import { adminEmail, cookieName, createAdminSession } from "../../../../src/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const email = String(form.get("email") || "").trim().toLowerCase();
  const password = String(form.get("password") || "");
  if (!process.env.ADMIN_PASSWORD) return NextResponse.json({ error: "Admin não configurado." }, { status: 503 });
  if (email !== adminEmail || password !== process.env.ADMIN_PASSWORD) return NextResponse.json({ error: "Credenciais inválidas." }, { status: 401 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookieName, createAdminSession(), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 12 });
  return response;
}
