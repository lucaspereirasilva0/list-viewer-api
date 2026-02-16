import React, { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className = "", ...props },
  ref,
) {
  return (
    <div className="flex flex-col">
      {label && (
        <label className="text-sm font-medium text-charcoal mb-1 font-display">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`
          px-3 py-2 rounded-soft border border-accent/20
          bg-white/80 backdrop-blur-sm
          text-charcoal placeholder:text-muted
          focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
          transition-all duration-200 ease-out
          ${error ? "border-red-400 focus:border-red-500 focus:ring-red-500" : ""}
          ${className}
        `}
        {...props}
      />
      {error && <span className="text-sm text-red-500 mt-1">{error}</span>}
    </div>
  );
});
