"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Camera, Check, ImagePlus, Move, Pencil, UserRound, X, ZoomIn } from "lucide-react";
import SiteHeader from "../../components/site-header";

type Profile = { name?: string; email?: string; birthDate?: string; sex?: string; phone?: string; photo?: string };
const sexLabels: Record<string, string> = { female: "Feminino", male: "Masculino", "non-binary": "Não binário", "prefer-not": "Prefiro não informar" };

export default function Perfil() {
  const [profile, setProfile] = useState<Profile>({});
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [photoDraft, setPhotoDraft] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const fileRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef({ active: false, x: 0, y: 0 });

  useEffect(() => { try { setProfile(JSON.parse(window.localStorage.getItem("pqa-demo-session") || "{}")); } catch { setProfile({}); } }, []);

  function choosePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => { setPhotoDraft(String(reader.result)); setZoom(1); setOffset({ x: 0, y: 0 }); };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function startDrag(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { active: true, x: e.clientX, y: e.clientY };
  }

  function moveDrag(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current.active) return;
    const previous = dragRef.current;
    setOffset((current) => ({ x: current.x + e.clientX - previous.x, y: current.y + e.clientY - previous.y }));
    dragRef.current = { active: true, x: e.clientX, y: e.clientY };
  }

  function endDrag() { dragRef.current.active = false; }

  function confirmPhotoCrop() {
    if (!photoDraft) return;
    const image = new window.Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 600; canvas.height = 600;
      const context = canvas.getContext("2d");
      if (!context) return;
      const scale = Math.max(600 / image.naturalWidth, 600 / image.naturalHeight) * zoom;
      const factor = 600 / 280;
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;
      context.drawImage(image, (600 - drawWidth) / 2 + offset.x * factor, (600 - drawHeight) / 2 + offset.y * factor, drawWidth, drawHeight);
      setProfile((current) => ({ ...current, photo: canvas.toDataURL("image/jpeg", .9) }));
      setPhotoDraft(null);
    };
    image.src = photoDraft;
  }

  function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next = { ...profile, name: String(data.get("name") || ""), birthDate: String(data.get("birthDate") || ""), sex: String(data.get("sex") || ""), phone: String(data.get("phone") || "") };
    window.localStorage.setItem("pqa-demo-session", JSON.stringify(next));
    setProfile(next); setEditing(false); setSaved(true); window.setTimeout(() => setSaved(false), 2500);
  }

  const date = profile.birthDate ? new Date(`${profile.birthDate}T12:00:00`).toLocaleDateString("pt-BR") : "Não informado";

  return <main className="profile-page"><SiteHeader /><div className="container profile-container"><section className="profile-card-shell"><Link href="/" className="back-link"><ArrowLeft size={16} /> Voltar para o início</Link><div className="profile-page-head"><div><div className="eyebrow">Minha jornada · perfil</div><h1>Seu perfil de corredor.</h1><p>Confira seus dados e mantenha sua inscrição sempre atualizada.</p></div><div className="profile-page-photo">{profile.photo ? <img src={profile.photo} alt="Foto do participante" /> : <UserRound size={38} />}</div></div>{editing ? <form className="profile-edit" onSubmit={save}><div className="profile-photo-field"><button type="button" className={`profile-photo ${profile.photo ? "has-photo" : ""}`} onClick={() => fileRef.current?.click()}>{profile.photo ? <img src={profile.photo} alt="Prévia da foto" /> : <ImagePlus size={23} />}</button><input ref={fileRef} className="visually-hidden" type="file" accept="image/*" onChange={choosePhoto} /><div><strong>Foto do participante</strong><p>Escolha uma imagem e ajuste o enquadramento.</p><button type="button" className="photo-adjust" onClick={() => fileRef.current?.click()}><Camera size={15} /> Selecionar outra foto</button></div></div><label>Nome completo<input name="name" defaultValue={profile.name || ""} required minLength={3} /></label><div className="form-two-cols"><label>Data de nascimento<input name="birthDate" type="date" defaultValue={profile.birthDate || ""} required /></label><label>Sexo<select name="sex" defaultValue={profile.sex || ""} required><option value="" disabled>Selecione</option><option value="female">Feminino</option><option value="male">Masculino</option><option value="non-binary">Não binário</option><option value="prefer-not">Prefiro não informar</option></select></label></div><label>Telefone<input name="phone" type="tel" defaultValue={profile.phone || ""} required /></label><div className="profile-actions"><button className="button button-primary" type="submit"><Check size={16} /> Salvar alterações</button><button className="button button-secondary" type="button" onClick={() => setEditing(false)}>Cancelar</button></div></form> : <><div className="profile-view"><span>Nome <b>{profile.name || "Participante"}</b></span><span>E-mail <b>{profile.email || "Não informado"}</b></span><span>Telefone <b>{profile.phone || "Não informado"}</b></span><span>Nascimento <b>{date}</b></span><span>Sexo <b>{sexLabels[profile.sex || ""] || "Não informado"}</b></span></div>{saved && <p className="saved-message">Perfil atualizado com sucesso.</p>}<div className="profile-actions"><button className="button button-secondary" type="button" onClick={() => setEditing(true)}><Pencil size={16} /> Editar perfil</button><Link className="button button-primary" href="/conta">Minha inscrição <ArrowRight size={16} /></Link></div></>}</section></div>

    {photoDraft && <div className="photo-crop-overlay" role="presentation"><section className="photo-crop-modal" role="dialog" aria-modal="true" aria-labelledby="crop-title"><button type="button" className="photo-crop-close" aria-label="Fechar editor de foto" onClick={() => setPhotoDraft(null)}><X size={19} /></button><div className="eyebrow">PERSONALIZE SUA FOTO</div><h2 id="crop-title">Enquadre seu perfil.</h2><p>Arraste a imagem para posicionar e use o zoom para ajustar o recorte.</p><div className="photo-crop-frame" onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} onPointerLeave={endDrag}>{<img src={photoDraft} alt="Ajuste da foto do participante" style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})` }} />}</div><div className="photo-crop-help"><Move size={15} /> Arraste para enquadrar</div><label className="photo-zoom"><ZoomIn size={17} /><span>Zoom</span><input type="range" min="1" max="2.5" step=".01" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} /></label><div className="photo-crop-actions"><button type="button" className="button button-secondary" onClick={() => setPhotoDraft(null)}>Cancelar</button><button type="button" className="button button-primary" onClick={confirmPhotoCrop}>Usar esta foto <Check size={17} /></button></div></section></div>}
  </main>;
}
