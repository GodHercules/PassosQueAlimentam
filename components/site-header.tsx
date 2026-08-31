"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function SiteHeader() {
  const [session, setSession] = useState<{ name?: string; photo?: string } | null>(null);
  const [enrolled, setEnrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState(pathname === "/mf" ? "mf" : "jornada");

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem("pqa-demo-session") || "null");
      setSession(saved?.email ? saved : null);
      setEnrolled(Boolean(window.localStorage.getItem("pqa-demo-registration")));
    } catch { setSession(null); setEnrolled(false); }
  }, []);

  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection(pathname === "/mf" ? "mf" : "");
      return;
    }
    const sections = ["jornada", "largada", "faq"];
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveSection(visible.target.id);
    }, { rootMargin: "-22% 0px -62% 0px", threshold: [0.05, 0.2, 0.5] });
    sections.forEach((id) => { const element = document.getElementById(id); if (element) observer.observe(element); });
    return () => observer.disconnect();
  }, [pathname]);

  const accountHref = session ? "/perfil" : "/entrar";
  const actionHref = session && enrolled ? "/conta" : "/pre-inscricao";
  const actionLabel = session && enrolled ? "Ver minha inscrição" : "Inscrever-se";
  const close = () => setMenuOpen(false);

  return <header className="site-header road-header">
    <div className="container header-inner">
      <Link href="/" className="brand brand-logo" aria-label="MF Contabilidade">
        <Image src="/brand/mf-logo.png" alt="MF Medina e Freire Contabilidade" width={180} height={54} priority />
      </Link>
      <button className="mobile-menu-toggle" type="button" aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
      <nav id="main-navigation" className={`nav ${menuOpen ? "is-open" : ""}`} aria-label="Navegação principal">
        <a className={activeSection === "jornada" ? "is-active" : ""} href="/#jornada" onClick={close}>Jornada</a>
        <a className={activeSection === "largada" ? "is-active" : ""} href="/#largada" onClick={close}>Largada</a>
        <a className={activeSection === "faq" ? "is-active" : ""} href="/#faq" onClick={close}>FAQ</a>
        <Link className={activeSection === "mf" ? "is-active" : ""} href="/mf" onClick={close}>Conheça a MF</Link>
        {session ? <Link href={accountHref} className="home-account-avatar" aria-label="Abrir minha conta" title={session.name || "Minha conta"}>{session.photo ? <img src={session.photo} alt="" /> : <span>{(session.name || "P").charAt(0).toUpperCase()}</span>}</Link> : <Link href="/entrar" onClick={close}>Já tenho conta</Link>}
        <Link className="button button-primary nav-button" href={actionHref} onClick={close}>{actionLabel} <ArrowRight size={16} /></Link>
      </nav>
    </div>
  </header>;
}
