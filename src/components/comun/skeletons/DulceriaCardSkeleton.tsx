"use client";

import React from "react";
import SkeletonBase from "./SkeletonBase";

interface DulceriaCardSkeletonProps {
  className?: string;
}

export default function DulceriaCardSkeleton({ className = "" }: DulceriaCardSkeletonProps) {
  return (
    <div
      className={`bg-[#0B1528] border border-white/10 rounded-2xl p-4 flex flex-col justify-between shadow-xl ${className}`}
    >
      <div>
        {/* Imagen del dulce / combo */}
        <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden mb-3">
          <SkeletonBase className="w-full h-full rounded-xl" />
          <div className="absolute top-2 left-2">
            <SkeletonBase className="w-16 h-4 rounded-md bg-white/10" />
          </div>
        </div>

        {/* Título y descripción */}
        <div className="space-y-2">
          <SkeletonBase className="h-4 w-3/4 rounded-md" />
          <SkeletonBase className="h-3 w-full rounded-md" />
          <SkeletonBase className="h-3 w-2/3 rounded-md" />
        </div>
      </div>

      {/* Precio y selector de cantidad */}
      <div className="pt-3 border-t border-white/10 mt-3 flex items-center justify-between">
        <div>
          <SkeletonBase className="h-2.5 w-12 rounded mb-1" />
          <SkeletonBase className="h-5 w-16 rounded-md" />
        </div>
        <SkeletonBase className="h-9 w-24 rounded-xl" />
      </div>
    </div>
  );
}
