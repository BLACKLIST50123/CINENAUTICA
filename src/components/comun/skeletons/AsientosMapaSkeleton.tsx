"use client";

import React from "react";
import SkeletonBase from "./SkeletonBase";

interface AsientosMapaSkeletonProps {
  filas?: number;
  columnas?: number;
  className?: string;
}

export default function AsientosMapaSkeleton({
  filas = 6,
  columnas = 10,
  className = "",
}: AsientosMapaSkeletonProps) {
  return (
    <div
      className={`bg-[#0B1528] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col items-center shadow-2xl overflow-hidden ${className}`}
    >
      {/* Barra de Pantalla Neón Contenida */}
      <div className="w-full max-w-lg mb-8 flex flex-col items-center">
        <div className="w-full h-3.5 bg-gradient-to-r from-cyan-500/20 via-cyan-400 to-cyan-500/20 rounded-full shadow-[0_0_20px_rgba(2,132,199,0.5)] border border-cyan-400/40"></div>
        <span className="text-[10px] font-black tracking-widest text-cyan-400/80 uppercase mt-2">
          PANTALLA
        </span>
      </div>

      {/* Matriz de butacas con shimmer */}
      <div className="w-full max-w-2xl space-y-3">
        {Array.from({ length: filas }).map((_, fIdx) => (
          <div key={fIdx} className="flex items-center justify-center gap-2">
            <SkeletonBase className="w-5 h-4 rounded text-[9px] flex-shrink-0" />
            <div className="flex gap-1.5 sm:gap-2 justify-center flex-1">
              {Array.from({ length: columnas }).map((_, cIdx) => (
                <SkeletonBase
                  key={cIdx}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-t-lg rounded-b-sm flex-shrink-0"
                />
              ))}
            </div>
            <SkeletonBase className="w-5 h-4 rounded text-[9px] flex-shrink-0" />
          </div>
        ))}
      </div>

      {/* Leyenda de asientos skeleton */}
      <div className="mt-8 pt-4 border-t border-white/10 flex flex-wrap items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <SkeletonBase className="w-4 h-4 rounded-t-md" />
          <SkeletonBase className="w-16 h-3 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <SkeletonBase className="w-4 h-4 rounded-t-md bg-[#DC2026]/30" />
          <SkeletonBase className="w-20 h-3 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <SkeletonBase className="w-4 h-4 rounded-t-md bg-white/20" />
          <SkeletonBase className="w-16 h-3 rounded" />
        </div>
      </div>
    </div>
  );
}
