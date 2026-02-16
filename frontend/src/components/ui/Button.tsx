import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button = React.memo(function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses =
    "font-medium transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary:
      "bg-primary text-white hover:scale-[1.02] hover:shadow-soft dark:hover:bg-opacity-90",
    secondary:
      "bg-muted text-white hover:scale-[1.02] hover:shadow-soft dark:bg-muted-dark",
    success: "bg-green-600 text-white hover:scale-[1.02] hover:shadow-soft",
    danger: "bg-red-600 text-white hover:scale-[1.02] hover:shadow-soft",
    ghost:
      "bg-transparent text-charcoal hover:bg-accent/10 dark:text-text-dark dark:hover:bg-accent-dark/20",
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-sm rounded-sm",
    md: "px-3 py-2 text-base rounded-soft",
    lg: "px-4 py-3 text-lg rounded-soft",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});
