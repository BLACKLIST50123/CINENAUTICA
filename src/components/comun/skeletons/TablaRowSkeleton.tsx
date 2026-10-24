"use client";

import React from "react";
import SkeletonBase from "./SkeletonBase";

interface TablaRowSkeletonProps {
  filas?: number;
  columnas?: number;
  className?: string;
}

export default function TablaRowSkeleton({
  filas = 5,
  columnas = 4,
  className = "",
}: TablaRowSkeletonProps) {
  const anchos = ["w-1/4", "w-1/3", "w-1/2", "w-2/3", "w-3/4"];

  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: filas }).map((_, fIdx) => (
        <div
          key={fIdx}
          className="bg-[#0B1528] border border-white/10 rounded-xl p-4 flex items-center justify-between gap-4"
        >
          {Array.from({ length: columnas }).map((_, cIdx) => (
            <div key={cIdx} className="flex-1 min-w-0">
              <SkeletonBase
                className={`h-4 rounded-md ${anchos[(fIdx + cIdx) % anchos.length]}`}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
