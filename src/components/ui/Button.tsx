import * as React from "react";

import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  isLoading,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md border text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:pointer-events-none disabled:opacity-60",
        size === "sm" ? "h-8 px-3" : "h-10 px-4",
        variant === "primary" && [
          "border-transparent bg-zinc-900 text-white hover:bg-zinc-800",
          "dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200",
        ],
        variant === "secondary" && [
          "border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50",
          "dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900",
        ],
        variant === "ghost" && [
          "border-transparent bg-transparent text-zinc-900 hover:bg-zinc-100",
          "dark:text-zinc-50 dark:hover:bg-zinc-900",
        ],
        variant === "danger" && [
          "border-transparent bg-red-600 text-white hover:bg-red-700",
          "dark:bg-red-600 dark:hover:bg-red-700",
        ],
        className,
      )}
      aria-busy={isLoading ? true : undefined}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? (
        <span
          className="inline-block size-4 animate-spin rounded-full border-2 border-white/40 border-t-white dark:border-zinc-950/30 dark:border-t-zinc-950"
          aria-hidden="true"
        />
      ) : null}
      {children}
    </button>
  );
}

