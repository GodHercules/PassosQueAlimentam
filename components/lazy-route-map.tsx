"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const RouteMap = dynamic(() => import("./route-map"), {
  ssr: false,
  loading: () => <MapPlaceholder />,
});

function MapPlaceholder() {
  return (
    <div className="route-map" aria-label="Mapa do percurso da corrida" aria-busy="true">
      <div className="route-map-badge">Carregando mapa…</div>
      <div className="route-map-credit">OpenStreetMap · Leaflet</div>
    </div>
  );
}

export default function LazyRouteMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || shouldLoad) return;

    if (!("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "800px 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [shouldLoad]);

  return <div ref={containerRef} className="route-map-shell">{shouldLoad ? <RouteMap /> : <MapPlaceholder />}</div>;
}
