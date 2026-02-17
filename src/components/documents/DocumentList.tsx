"use client";

import * as React from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { UploadedDocument } from "@/types/rag";

function statusTone(status: UploadedDocument["status"]) {
  if (status === "processed") return "success";
  if (status === "indexing") return "info";
  return "danger";
}

function statusLabel(status: UploadedDocument["status"]) {
  if (status === "processed") return "Processed";
  if (status === "indexing") return "Indexing";
  return "Error";
}

export function DocumentList({
  documents,
  onRemove,
}: {
  documents: UploadedDocument[];
  onRemove: (id: string) => void;
}) {
  if (documents.length === 0) {
    return (
      <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-300">
        Upload one or more documents to start asking questions.
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {documents.map((d) => (
        <li
          key={d.id}
          className={cn(
            "rounded-md border border-zinc-200 bg-white p-3",
            "dark:border-zinc-800 dark:bg-zinc-950",
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
                {d.file_name}
              </div>
              <div className="mt-1 flex items-center gap-2">
                <Badge tone={statusTone(d.status)}>{statusLabel(d.status)}</Badge>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {(d.file.size / 1024).toFixed(0)} KB
                </span>
              </div>
              {d.status === "error" && d.error ? (
                <div className="mt-2 text-xs text-red-700 dark:text-red-300">
                  {d.error}
                </div>
              ) : null}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(d.id)}
              aria-label={`Remove ${d.file_name}`}
              title="Remove"
            >
              Remove
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}

