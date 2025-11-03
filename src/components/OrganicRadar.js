import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function OrganicRadar({ averages, size = 500 }) {
  const ref = useRef();
  const numWaves = 10; // nombre d'ondes translucides par cercle
  const numPoints = 360; // points pour dessiner chaque onde
  const enlargedSize = size * 1.25; // +25%
  const center = enlargedSize / 2;

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    // 🎨 Palette adoucie (bleu → violet → vert pastel)
    const colors = [
      "rgba(59, 130, 246, 0.7)",  // bleu électrique
      "rgba(56, 189, 248, 0.7)",  // bleu clair
      "rgba(125, 211, 252, 0.7)", // cyan doux
      "rgba(110, 231, 183, 0.7)", // vert menthe 🌱
      "rgba(52, 211, 153, 0.7)",  // vert émeraude doux
      "rgba(168, 85, 247, 0.7)",  // violet clair
      "rgba(139, 92, 246, 0.7)",  // violet profond
    ];

    const lineGenerator = d3.line().curve(d3.curveCardinalClosed);

    const generateWave = (baseRadius, i, w, t) => {
      return d3.range(numPoints).map((p) => {
        const angle = (p / numPoints) * 2 * Math.PI;

        // vibration
        const oscillation =
          Math.sin(angle * (i + 2) + w * 0.9 + t / 900) *
          (20 + w * 3);

        // arcs qui respirent
        const arcExpansion =
          Math.cos(angle * 3 + t / 1500 + w) *
          (10 + Math.sin(t / 2000 + i) * 15);

        const r = baseRadius * 1.5 + oscillation + arcExpansion;

        return [
          center + r * Math.cos(angle),
          center + r * Math.sin(angle),
        ];
      });
    };

    let frame;
    const animate = () => {
      const t = Date.now();
      svg.selectAll("*").remove();

      averages.forEach((avg, i) => {
        const baseRadius = (avg / 100) * (enlargedSize / 2 - 50);

        for (let w = 0; w < numWaves; w++) {
          const points = generateWave(baseRadius, i, w, t);

          svg
            .append("path")
            .attr("d", lineGenerator(points))
            .attr("fill", "none")
            .attr("stroke", colors[(i + w) % colors.length])
            .attr("stroke-width", 2)
            .attr("opacity", 0.18 + Math.random() * 0.18); // un peu plus visible
        }
      });

      frame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(frame);
  }, [averages, size]);

  return (
    <svg
      ref={ref}
      width={enlargedSize}
      height={enlargedSize}
      className="overflow-visible"
      style={{ background: "#06060a" }}
    />
  );
}
