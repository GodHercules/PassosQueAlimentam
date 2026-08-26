"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Check, Clock3, Flag, MapPin, UserRound } from "lucide-react";

type Registration = { protocol?: string; shirtSize?: string; heardAbout?: string };
type Session = { name?: string; email?: string; birthDate?: string; sex?: string; phone?: string; photo?: string };

export default function Conta() {
  const [registration, setRegistration] = useState<Registration>({});
  const [session, setSession] = useState<Session>({});
  useEffect(() => { try { setRegistration(JSON.parse(window.localStorage.getItem("pqa-demo-registration") || "{}")); setSession(JSON.parse(window.localStorage.getItem("pqa-demo-session") || "{}")); } catch { /* safe empty state */ } }, []);
  function signOut() { window.localStorage.removeItem("pqa-demo-session"); window.localStorage.removeItem("pqa-image-consent"); window.location.href = "/"; }
  function cancelRegistration() { if (!window.confirm("Tem certeza que deseja cancelar sua pré-inscrição?")) return; window.localStorage.removeItem("pqa-demo-registration"); setRegistration({}); }
  return <main className="account-shell account-road-shell">
    <div className="account-route-art" aria-hidden="true"><span/><span/><span/></div>
    <div className="account-runner-scene" aria-hidden="true"><div className="runner-track"><span/><span/><span/></div><Image src="/campaign/runner-cutout.png" alt="Corredor da campanha" width={430} height={760} priority/></div>
    <div className="container account-container">
      <header className="account-head"><Link href="/" className="account-brand"><Image src="/brand/mf-logo.png" alt="MF Medina e Freire Contabilidade" width={180} height={54} priority/></Link><div className="account-actions"><Link href="/" className="button button-secondary">Página inicial</Link><button className="button button-secondary" onClick={signOut}>Sair</button></div></header>
      <div className="account-kicker"><Flag size={14}/> SUA JORNADA · PONTO 02</div><h1>Olá, {session.name || "participante"}.</h1><p className="account-lead">Acompanhe sua inscrição e os próximos passos até a linha de chegada.</p>
      <div className="account-route-line"><span className="active"><b>01</b><small>inscrição</small></span><i/><span className="active"><b>02</b><small>doação</small></span><i/><span><b>03</b><small>confirmar</small></span><i/><span><b>04</b><small>chegada</small></span></div>
      <div className="account-grid"><section className="account-main">
        <article className="status-card race-status"><div className="status-icon"><Check/></div><div><div className="eyebrow">Status atual</div><h2>Pré-inscrição recebida</h2><p>Aguardando entrega da doação para confirmar sua participação.</p></div><strong>{registration.protocol || "PQA-2026-7F3A91C2"}</strong></article>
        <article className="info-card race-details"><div className="card-heading"><span className="account-kicker">SUA INSCRIÇÃO</span><h2>Detalhes da jornada</h2></div><dl><dt>Evento</dt><dd>Passos que Alimentam · 28/11/2026</dd><dt>Local</dt><dd><MapPin size={14}/> Jardim de Alah, Salvador – BA</dd><dt>Percurso</dt><dd>5 km · corrida ou caminhada</dd><dt>Como ficou sabendo</dt><dd>{registration.heardAbout || "Não informado"}</dd><dt>Tamanho da camisa</dt><dd><span className="shirt-badge">{registration.shirtSize || "—"}</span></dd></dl><div className="registration-actions"><button type="button" className="cancel-registration" onClick={cancelRegistration}>Cancelar inscrição</button><Link href="/pre-inscricao" className="edit-registration">Editar inscrição <ArrowRight size={15}/></Link></div></article>
      </section><aside className="profile-card race-profile"><div className="profile-top"><div className="avatar">{session.photo ? <img src={session.photo} alt="Foto do participante" /> : <UserRound />}</div><span className="profile-dot"/></div><div className="account-kicker">PARTICIPANTE</div><h2>{session.name || "Seu perfil"}</h2><p className="muted">{session.email || "Seu acesso está ativo para acompanhar a corrida."}</p><div className="profile-data">{session.phone && <span>Telefone <b>{session.phone}</b></span>}{session.birthDate && <span>Nascimento <b>{new Date(`${session.birthDate}T12:00:00`).toLocaleDateString("pt-BR")}</b></span>}</div><div className="mini-status"><Clock3 size={17}/> Conta ativa</div><Link href="/pre-inscricao" className="button button-primary">Ver minha inscrição <ArrowRight size={16}/></Link></aside></div>
      <div className="account-next"><div><span className="account-kicker">PRÓXIMO MARCO</span><h2>Entregue sua doação e avance na rota.</h2></div><Link href="/pre-inscricao" className="text-link">Revisar inscrição <ArrowRight size={17}/></Link></div>
    </div>
  </main>;
}
