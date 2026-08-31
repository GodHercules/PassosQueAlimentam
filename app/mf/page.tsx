import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Instagram, Linkedin, MessageCircle } from "lucide-react";
import SiteHeader from "../../components/site-header";

export const metadata = {
  title: "Conheça a MF | Passos que Alimentam",
  description: "Conheça a MF Contabilidade, responsável por organizar a corrida Passos que Alimentam.",
};

const socialLinks = [
  { label: "Instagram", handle: "@sigamfcontabilidade", href: "https://www.instagram.com/sigamfcontabilidade", icon: Instagram },
  { label: "LinkedIn", handle: "MF Contabilidade", href: "https://www.linkedin.com/company/mf-contabilidade/", icon: Linkedin },
  { label: "WhatsApp", handle: "Fale com a MF", href: "https://wa.me/5571986046407", icon: MessageCircle },
];

export default function MfPage() {
  return (
    <main className="mf-page">
      <div className="mf-road-art" aria-hidden="true" />
      <SiteHeader />

      <section className="mf-hero container">
        <div>
          <span className="stop-label">QUEM FAZ A ROTA ACONTECER</span>
          <h1>Conheça a <em>MF.</em></h1>
          <p className="mf-lead">Uma contabilidade que acredita que bons resultados começam com relações verdadeiras, cuidado nos detalhes e coragem para construir caminhos melhores.</p>
        </div>
        <div className="mf-hero-visual">
          <div className="mf-hero-note">
            <Image src="/brand/mf-logo-circle-sharp.png" alt="MF Contabilidade" width={800} height={436} quality={100} unoptimized />
          </div>
          <Image className="mf-mascot" src="/campaign/mascot-mf.png" alt="Mascote da MF Contabilidade" width={420} height={630} priority />
        </div>
      </section>

      <section className="mf-story container">
        <div className="mf-story-label"><span>01</span><p>Uma história construída com propósito.</p></div>
        <div className="mf-story-copy">
          <p>A MF Contabilidade nasceu em Salvador com uma ideia simples e ambiciosa: tornar a contabilidade mais próxima, humana e estratégica para cada pessoa e cada negócio.</p>
          <p>Desde então, nossa equipe une conhecimento técnico e escuta atenta para oferecer soluções contábeis, fiscais, tributárias, trabalhistas e previdenciárias que ajudam empresas a crescer com segurança e clareza.</p>
          <p>Organizar a corrida <strong>Passos que Alimentam</strong> é uma extensão desse jeito de fazer: transformar responsabilidade em ação e aproximar pessoas em torno de uma causa que alimenta futuros.</p>
        </div>
      </section>

      <section className="mf-purpose">
        <div className="container">
          <div className="mf-purpose-intro">
            <span className="stop-label">NOSSO NORTE</span>
            <h2>Princípios que transformam trabalho em <em>propósito.</em></h2>
            <p>Na MF, cada número carrega uma história, cada decisão merece clareza e cada relacionamento é uma oportunidade de construir algo melhor. É assim que colocamos nossa experiência a serviço de empresas, pessoas e futuros mais sustentáveis.</p>
          </div>

          <div className="mf-purpose-grid">
            <article className="mf-purpose-card">
              <span className="mf-purpose-number">01</span>
              <h3>Missão</h3>
              <p>Atender com excelência clientes de diferentes segmentos, desenvolvendo soluções integradas de gestão empresarial em sintonia com as melhores práticas da Contabilidade.</p>
              <p>Mais do que entregar respostas, buscamos compreender cada realidade, antecipar caminhos e transformar conhecimento técnico em tranquilidade para quem confia na MF.</p>
            </article>

            <article className="mf-purpose-card">
              <span className="mf-purpose-number">02</span>
              <h3>Visão</h3>
              <p>Ser reconhecida como referência em Contabilidade, destacando-nos pela excelência das nossas soluções empresariais e pela satisfação de todos que caminham conosco.</p>
              <p>Queremos ser lembrados pela capacidade de unir precisão, proximidade e visão de futuro em cada parceria construída.</p>
            </article>

            <article className="mf-purpose-card mf-purpose-values">
              <span className="mf-purpose-number">03</span>
              <h3>Valores</h3>
              <p>São eles que orientam nossas escolhas, fortalecem nossa cultura e dão verdade ao nosso jeito de fazer.</p>
              <ul>
                <li>Ética e transparência</li>
                <li>Comprometimento e confiabilidade</li>
                <li>Qualidade e eficiência</li>
                <li>Sustentabilidade e responsabilidade social</li>
                <li>Bem-estar no ambiente de trabalho</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="mf-values">
        <div className="container">
          <span className="stop-label">O JEITO MF DE CAMINHAR</span>
          <h2>Excelência que se percebe.<br /><em>Propósito que permanece.</em></h2>
          <div className="mf-value-grid">
            <article><span>01</span><h3>Proximidade</h3><p>Escutamos de verdade para entender o que cada cliente precisa.</p></article>
            <article><span>02</span><h3>Estratégia</h3><p>Transformamos informação técnica em decisões mais seguras.</p></article>
            <article><span>03</span><h3>Responsabilidade</h3><p>Trabalhamos com ética, transparência e compromisso com o coletivo.</p></article>
          </div>
        </div>
      </section>

      <section className="mf-connect container">
        <div><span className="stop-label">VAMOS CONVERSAR?</span><h2>Continue esse caminho<br /><em>com a gente.</em></h2><p>Conheça mais do nosso trabalho e acompanhe as iniciativas da MF.</p></div>
        <div className="mf-social-grid">{socialLinks.map(({ label, handle, href, icon: Icon }) => <a key={label} href={href} target="_blank" rel="noreferrer"><span className="mf-social-icon"><Icon size={20} /></span><span><b>{label}</b><small>{handle}</small></span><ArrowUpRight size={17} /></a>)}</div>
      </section>

      <footer className="mf-footer"><div className="container"><Link href="/" className="mf-footer-brand"><Image src="/brand/mf-logo.png" alt="MF Contabilidade" width={160} height={48} /></Link><p>MF Contabilidade · Soluções integradas em gestão empresarial.</p><a href="https://mfcontabilidadeba.com.br/" target="_blank" rel="noreferrer">mfcontabilidadeba.com.br <ArrowUpRight size={14} /></a></div></footer>
    </main>
  );
}
