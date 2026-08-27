"use client";

const meeting = "-12.997450,-38.442372";
const start = "-12.996842,-38.442875";
const finish = "-12.9799395,-38.4277672";

export default function RouteMap() {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY;
  const nativeRoute = key
    ? `https://www.google.com/maps/embed/v1/directions?key=${encodeURIComponent(key)}&origin=${meeting}&destination=${meeting}&waypoints=${start}%7C${finish}%7C${start}&mode=walking`
    : `https://www.google.com/maps?q=${start}&z=14&output=embed`;

  return (
    <div className={`google-route-map${key ? "" : " is-missing-key"}`}>
      <iframe title="Rota nativa do Google Maps da Corrida Passos que Alimentam" src={nativeRoute} loading="lazy" allowFullScreen />
      {!key && <div className="google-route-key-notice">Configure a chave do Google Maps Embed API para exibir a rota completa.</div>}
    </div>
  );
}
