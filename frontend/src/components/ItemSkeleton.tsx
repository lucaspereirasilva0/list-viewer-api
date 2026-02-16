import React from "react";

export function ItemSkeleton() {
  return (
    <li className="flex items-center justify-between bg-white/90 dark:bg-surface-elevated-dark/95 backdrop-blur-sm shadow-soft dark:shadow-soft-dark rounded-soft p-5 animate-pulse-soft border-double-editorial">
      <div className="flex-1">
        <div className="h-5 bg-accent/10 dark:bg-accent/20 rounded w-3/4 mb-2 animate-pulse-soft"></div>
        <div
          className="h-5 bg-accent/10 dark:bg-accent/20 rounded w-1/2 animate-pulse-soft"
          style={{ animationDelay: "0.2s" }}
        ></div>
      </div>
      <div className="flex items-center gap-2">
        <div
          className="h-10 w-10 bg-accent/10 dark:bg-accent/20 rounded-soft animate-pulse-soft"
          style={{ animationDelay: "0.1s" }}
        ></div>
        <div
          className="h-10 w-10 bg-accent/10 dark:bg-accent/20 rounded-soft animate-pulse-soft"
          style={{ animationDelay: "0.3s" }}
        ></div>
        <div
          className="h-10 w-10 bg-accent/10 dark:bg-accent/20 rounded-soft animate-pulse-soft"
          style={{ animationDelay: "0.4s" }}
        ></div>
      </div>
    </li>
  );
}
