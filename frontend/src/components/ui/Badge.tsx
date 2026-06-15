import React from "react";

type BadgeVariant = "pink" | "green" | "muted";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  pink: { background: "rgba(255,41,105,0.15)", color: "var(--pink)", border: "1px solid rgba(255,41,105,0.3)" },
  green: { background: "rgba(39,233,101,0.15)", color: "var(--green)", border: "1px solid rgba(39,233,101,0.3)" },
  muted: { background: "rgba(59,82,101,0.4)", color: "var(--bg-muted)", border: "1px solid var(--bg-muted)" },
};

export default function Badge({ variant = "muted", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${className}`}
      style={variantStyles[variant]}
    >
      {children}
    </span>
  );
}
