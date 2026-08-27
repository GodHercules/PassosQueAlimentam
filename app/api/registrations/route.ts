import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../src/lib/db";

export async function POST(request: NextRequest) {
  const db = getDb();
  if (!db) return NextResponse.json({ error: "Banco de dados não configurado." }, { status: 503 });
  try {
    const body = await request.json();
    const participant = body.participant || {};
    const answers = body.answers || {};
    const consent = body.consents?.[0];
    const email = String(participant.email || "").trim().toLowerCase();
    const fullName = String(participant.fullName || "Participante").trim();
    if (!email || !fullName || !answers.shirtSize || !answers.heardAbout) return NextResponse.json({ error: "Dados obrigatórios ausentes." }, { status: 400 });
    const client = await db.connect();
    try {
      await client.query("begin");
      const user = await client.query("insert into public.users(id,email,email_confirmed_at) values($1,$2,now()) on conflict(email) do update set email=excluded.email returning id", [crypto.randomUUID(), email]);
      const userId = user.rows[0].id;
      await client.query("insert into public.profiles(id,full_name,phone_e164,sex,birth_date,profile_completed_at,updated_at) values($1,$2,$3,$4,$5,now(),now()) on conflict(id) do update set full_name=excluded.full_name,phone_e164=excluded.phone_e164,sex=excluded.sex,birth_date=excluded.birth_date,profile_completed_at=now(),updated_at=now()", [userId, fullName, participant.phone || null, participant.sex || null, participant.birthDate || null]);
      const event = await client.query("select id from public.events where slug=$1 and status='OPEN'", ["passos-que-alimentam-2026"]);
      if (!event.rows[0]) throw new Error("event_not_found");
      const protocol = String(body.registration?.protocol || `PQA-2026-${crypto.randomUUID().slice(0, 8).toUpperCase()}`);
      const inserted = await client.query("insert into public.registrations(id,protocol,event_id,user_id,referral_source,referrer_name,shirt_size,created_at,updated_at) values($1,$2,$3,$4,$5,$6,$7,now(),now()) on conflict(event_id,user_id) do update set protocol=excluded.protocol,referral_source=excluded.referral_source,referrer_name=excluded.referrer_name,shirt_size=excluded.shirt_size,updated_at=now() returning protocol", [crypto.randomUUID(), protocol, event.rows[0].id, userId, answers.heardAbout, answers.referrerName || null, answers.shirtSize]);
      if (consent?.type) await client.query("insert into public.consents(id,user_id,consent_type,version) values($1,$2,$3,$4) on conflict do nothing", [crypto.randomUUID(), userId, consent.type, consent.version || "1.1"]);
      await client.query("commit");
      return NextResponse.json({ ok: true, protocol: inserted.rows[0].protocol });
    } catch (error) { await client.query("rollback"); throw error; } finally { client.release(); }
  } catch (error) { console.error("registration_create_failed", error); return NextResponse.json({ error: "Não foi possível salvar a candidatura." }, { status: 500 }); }
}
