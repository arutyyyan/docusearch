import * as React from "react";

import { cn } from "@/lib/cn";

export function AppShell({
  header,
  children,
  className,
}: {
  header?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-h-dvh bg-zinc-50 dark:bg-black", className)}>
      {header ? (
        <header className="sticky top-0 z-10 border-b border-zinc-200 bg-zinc-50/80 backdrop-blur dark:border-zinc-800 dark:bg-black/60">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3">
            {header}
          </div>
        </header>
      ) : null}
      <main className="mx-auto max-w-[1400px] px-4 py-4">{children}</main>
    </div>
  );
}

