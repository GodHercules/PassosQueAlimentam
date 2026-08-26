"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, ChevronRight, ShieldCheck, X } from "lucide-react";

const sessionKey = "pqa-demo-session";

export default function PreInscricao() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [consentOpen, setConsentOpen] = useState(false);
  const [readMore, setReadMore] = useState(false);
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [source, setSource] = useState("");
  const [size, setSize] = useState("");
  const [name, setName] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!window.localStorage.getItem(sessionKey)) {
      router.replace("/cadastro?next=/pre-inscricao");
      return;
    }
    setChecking(false);
    if (!window.localStorage.getItem("pqa-image-consent")) setConsentOpen(true);
  }, [router]);

  function acceptConsent() {
    window.localStorage.setItem("pqa-image-consent", JSON.stringify({ acceptedAt: new Date().toISOString(), version: "1.1" }));
    setConsentOpen(false);
  }

  function declineConsent() { router.replace("/"); }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!source || !size || (source === "REFERRAL" && !name)) {
      setError("Revise os campos obrigatórios antes de continuar.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const session = JSON.parse(window.localStorage.getItem(sessionKey) || "{}");
      const consentData = JSON.parse(window.localStorage.getItem("pqa-image-consent") || "{}");
      const idempotencyKey = crypto.randomUUID();
      const submittedAt = new Date().toISOString();
      const protocol = `PQA-2026-${idempotencyKey.slice(0, 8).toUpperCase()}`;
      const payload = {
        type: "race.pre_registration.created", schemaVersion: "1.0", idempotencyKey, occurredAt: submittedAt,
        registration: { id: idempotencyKey, protocol, status: "pending_donation", submittedAt },
        event: { slug: "passos-que-alimentam-2026", name: "Corrida Passos que Alimentam", date: "2026-11-28", location: "Jardim de Alah, Salvador - BA", distanceKm: 5, donationRequirement: "2 kg de alimentos não perecíveis ou 1 lata de leite em pó" },
        participant: { id: session.email || idempotencyKey, fullName: session.name || "Participante", email: session.email || "", phone: null, birthDate: null, ageAtEvent: null },
        answers: { heardAbout: source, shirtSize: size, referrerName: source === "REFERRAL" ? name : null },
        consents: [{ type: "image_and_voice", granted: true, version: consentData.version || "1.1", grantedAt: consentData.acceptedAt || submittedAt }],
        guardian: null, notification: { locale: "pt-BR", sendOperationalUpdates: true, marketingConsent: false },
      };
      const response = await fetch("/api/notify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error("notify");
      window.localStorage.setItem("pqa-demo-registration", JSON.stringify({ protocol, shirtSize: size, heardAbout: source, submittedAt }));
      setSent(true);
    } catch { setError("Não foi possível enviar sua pré-inscrição agora. Tente novamente em instantes."); }
    finally { setSubmitting(false); }
  }

  if (checking) return <main className="flow-shell"><div className="flow-card flow-loading"><div className="progress"><span className="active">1</span><i/><span>2</span><i/><span>3</span></div><div className="eyebrow">Verificando sua conta</div><h1>Preparando sua jornada...</h1><p className="muted">Só um instante. Vamos confirmar seu acesso antes de abrir a pré-inscrição.</p></div></main>;

  return <main className="flow-shell"><div className="flow-card"><Link href="/" className="back-link"><ArrowLeft size={16}/> Início</Link>{sent ? <><div className="success-icon"><Check/></div><div className="eyebrow">Protocolo recebido</div><h1>Pré-inscrição recebida!</h1><p className="muted">Enviamos os dados para confirmação. As próximas orientações serão enviadas por e-mail.</p><div className="summary"><b>28 de novembro de 2026</b><span>Jardim de Alah, Salvador – BA · 5 km</span><span>2 kg de alimentos não perecíveis ou 1 lata de leite em pó</span></div><Link className="button button-primary" href="/conta">Acessar minha conta</Link></> : <><div className="progress"><span className="active">1</span><i/><span>2</span><i/><span>3</span></div><div className="eyebrow">Pré-inscrição · etapa 1 de 3</div><h1>Vamos dar esse passo?</h1><div className="important-box"><strong>O essencial para participar</strong><span><b>28 de novembro de 2026</b> · Jardim de Alah, Salvador — BA · percurso de <b>5 km</b></span><span>Leve <b>2 kg de alimentos não perecíveis</b> ou <b>1 lata de leite em pó</b> para confirmar sua participação.</span></div><p className="muted">Esta é uma pré-inscrição para a Corrida Passos que Alimentam, uma ação solidária para arrecadar alimentos e destiná-los a pessoas e instituições que precisam de apoio.</p><p className="muted">A atividade será realizada em 28 de novembro de 2026, no Jardim de Alah, em Salvador – BA, em um percurso de 5 km.</p><p className="muted">A participação será confirmada após a entrega de <strong>2 kg de alimentos não perecíveis</strong>, por exemplo: arroz, feijão, macarrão, farinha, açúcar ou óleo; ou <strong>1 lata de leite em pó</strong>. A organização informará o local e o prazo para entrega.</p><p className="muted">Não é obrigatório correr: você pode participar caminhando, no seu ritmo e respeitando seus limites. O objetivo principal é arrecadar alimentos para doação.</p><p className="muted">Preencha a pré-inscrição com atenção. A pré-inscrição não substitui a confirmação final.</p><form onSubmit={submit}><fieldset><legend>Como ficou sabendo da corrida?</legend>{[["REFERRAL","Indicação"],["MF_CONTABILIDADE","MF Contabilidade"],["MF_PARTNERS","Parceiros da MF"]].map(([value,label])=><label className="choice" key={value}><input type="radio" name="source" value={value} checked={source===value} onChange={e=>{setSource(e.target.value);if(e.target.value!=="REFERRAL")setName("")}}/> {label}</label>)}</fieldset>{source==="REFERRAL"&&<label>Quem fez a indicação?<input value={name} onChange={e=>setName(e.target.value)} minLength={2} maxLength={120} required placeholder="Nome de quem indicou"/></label>}<fieldset><legend>Qual é o tamanho da sua camisa?</legend><div className="sizes">{["P","M","G","GG"].map(value=><label className={`size ${size===value?"selected":""}`} key={value}><input type="radio" name="size" value={value} checked={size===value} onChange={e=>setSize(e.target.value)}/>{value}</label>)}</div></fieldset>{error&&<p className="form-error" role="alert">{error}</p>}<button className="button button-primary" disabled={submitting}>{submitting?"Enviando...":"Continuar"} {!submitting&&<ChevronRight size={18}/>}</button></form></>}</div>{consentOpen&&<div className="consent-overlay" role="presentation"><section className="consent-modal" role="dialog" aria-modal="true" aria-labelledby="consent-title"><button className="consent-close" aria-label="Fechar e sair" onClick={declineConsent}><X size={20}/></button><div className="consent-icon"><ShieldCheck size={25}/></div><div className="eyebrow">Antes de continuar</div><h2 id="consent-title">Autoriza o uso da sua imagem?</h2><p className="consent-lead">Durante a corrida, podemos registrar fotos e vídeos para divulgar a ação solidária nos canais oficiais da MF Contabilidade.</p><label className="consent-check"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/><span>Li e <b>concordo</b> com o termo de autorização de uso de imagem e voz.</span></label><button className="consent-more" type="button" onClick={()=>setReadMore(!readMore)}>{readMore?"Ocultar termo":"Ler mais"} <ChevronRight size={16} className={readMore?"expanded":""}/></button>{readMore&&<div className="consent-full"><p>Autorizo, de forma gratuita, não exclusiva e por prazo indeterminado, a MF Contabilidade a captar e utilizar minha imagem e voz registradas durante a Corrida Passos que Alimentam, realizada em 28 de novembro de 2026, no Jardim de Alah, em Salvador — BA.</p><p>O uso poderá ocorrer em fotografias, vídeos e peças de comunicação para registro, memória, divulgação institucional e comunicação nos canais oficiais da organização, incluindo site, redes sociais, apresentações, materiais informativos e imprensa ou parceiros do evento.</p><p>A autorização não permite uso ofensivo, discriminatório, vexatório ou fora dessas finalidades. Conteúdos publicados na internet podem ser compartilhados por terceiros. Posso solicitar esclarecimentos e revogar a autorização para usos futuros pelo canal informado no Aviso de Privacidade.</p><p className="consent-note">Este texto é uma minuta de desenvolvimento e deve ser revisado juridicamente antes da publicação.</p></div>}<div className="consent-actions"><button className="button button-secondary" type="button" onClick={declineConsent}>Não concordo</button><button className="button button-primary" type="button" disabled={!consent} onClick={acceptConsent}>Aceitar e continuar <ChevronRight size={17}/></button></div><p className="consent-foot">Você pode revogar este consentimento para utilizações futuras.</p></section></div>}</main>;
}
