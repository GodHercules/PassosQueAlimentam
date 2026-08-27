"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Polyline } from "leaflet";
import "leaflet/dist/leaflet.css";

type Point = { name: string; coordinates: [number, number] };
const points: Point[] = [
  { name: "Encontro", coordinates: [-12.99745, -38.442372] },
  { name: "Largada", coordinates: [-12.996842, -38.442875] },
  { name: "Retorno", coordinates: [-12.9799395, -38.4277672] },
];
const osrmUrl = `https://router.project-osrm.org/route/v1/foot/${points.map(({ coordinates: [latitude, longitude] }) => `${longitude},${latitude}`).join(";")};${points[1].coordinates[1]},${points[1].coordinates[0]};${points[0].coordinates[1]},${points[0].coordinates[0]}?overview=full&geometries=geojson&steps=false`;

export default function RouteMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const routeRef = useRef<Polyline | null>(null);
  const [status, setStatus] = useState("Carregando mapa…");

  useEffect(() => {
    let disposed = false;
    const initialize = async () => {
      const L = await import("leaflet");
      if (!containerRef.current || disposed || mapRef.current) return;
      const map = L.map(containerRef.current, { zoomControl: true, scrollWheelZoom: false });
      mapRef.current = map;
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "© OpenStreetMap contributors" }).addTo(map);
      const bounds = L.latLngBounds(points.map(({ coordinates }) => coordinates));
      map.fitBounds(bounds, { padding: [36, 36] });
      points.forEach((point, index) => {
        L.marker(point.coordinates, { icon: L.divIcon({ className: "route-marker-wrap", html: `<span class=\"route-marker-dot\"></span><span class=\"route-marker-label\">${String(index + 1).padStart(2, "0")} · ${point.name}</span>`, iconSize: [18, 18], iconAnchor: [9, 9] }) }).addTo(map);
      });
      try {
        const response = await fetch(osrmUrl);
        if (!response.ok) throw new Error("route unavailable");
        const data = await response.json();
        const coordinates = data.routes?.[0]?.geometry?.coordinates?.map(([longitude, latitude]: [number, number]) => [latitude, longitude] as [number, number]);
        if (!coordinates?.length) throw new Error("route geometry unavailable");
        routeRef.current = L.polyline(coordinates, { color: "#ff873d", weight: 6, opacity: 0.22 }).addTo(map);
        L.polyline(coordinates, { color: "#ff873d", weight: 3, opacity: 1 }).addTo(map);
        map.fitBounds(L.latLngBounds(coordinates), { padding: [36, 36] });
        if (!disposed) setStatus("Rota da corrida");
      } catch { if (!disposed) setStatus("Mapa da corrida"); }
    };
    void initialize();
    return () => { disposed = true; mapRef.current?.remove(); mapRef.current = null; routeRef.current = null; };
  }, []);

  return <div ref={containerRef} className="route-map" aria-label="Mapa do percurso da corrida"><div className="route-map-badge">{status}</div><div className="route-map-credit">OpenStreetMap · Leaflet</div></div>;
}
