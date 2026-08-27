import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../../../src/lib/db";
import { hasAdminSession } from "../../../../../src/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await hasAdminSession())) return NextResponse.redirect(new URL("/admin/login", request.url));
  const db = getDb();
  if (!db) return NextResponse.json({ error: "Banco não configurado." }, { status: 503 });
  const { id } = await params;
  await db.query("update public.registrations set status='DONATION_RECEIVED',updated_at=now() where id=$1 and status='PRE_REGISTERED'", [id]);
  return NextResponse.redirect(new URL("/admin", request.url));
}
