"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl, { GeoJSONSource, Map as MapLibreMap } from "maplibre-gl";
import { Protocol } from "pmtiles";
import "maplibre-gl/dist/maplibre-gl.css";

type Point = { name: string; coordinates: [number, number] };
const points: Point[] = [
  { name: "Encontro", coordinates: [-38.442372, -12.99745] },
  { name: "Largada", coordinates: [-38.442875, -12.996842] },
  { name: "Retorno", coordinates: [-38.4277672, -12.9799395] },
];
const routeUrl = `https://router.project-osrm.org/route/v1/foot/${points.map(({ coordinates: [longitude, latitude] }) => `${longitude},${latitude}`).join(";")};${points[1].coordinates[0]},${points[1].coordinates[1]};${points[0].coordinates[0]},${points[0].coordinates[1]}?overview=full&geometries=geojson&steps=false`;
const fallbackRoute = { type: "Feature" as const, properties: {}, geometry: { type: "LineString" as const, coordinates: [points[0].coordinates, points[1].coordinates, [-38.4397, -12.9952], [-38.4352, -12.9902], [-38.4312, -12.9851], points[2].coordinates, [-38.4312, -12.9851], [-38.4352, -12.9902], [-38.4397, -12.9952], points[1].coordinates, points[0].coordinates] } };

function boundsFor(coordinates: [number, number][]) {
  return coordinates.reduce((bounds, coordinate) => bounds.extend(coordinate), new maplibregl.LngLatBounds(coordinates[0], coordinates[0]));
}

export default function RouteMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [routeStatus, setRouteStatus] = useState<"loading" | "ready" | "fallback">("loading");

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    let map: MapLibreMap | null = null;
    let cancelled = false;

    const drawMap = (style: maplibregl.StyleSpecification) => {
      if (!containerRef.current || cancelled) return;
      map = new maplibregl.Map({ container: containerRef.current, style, center: [-38.4355, -12.99], zoom: 13.8, attributionControl: false });
      mapRef.current = map;
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-left");
      map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");
      map.on("error", () => setRouteStatus("fallback"));
      map.on("load", async () => {
        drawRoute(fallbackRoute);
        try {
          const response = await fetch(routeUrl);
          if (!response.ok) throw new Error("route unavailable");
          const data = await response.json();
          const route = data.routes?.[0]?.geometry;
          if (!route?.coordinates?.length) throw new Error("route geometry unavailable");
          drawRoute({ type: "Feature", properties: {}, geometry: route });
          setRouteStatus("ready");
        } catch { setRouteStatus("fallback"); }
      });
    };

    const drawRoute = (route: typeof fallbackRoute) => {
      if (!map) return;
      if (!map.getSource("race-route")) {
        map.addSource("race-route", { type: "geojson", data: route });
        map.addLayer({ id: "race-route-shadow", type: "line", source: "race-route", paint: { "line-color": "#142449", "line-opacity": 0.22, "line-width": 9, "line-blur": 3 } });
        map.addLayer({ id: "race-route-line", type: "line", source: "race-route", paint: { "line-color": "#ff873d", "line-width": 4, "line-opacity": 0.98 } });
      } else (map.getSource("race-route") as GeoJSONSource).setData(route);
      map.fitBounds(boundsFor(route.geometry.coordinates as [number, number][]), { padding: 48, duration: 0 });
    };

    const initialize = async () => {
      try {
        const protocol = new Protocol();
        maplibregl.addProtocol("pmtiles", protocol.tile);
        const styleResponse = await fetch("https://tiles.openfreemap.org/styles/liberty");
        if (!styleResponse.ok) throw new Error("style unavailable");
        const style = await styleResponse.json();
        style.sources.openmaptiles.url = "pmtiles://https://tiles.openfreemap.org/planet";
        drawMap(style);
      } catch {
        drawMap({
          version: 8,
          sources: { osm: { type: "raster", tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"], tileSize: 256, attribution: "© OpenStreetMap contributors" } },
          layers: [{ id: "osm", type: "raster", source: "osm" }],
        });
      }
    };
    void initialize();
    return () => { cancelled = true; map?.remove(); mapRef.current = null; };
  }, []);

  return <div ref={containerRef} className="route-map" aria-label="Mapa do percurso da corrida">
    <div className="route-map-badge">{routeStatus === "loading" ? "Carregando rota…" : "Rota da corrida"}</div>
    {points.map((point, index) => <div key={point.name} className={`route-map-point route-map-point-${index + 1}`}><span>{String(index + 1).padStart(2, "0")}</span>{point.name}</div>)}
    <div className="route-map-credit">OpenFreeMap · OpenStreetMap</div>
  </div>;
}
