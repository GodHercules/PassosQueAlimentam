import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) return NextResponse.json({ error: "Webhook não configurado." }, { status: 503 });

  try {
    const payload = await request.json();
    const idempotencyKey = String(payload.idempotencyKey || crypto.randomUUID());
    const headers: HeadersInit = { "Content-Type": "application/json", "Idempotency-Key": idempotencyKey };
    if (process.env.N8N_WEBHOOK_BEARER_TOKEN) headers.Authorization = `Bearer ${process.env.N8N_WEBHOOK_BEARER_TOKEN}`;

    const response = await fetch(webhookUrl, { method: "POST", headers, body: JSON.stringify({ ...payload, idempotencyKey }), cache: "no-store", signal: AbortSignal.timeout(15000) });
    if (!response.ok) return NextResponse.json({ error: "O serviço de notificações recusou o envio." }, { status: 502 });
    return NextResponse.json({ ok: true, idempotencyKey });
  } catch {
    return NextResponse.json({ error: "Não foi possível enviar a notificação agora." }, { status: 502 });
  }
}
