"use client";

import * as React from "react";

import { HighlightedText } from "@/components/HighlightedText";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import type { Citation } from "@/types/rag";

function formatScore(score: number) {
  if (!Number.isFinite(score)) return "—";
  return score.toFixed(2);
}

export function ReferencesPanel({
  citations,
  query,
}: {
  citations: Citation[];
  query: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs text-zinc-500 dark:text-zinc-400">
          Retrieved passages used to ground the answer.
        </div>
        <Badge tone={citations.length ? "info" : "neutral"}>
          {citations.length} citation{citations.length === 1 ? "" : "s"}
        </Badge>
      </div>

      {citations.length === 0 ? (
        <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-300">
          Ask a question to see file/page/snippet references here.
        </div>
      ) : (
        <ul className="space-y-2">
          {citations
            .slice()
            .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
            .map((c, idx) => (
              <li
                key={`${c.file_name}-${idx}`}
                className={cn(
                  "rounded-md border border-zinc-200 bg-white p-3",
                  "dark:border-zinc-800 dark:bg-zinc-950",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
                      {c.file_name}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                      <span>
                        Page:{" "}
                        <span className="font-medium text-zinc-700 dark:text-zinc-300">
                          {c.page ?? "—"}
                        </span>
                      </span>
                      <span className="text-zinc-300 dark:text-zinc-700">•</span>
                      <span>
                        Score:{" "}
                        <span className="font-medium text-zinc-700 dark:text-zinc-300">
                          {formatScore(c.score)}
                        </span>
                      </span>
                    </div>
                  </div>
                  <Badge tone="neutral">#{idx + 1}</Badge>
                </div>

                <div className="mt-3 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-200">
                  <HighlightedText text={c.snippet} query={query} />
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

