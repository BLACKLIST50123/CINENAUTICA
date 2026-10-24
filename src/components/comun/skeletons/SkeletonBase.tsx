"use client";

import React from "react";

interface SkeletonBaseProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function SkeletonBase({ className = "", style }: SkeletonBaseProps) {
  return (
    <div
      className={`cn-skeleton rounded-xl border border-white/5 ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}
