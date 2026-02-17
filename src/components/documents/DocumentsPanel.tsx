"use client";

import * as React from "react";

import { DocumentDropzone } from "@/components/documents/DocumentDropzone";
import { DocumentList } from "@/components/documents/DocumentList";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import type { UploadedDocument } from "@/types/rag";

export function DocumentsPanel({
  documents,
  isUploading,
  error,
  onAddFiles,
  onRemoveDocument,
}: {
  documents: UploadedDocument[];
  isUploading: boolean;
  error: string | null;
  onAddFiles: (files: File[]) => void;
  onRemoveDocument: (id: string) => void;
}) {
  const processed = documents.filter((d) => d.status === "processed").length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge tone={processed > 0 ? "success" : "neutral"}>
            {processed}/{documents.length} ready
          </Badge>
          {isUploading ? (
            <span className="inline-flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <Spinner className="size-3" /> Uploading…
            </span>
          ) : null}
        </div>
      </div>

      <DocumentDropzone disabled={isUploading} onFiles={onAddFiles} />

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950 dark:text-red-200">
          {error}
        </div>
      ) : null}

      <DocumentList documents={documents} onRemove={onRemoveDocument} />
    </div>
  );
}

