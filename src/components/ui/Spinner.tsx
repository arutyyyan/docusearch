import { cn } from "@/lib/cn";

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block size-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900",
        "dark:border-zinc-700 dark:border-t-zinc-100",
        className,
      )}
      aria-hidden="true"
    />
  );
}

