import React from "react";

interface InputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  disabled?: boolean;
  maxLength?: number;
  id?: string;
  name?: string;
  autoComplete?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
  disabled = false,
  maxLength,
  id,
  name,
  autoComplete,
  onKeyDown,
}: InputProps) {
  return (
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      maxLength={maxLength}
      autoComplete={autoComplete}
      onKeyDown={onKeyDown}
      className={`w-full rounded-xl px-4 py-3 text-base outline-none transition-colors disabled:opacity-50 ${className}`}
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--bg-muted)",
        color: "var(--light)",
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "var(--pink)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "var(--bg-muted)";
      }}
    />
  );
}
