import React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "text-white font-bold glow-pink hover:scale-105",
  secondary: "font-bold hover:scale-105 glow-green",
  ghost: "border border-white/40 text-light font-semibold hover:bg-white/10",
};

const variantInlineStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: { background: "var(--pink)" },
  secondary: { background: "var(--green)", color: "var(--bg-deep)" },
  ghost: { background: "transparent" },
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm rounded-full",
  md: "px-6 py-3 text-base rounded-full",
  lg: "px-8 py-4 text-lg rounded-full",
};

export default function Button({
  variant = "primary",
  size = "md",
  children,
  onClick,
  disabled = false,
  className = "",
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center transition-all
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      style={variantInlineStyles[variant]}
    >
      {children}
    </button>
  );
}
