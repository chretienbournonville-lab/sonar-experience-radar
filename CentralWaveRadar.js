import React, { useMemo } from "react";
import * as d3 from "d3-shape";
import { FAMILIES } from "./RadarDashboard"; // réutilise la constante des familles

export default function CentralWaveRadar({ values, size = 500 }) {
  const center = size / 2;
  const radius = size / 2 - 40;

  // Préparer les points polaires
  const data = useMemo(() => {
    return FAMILIES.map((f, i) => {
      const avg =
        Math.round(
          (f.metrics.reduce((s, m) => s + (values[m] ?? 0), 0) /
            f.metrics.length) || 0
        );
      const angle = (2 * Math.PI * i) / FAMILIES.length;
      const r = (avg / 100) * radius;
      return [
        center + r * Math.cos(angle),
        center + r * Math.sin(angle),
      ];
    });
  }, [values, size]);

  // Générer la courbe fluide
  const lineGenerator = d3.line().curve(d3.curveCatmullRomClosed);
  const path = lineGenerator(data);

  return (
    <svg width={size} height={size} className="overflow-visible">
      {/* Cercle central */}
      <circle cx={center} cy={center} r={radius * 0.55} fill="#0f1114" />

      {/* Onde fluide */}
      <path
        d={path}
        fill="url(#grad)"
        stroke="#00f5ff"
        strokeWidth={1.5}
        opacity={0.9}
      />

      {/* Dégradé */}
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c5cff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#00d4ff" stopOpacity="0.2" />
        </linearGradient>
      </defs>
    </svg>
  );
}
