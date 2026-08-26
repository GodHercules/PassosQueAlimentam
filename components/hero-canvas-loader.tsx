"use client";
import dynamic from "next/dynamic";
const HeroCanvas = dynamic(() => import("./hero-canvas"), { ssr: false, loading: () => null });
export default HeroCanvas;
