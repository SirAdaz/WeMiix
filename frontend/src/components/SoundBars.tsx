"use client";

import { useState } from "react";

interface SoundBarsProps {
  count: number;
  color: string;
  /** Hauteur minimale en pourcentage ; la barre varie ensuite jusqu'à 100 %. */
  minHeight?: number;
  isAnimated?: boolean;
  className?: string;
}

interface Bar {
  height: number;
  duration: number;
}

/**
 * Barres de son décoratives. Les hauteurs aléatoires sont tirées une seule fois
 * à l'initialisation : un rendu ne doit pas appeler Math.random().
 */
export default function SoundBars({
  count,
  color,
  minHeight = 0,
  isAnimated = false,
  className = "",
}: SoundBarsProps) {
  const [bars] = useState<Bar[]>(() =>
    Array.from({ length: count }, () => ({
      height: minHeight + Math.random() * (100 - minHeight),
      duration: 0.3 + Math.random() * 0.5,
    })),
  );

  return (
    <div className={`flex items-end gap-1 ${className}`} aria-hidden="true">
      {bars.map((bar, index) => (
        <div
          key={index}
          className="w-1.5 rounded-full"
          style={{
            background: color,
            height: `${bar.height}%`,
            opacity: isAnimated ? 0.7 : 1,
            animation: isAnimated
              ? `grow ${bar.duration}s ease-in-out infinite alternate`
              : undefined,
          }}
        />
      ))}
    </div>
  );
}
