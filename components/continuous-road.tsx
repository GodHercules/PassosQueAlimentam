"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";

const route = "M700 0 C700 260 280 360 280 700 C280 1050 780 1160 780 1510 C780 1860 260 1960 260 2350 C260 2740 760 2810 760 3200 C760 3570 300 3650 300 4040 C300 4190 430 4260 520 4300";

export default function ContinuousRoad() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });
  const dash = useTransform(progress, [0, 1], [1, 0]);

  return (
    <div className="road-backdrop" aria-hidden="true">
      <svg viewBox="0 0 1000 4300" preserveAspectRatio="none">
        <path className="road-shadow" d={route} />
        <path className="road-surface" d={route} />
        <path className="road-edge-line" d={route} />
        <path className="road-center" d={route} />
        <motion.path className="road-center-progress" pathLength="1" style={{ pathLength: dash }} d={route} />
      </svg>
      <span className="road-marker marker-1"><b>01</b><small>largada</small></span>
      <span className="road-marker marker-2"><b>02</b><small>cuidado</small></span>
      <span className="road-marker marker-3"><b>03</b><small>encontro</small></span>
      <span className="road-marker marker-4"><b>04</b><small>chegada</small></span>
    </div>
  );
}
