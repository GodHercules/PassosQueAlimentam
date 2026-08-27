import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../src/lib/supabase/server";
import { createAdminClient } from "../../src/lib/supabase/admin";

type Registration = { id: string; protocol: string; status: string; shirt_size: string; submitted_at: string | null; profiles: { full_name: string; phone_e164: string | null } | null; events: { location: string } | null };
const adminEmail = (process.env.ADMIN_EMAIL || "admin@corridapassosquealimentam.com.br").toLowerCase();
const labels: Record<string, string> = { PRE_REGISTERED: "Aguardando doação", DONATION_RECEIVED: "Doação recebida", CONFIRMED: "Confirmado", AWAITING_GUARDIAN_CONSENT: "Responsável pendente", DRAFT: "Rascunho" };
const tone = (status: string) => status === "CONFIRMED" ? "green" : status === "DONATION_RECEIVED" ? "blue" : "orange";

export default async function Admin() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return <AdminMessage title="Conecte o banco para abrir o painel." text="Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no ambiente do servidor." />;
  const auth = await createClient(); const { data: { user } } = await auth.auth.getUser();
  if (!user) redirect("/admin/login");
  if ((user.email || "").toLowerCase() !== adminEmail) redirect("/");
  const admin = createAdminClient(); if (!admin) return <AdminMessage title="Conecte o banco para abrir o painel." text="Defina NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY e SUPABASE_SERVICE_ROLE_KEY no ambiente do servidor." />;
  const { data, error } = await admin.from("registrations").select("id, protocol, status, shirt_size, submitted_at, profiles(full_name, phone_e164), events(location)").order("created_at", { ascending: false });
  if (error) return <AdminMessage title="Não conseguimos atualizar o painel." text="Verifique a migração e as políticas do Supabase antes de tentar novamente." />;
  const rows = (data || []) as unknown as Registration[];
  const counts = rows.reduce((a, r) => { a.total++; a[r.status] = (a[r.status] || 0) + 1; a[r.shirt_size] = (a[r.shirt_size] || 0) + 1; return a; }, { total: 0 } as Record<string, number>);
  const max = Math.max(1, ...["PRE_REGISTERED", "DONATION_RECEIVED", "CONFIRMED", "AWAITING_GUARDIAN_CONSENT"].map((s) => counts[s] || 0));
  const maxShirt = Math.max(1, ...["P", "M", "G", "GG"].map((s) => counts[s] || 0));
  return <main className="admin-shell"><div className="container">
    <header className="account-head"><Link href="/" className="brand"><span className="brand-mark">MF</span> Painel administrativo</Link><div className="admin-head-actions"><span className="admin-user">{user.email}</span><form action="/api/admin/signout" method="post"><button className="button button-secondary" type="submit">Sair</button></form></div></header>
    <div className="admin-kicker">DADOS EM TEMPO REAL · INSCRIÇÕES</div><h1>Visão da corrida.</h1><p className="muted">Acompanhe o ritmo das pré-inscrições, doações e confirmações em um só lugar.</p>
    <div className="admin-stats"><div><small>Total de inscrições</small><strong>{counts.total}</strong><span>registros no banco</span></div><div><small>Aguardando doação</small><strong>{counts.PRE_REGISTERED || 0}</strong><span>próximo passo</span></div><div><small>Confirmados</small><strong>{counts.CONFIRMED || 0}</strong><span>participação validada</span></div></div>
    <div className="admin-dashboard-grid"><section className="admin-panel chart-panel"><div className="panel-head"><div><small className="panel-kicker">FLUXO DA JORNADA</small><h2>Status das inscrições</h2></div><span className="live-dot">● ao vivo</span></div><div className="status-bars">{[["PRE_REGISTERED", "Pré-inscritas", "orange"], ["DONATION_RECEIVED", "Doação recebida", "blue"], ["CONFIRMED", "Confirmadas", "green"], ["AWAITING_GUARDIAN_CONSENT", "Responsável pendente", "orange"]].map(([key, label, color]) => <div className="status-bar" key={key}><div><span>{label}</span><b>{counts[key] || 0}</b></div><div className="bar-track"><i className={color} style={{ width: `${((counts[key] || 0) / max) * 100}%` }} /></div></div>)}</div></section><section className="admin-panel shirt-chart"><div className="panel-head"><div><small className="panel-kicker">TAMANHOS</small><h2>Camisas</h2></div></div><div className="shirt-visual">{["P", "M", "G", "GG"].map((size) => <div key={size}><div className="shirt-column"><i style={{ height: `${Math.max(8, ((counts[size] || 0) / maxShirt) * 100)}%` }} /></div><b>{counts[size] || 0}</b><span>{size}</span></div>)}</div></section></div>
    <section className="admin-panel admin-table-panel"><div className="panel-head"><div><small className="panel-kicker">ÚLTIMOS REGISTROS</small><h2>Participantes</h2></div><span className="admin-count">{rows.length} total</span></div><div className="table-wrap"><table><thead><tr><th>Participante</th><th>Protocolo</th><th>Contato</th><th>Status</th><th>Camisa</th></tr></thead><tbody>{rows.length ? rows.slice(0, 50).map((r) => <tr key={r.id}><td><strong>{r.profiles?.full_name || "Sem nome"}</strong><small>{r.events?.location || "Evento não informado"}</small></td><td>{r.protocol}</td><td>{r.profiles?.phone_e164 || "—"}</td><td><span className={`badge ${tone(r.status)}`}>{labels[r.status] || r.status}</span></td><td>{r.shirt_size}</td></tr>) : <tr><td colSpan={5} className="empty-state">Nenhuma inscrição encontrada.</td></tr>}</tbody></table></div></section>
    <p className="admin-note">Dados protegidos por autenticação. A chave de serviço é usada somente no servidor e nunca é enviada ao navegador.</p>
  </div></main>;
}

function AdminMessage({ title, text }: { title: string; text: string }) { return <main className="admin-shell"><div className="container"><div className="admin-error"><div className="admin-kicker">CONFIGURAÇÃO NECESSÁRIA</div><h1>{title}</h1><p>{text}</p><Link href="/" className="button button-secondary">Voltar ao site</Link></div></div></main>; }
