import * as React from "react";

import { cn } from "@/lib/cn";

export function Panel({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-zinc-200 bg-white shadow-sm",
        "dark:border-zinc-800 dark:bg-zinc-950",
        className,
      )}
      {...props}
    />
  );
}

export function PanelHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 border-b border-zinc-200 px-4 py-3",
        "dark:border-zinc-800",
        className,
      )}
      {...props}
    />
  );
}

export function PanelTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn("text-sm font-semibold text-zinc-900 dark:text-zinc-50", className)}
      {...props}
    />
  );
}

export function PanelContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-4 py-3", className)} {...props} />;
}

