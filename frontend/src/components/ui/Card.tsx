import React from "react";

interface CardProps {
  children: React.ReactNode;
  accent?: string;
  className?: string;
  onClick?: () => void;
}

export default function Card({ children, accent, className = "", onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-5 border card-hover ${onClick ? "cursor-pointer" : ""} ${className}`}
      style={{
        background: "var(--bg-card)",
        borderColor: "var(--bg-muted)",
        borderLeftWidth: accent ? "3px" : undefined,
        borderLeftColor: accent ?? undefined,
      }}
    >
      {children}
    </div>
  );
}
