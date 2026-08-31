"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, Flag, Footprints, Heart, MapPin, Sparkles } from "lucide-react";
import ContinuousRoad from "../components/continuous-road";
import { MagneticButton, Reveal, ScrollFloat, SpotlightCard } from "../components/interactive";
import LazyRouteMap from "../components/lazy-route-map";
import SiteHeader from "../components/site-header";

const stops = [
  { no: "01", title: "Comece no seu ritmo", text: "Uma corrida para todos os corpos, idades e histórias. O importante é dar o primeiro passo.", icon: Footprints },
  { no: "02", title: "Cada passo alimenta", text: "Sua participação vira apoio real para quem precisa. Movimento que chega mais longe.", icon: Heart },
  { no: "03", title: "Chegue junto", text: "Encontre a comunidade, compartilhe energia e transforme a manhã em memória.", icon: Sparkles },
];

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className="road-site">
        <ContinuousRoad />

        <section className="road-hero-point" id="jornada">
          <div className="container road-hero-grid">
            <Reveal>
              <div className="hero-copy road-copy-block">
                <div className="eyebrow"><span className="eyebrow-dot" /> 28 NOV 2026 · SALVADOR — BA</div>
                <h1>Passos que <span>alimentam</span> futuros.</h1>
                <p>Uma corrida beneficente onde cada quilômetro vira cuidado. Corra, caminhe e faça parte dessa rota.</p>
                <div className="hero-actions">
                  <MagneticButton><Link className="button button-orange" href="/pre-inscricao">Fazer minha pré-inscrição <ArrowRight size={18} /></Link></MagneticButton>
                  <a className="road-text-link" href="#largada">Ver o percurso <ArrowDown size={17} /></a>
                </div>
                <div className="hero-facts"><span><b>5 km</b> percurso</span><span><b>Jardim de Alah</b> largada</span><span><b>+5 mil</b> passos juntos</span></div>
              </div>
            </Reveal>
            <ScrollFloat distance={28}><div className="start-sign" aria-hidden="true"><span className="start-pill">PONTO DE PARTIDA</span><div className="start-arch"><i /><i /><i /></div><Image className="start-mascot" src="/campaign/mascot-start-cutout.png" alt="" width={300} height={424} priority /><span className="start-line">START</span></div></ScrollFloat>
          </div>
          <a className="scroll-cue" href="#pontos"><span>ROLE PARA SEGUIR A ROTA</span><ArrowDown size={18} /></a>
        </section>

        <section className="road-stop-section intro-stop" id="pontos">
          <div className="container stop-grid">
            <div className="stop-copy"><span className="stop-label">PONTO 01 · A CAUSA</span><h2>O caminho fica mais bonito quando a gente vai junto.</h2><p>Passos que Alimentam é uma experiência de movimento e solidariedade. Uma manhã para cuidar do corpo, encontrar pessoas e levar alimento para mais famílias.</p><Link className="road-text-link dark-link" href="/acao">Entenda a ação <ArrowRight size={17} /></Link></div>
            <Reveal delay={.1}><SpotlightCard><article className="stop-card orange-card"><span className="card-number">01</span><Heart size={30} /><strong>Um passo de cada vez.</strong><small>Renda e doações direcionadas para transformar movimento em cuidado.</small></article></SpotlightCard></Reveal>
          </div>
        </section>

        <section className="road-stop-section points-stop">
          <div className="container"><div className="section-kicker">A ROTA TEM MOTIVO</div><h2 className="section-title">Pare em cada ponto.<br /><span>Leve algo com você.</span></h2><div className="points-layout"><div className="stop-cards">{stops.map((stop, index) => { const Icon = stop.icon; return <Reveal key={stop.no} delay={index * .08}><SpotlightCard><article className="point-card"><div className="point-top"><span>{stop.no}</span><Icon size={21} /></div><h3>{stop.title}</h3><p>{stop.text}</p><ArrowRight className="point-arrow" size={20} /></article></SpotlightCard></Reveal>; })}</div><div className="points-mascot"><Image src="/campaign/mascot-points-cutout.png" alt="Corredor da campanha alongando antes da corrida" width={300} height={450} /></div></div></div>
        </section>

        <section className="road-stop-section map-stop" id="largada">
          <div className="container route-briefing">
            <div className="route-heading"><div><span className="stop-label">PONTO 03 · A ROTA</span><h2>Encontre o seu caminho.</h2></div><p>Uma ida para ganhar ritmo, uma volta para celebrar o que construímos juntos.</p></div>
            <div className="route-briefing-grid">
              <div className="map-frame"><LazyRouteMap /></div>
              <div className="route-copy"><div className="route-distance"><strong>5 km</strong><span>percurso total<br /><small>ida e volta</small></span></div><p>A rota começa no ponto de encontro, segue até a largada no Jardim de Alah e avança até o destino da prova. Depois, o caminho retorna pelo mesmo eixo: cada trecho soma um passo de cuidado.</p><div className="route-points"><a href="https://maps.app.goo.gl/W6QqSg8QFDB9EvmF7" target="_blank" rel="noreferrer"><span className="route-point-number">01</span><span><b>Ponto de encontro</b><small>Chegue, encontre a equipe e se prepare.</small></span><ArrowRight size={16}/></a><a href="https://maps.app.goo.gl/WGEzTFYrnZJEznLH9" target="_blank" rel="noreferrer"><span className="route-point-number">02</span><span><b>Largada · Jardim de Alah</b><small>Onde a corrida começa oficialmente.</small></span><ArrowRight size={16}/></a><a href="https://maps.app.goo.gl/p2omkRvGNYfAKZgq9" target="_blank" rel="noreferrer"><span className="route-point-number">03</span><span><b>Ponto de retorno</b><small>Arena O Canto da Cidade · depois, voltamos.</small></span><ArrowRight size={16}/></a></div><Link className="button button-primary" href="/pre-inscricao">Quero participar <ArrowRight size={17} /></Link></div>
            </div>
          </div>
        </section>

        <section className="road-stop-section details-stop">
          <div className="container"><div className="detail-header"><div><span className="stop-label">PONTO 04 · PREPARE-SE</span><h2>Seu kit para a jornada.</h2></div><p>Informação simples para você aproveitar cada curva do caminho.</p></div><div className="detail-grid">{[["01", "Inscrição", "Garanta sua vaga e acompanhe as próximas instruções."], ["02", "No dia", "Roupas leves, tênis confortável, água e vontade de fazer o bem."], ["03", "Depois da linha", "Compartilhe a conquista e continue alimentando futuros."]].map(([no, title, text]) => <div className="detail-item" key={no}><b>{no}</b><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></div>
        </section>

        <section className="finish-stop"><div className="container finish-inner"><Image className="finish-mascot" src="/campaign/mascot-finish-cutout.png" alt="Corredor convidando para a linha de chegada" width={280} height={590} /><Flag size={30} /><span className="stop-label">LINHA DE CHEGADA</span><h2>O próximo passo<br /><em>começa com você.</em></h2><p>Faça sua pré-inscrição e venha construir essa rota com a gente.</p><MagneticButton><Link className="button button-orange" href="/pre-inscricao">Entrar para a corrida <ArrowRight size={18} /></Link></MagneticButton></div></section>

        <section className="supporters-section" id="apoiadores" aria-labelledby="supporters-title"><div className="container supporters-intro"><div><span className="stop-label">QUEM CAMINHA COM A GENTE</span><h2 id="supporters-title">Essa rota só existe<br /><em>porque vocês apoiam.</em></h2></div><p>A cada parceiro, uma nova possibilidade. Obrigado por transformar solidariedade em movimento.</p></div><div className="supporter-marquee" aria-label="Apoiadores da corrida"><div className="supporter-track"><div className="supporter-set">{["APOIO", "COMUNIDADE", "MOVIMENTO", "CUIDADO", "PARCERIA", "FUTURO"].map((name, index) => <div className="supporter-logo" key={`a-${name}`}><span>{String(index + 1).padStart(2, "0")}</span><strong>{name}</strong></div>)}</div><div className="supporter-set" aria-hidden="true">{["APOIO", "COMUNIDADE", "MOVIMENTO", "CUIDADO", "PARCERIA", "FUTURO"].map((name, index) => <div className="supporter-logo" key={`b-${name}`}><span>{String(index + 1).padStart(2, "0")}</span><strong>{name}</strong></div>)}</div><div className="supporter-set" aria-hidden="true">{["APOIO", "COMUNIDADE", "MOVIMENTO", "CUIDADO", "PARCERIA", "FUTURO"].map((name, index) => <div className="supporter-logo" key={`c-${name}`}><span>{String(index + 1).padStart(2, "0")}</span><strong>{name}</strong></div>)}</div><div className="supporter-set" aria-hidden="true">{["APOIO", "COMUNIDADE", "MOVIMENTO", "CUIDADO", "PARCERIA", "FUTURO"].map((name, index) => <div className="supporter-logo" key={`d-${name}`}><span>{String(index + 1).padStart(2, "0")}</span><strong>{name}</strong></div>)}</div></div></div><div className="supporter-note">Espaços reservados para as marcas que apoiam a ação <span>●</span></div></section>

        <section className="faq-section road-faq" id="faq"><div className="container faq-layout"><div className="faq-intro"><span className="stop-label">AINDA NA DÚVIDA?</span><h2>Perguntas<br /><em>no caminho.</em></h2><p>Informações rápidas para você chegar preparado e aproveitar cada passo.</p><Link href="/pre-inscricao" className="faq-cta">Começar minha jornada <ArrowRight size={16}/></Link></div><div className="faq-grid"><details className="faq-item"><summary>Quem pode participar?</summary><p>Todo mundo pode correr ou caminhar no seu próprio ritmo. O importante é participar respeitando seus limites.</p></details><details className="faq-item"><summary>Como faço minha inscrição?</summary><p>Comece pela pré-inscrição. Em seguida, crie sua conta e acompanhe as orientações para concluir seu cadastro.</p></details><details className="faq-item"><summary>Onde será a largada?</summary><p>No Jardim de Alah, em Salvador — BA. O mapa com o ponto de partida está na seção Largada.</p></details><details className="faq-item"><summary>Como posso ajudar além da corrida?</summary><p>Você pode divulgar a ação, apoiar como patrocinador ou fazer uma doação para a causa.</p></details></div></div></section>
      </main>

      <footer className="site-footer road-footer"><div className="container footer-main"><div className="footer-brand"><Link href="/" aria-label="Voltar para o início"><Image src="/brand/mf-logo.png" alt="MF Medina e Freire Contabilidade" width={180} height={54}/></Link><p>Uma ação da MF Contabilidade para transformar passos em cuidado.</p></div><div className="footer-column"><span>Jornada</span><Link href="#jornada">Início</Link><Link href="#largada">Largada</Link><Link href="#faq">Perguntas</Link></div><div className="footer-column"><span>Participação</span><Link href="/pre-inscricao">Inscrever-se</Link><Link href="/entrar">Minha conta</Link><Link href="/termo-imagem">Termo de imagem</Link><Link href="/mf">Conheça a MF</Link></div></div><div className="container footer-bottom"><span>© 2026 MF Contabilidade · Passos que Alimentam</span><Link href="/privacidade">Aviso de privacidade</Link></div></footer>
    </>
  );
}
