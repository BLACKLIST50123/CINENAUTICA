"use client";

import React from "react";
import SkeletonBase from "./SkeletonBase";

interface PeliculaCardSkeletonProps {
  className?: string;
}

export default function PeliculaCardSkeleton({ className = "" }: PeliculaCardSkeletonProps) {
  return (
    <div
      className={`bg-[#0B1528] border border-white/10 rounded-2xl overflow-hidden p-3 flex flex-col justify-between shadow-xl ${className}`}
    >
      <div>
        {/* Poster Skeleton con badge superior */}
        <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden mb-3">
          <SkeletonBase className="w-full h-full rounded-xl" />
          <div className="absolute top-2 left-2">
            <SkeletonBase className="w-10 h-4 rounded-md bg-white/10" />
          </div>
          <div className="absolute top-2 right-2">
            <SkeletonBase className="w-14 h-4 rounded-full bg-white/10" />
          </div>
        </div>

        {/* Título y metadatos */}
        <div className="space-y-2 px-1">
          <SkeletonBase className="h-4 w-4/5 rounded-md" />
          <SkeletonBase className="h-3 w-1/2 rounded-md" />
        </div>
      </div>

      {/* Badges de formatos / horarios */}
      <div className="pt-3 px-1 flex gap-1.5 mt-2 border-t border-white/5">
        <SkeletonBase className="h-5 w-10 rounded-md" />
        <SkeletonBase className="h-5 w-10 rounded-md" />
        <SkeletonBase className="h-5 w-12 rounded-md" />
      </div>
    </div>
  );
}
