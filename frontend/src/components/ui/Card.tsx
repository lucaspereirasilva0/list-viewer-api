import React, { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "editorial";
}

export const Card = React.memo(function Card({
  children,
  variant = "editorial",
  className = "",
  ...props
}: CardProps) {
  const baseClasses =
    "bg-white/90 dark:bg-surface-elevated-dark/95 backdrop-blur-sm rounded-soft transition-all duration-200 ease-out";

  const variantClasses = {
    default: "shadow-editorial dark:shadow-editorial-dark",
    elevated: "shadow-elegant hover:-translate-y-0.5 dark:shadow-elegant-dark",
    editorial:
      "shadow-soft hover:shadow-elegant hover:-translate-y-0.5 border-double-editorial dark:shadow-soft-dark dark:hover:shadow-elegant-dark",
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});
