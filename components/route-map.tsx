"use client";

import { useEffect, useRef } from "react";
import type * as Leaflet from "leaflet";

const points: [number, number][] = [
  [-12.997450, -38.442372],
  [-12.996842, -38.442875],
  [-12.9799395, -38.4277672],
  [-12.996842, -38.442875],
  [-12.997450, -38.442372],
];

const markerConfig = [
  { position: points[0], label: "ENCONTRO" },
  { position: points[1], label: "LARGADA" },
  { position: points[2], label: "RETORNO" },
];

export default function RouteMap() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: Leaflet.Map | null = null;
    let disposed = false;
    import("leaflet").then(({ default: L }) => {
      if (!mapRef.current || disposed) return;
      map = L.map(mapRef.current, { scrollWheelZoom: false, zoomControl: true });
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", { attribution: '&copy; OpenStreetMap contributors &copy; CARTO', subdomains: "abcd", maxZoom: 20, crossOrigin: true }).addTo(map);
      const drawRoute = (route: [number, number][]) => { if (!map) return; const line = L.polyline(route, { color: "#ff873d", weight: 7, opacity: 0.95, lineCap: "round", lineJoin: "round" }).addTo(map); L.polyline(route, { color: "#fffaf2", weight: 2, opacity: 0.85, dashArray: "10 11", lineCap: "round" }).addTo(map); map.fitBounds(line.getBounds(), { padding: [28, 28] }); };
      drawRoute(points);
      const coordinates = points.map(([lat, lng]) => `${lng},${lat}`).join(";");
      fetch(`https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`).then((response) => response.ok ? response.json() : null).then((data) => { const geometry = data?.routes?.[0]?.geometry?.coordinates; if (geometry?.length) drawRoute(geometry.map(([lng, lat]: [number, number]) => [lat, lng] as [number, number])); }).catch(() => undefined);
      markerConfig.forEach(({ position, label }) => { const icon = L.divIcon({ className: "route-marker-wrap", html: `<span class="route-marker-label">${label}</span><span class="route-marker-dot"></span>`, iconSize: [0, 0], iconAnchor: [7, 7] }); L.marker(position, { icon, keyboard: false }).addTo(map as Leaflet.Map); });
    });
    return () => { disposed = true; map?.remove(); };
  }, []);

  return <div className="route-leaflet-map" ref={mapRef} aria-label="Mapa interativo do percurso de ida e volta" />;
}
