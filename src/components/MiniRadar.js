import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function MiniRadar({ values, size = 150 }) {
  const ref = useRef();

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const radius = size / 2;
    const angleSlice = (Math.PI * 2) / values.length;

    const g = svg
      .append("g")
      .attr("transform", `translate(${radius}, ${radius})`);

    // Ligne centrale
    g.selectAll(".axis")
      .data(values)
      .enter()
      .append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", (_, i) => radius * Math.cos(i * angleSlice - Math.PI / 2))
      .attr("y2", (_, i) => radius * Math.sin(i * angleSlice - Math.PI / 2))
      .attr("stroke", "#444")
      .attr("stroke-width", 1);

    // Polygone des valeurs
    const line = d3
      .lineRadial()
      .radius((d) => (d / 100) * radius)
      .angle((_, i) => i * angleSlice);

    g.append("path")
      .datum(values)
      .attr("fill", "url(#radarGradient)")
      .attr("stroke", "#8b5cf6") // violet
      .attr("stroke-width", 2)
      .attr("opacity", 0.7)
      .attr("d", line);

    // Dégradé violet/bleu
    const defs = svg.append("defs");
    const gradient = defs
      .append("linearGradient")
      .attr("id", "radarGradient")
      .attr("x1", "0%")
      .attr("x2", "100%")
      .attr("y1", "0%")
      .attr("y2", "100%");
    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#3b82f6"); // bleu
    gradient.append("stop").attr("offset", "100%").attr("stop-color", "#8b5cf6"); // violet
  }, [values, size]);

  return (
    <div className="flex flex-col items-center">
      <svg ref={ref} width={size} height={size} />
      <span className="mt-2 text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
        {/* Le nom est injecté depuis RadarDashboard */}
      </span>
    </div>
  );
}
