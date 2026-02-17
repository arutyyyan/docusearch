import * as React from "react";

import { cn } from "@/lib/cn";

export type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea({ className, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={cn(
          "min-h-10 w-full resize-none rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900",
          "placeholder:text-zinc-400",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-60",
          "dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500",
          className,
        )}
        {...props}
      />
    );
  },
);

