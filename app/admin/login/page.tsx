"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, LockKeyhole } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter(); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setError(""); setLoading(true); const form = new FormData(event.currentTarget); const response = await fetch("/api/admin/login", { method: "POST", body: form }); setLoading(false); if (!response.ok) { setError("E-mail ou senha inválidos."); return; } router.replace("/admin"); router.refresh(); }
  return <main className="auth-shell admin-login-shell"><div className="auth-card"><Link href="/" className="back-link"><ArrowLeft size={16}/> Voltar para o início</Link><div className="admin-login-mark"><LockKeyhole size={22}/></div><div className="admin-kicker">ÁREA RESTRITA</div><h1>Acesso administrativo</h1><p className="muted">Entre com a conta autorizada para acompanhar as inscrições.</p><form onSubmit={submit}><label>E-mail<input name="email" type="email" autoComplete="username" required placeholder="admin@corridapassosquealimentam.com.br"/></label><label>Senha<input name="password" type="password" autoComplete="current-password" required/></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-primary" type="submit" disabled={loading}>{loading ? "Validando..." : "Entrar no painel"}</button></form></div></main>;
}
