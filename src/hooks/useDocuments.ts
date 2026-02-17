import * as React from "react";

import { uploadDocuments } from "@/lib/api/rag";
import { createId } from "@/lib/id";
import type { DocumentStatus, UploadedDocument } from "@/types/rag";

const ACCEPTED_MIME = new Set([
  "application/pdf",
  "text/plain",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

function isAccepted(file: File) {
  if (ACCEPTED_MIME.has(file.type)) return true;
  const name = file.name.toLowerCase();
  return name.endsWith(".pdf") || name.endsWith(".txt") || name.endsWith(".docx");
}

export function useDocuments() {
  const [documents, setDocuments] = React.useState<UploadedDocument[]>([]);
  const [isUploading, setIsUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const removeDocument = React.useCallback((id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const updateStatus = React.useCallback(
    (id: string, status: DocumentStatus, err?: string) => {
      setDocuments((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status, error: err } : d)),
      );
    },
    [],
  );

  const addFiles = React.useCallback(async (files: File[]) => {
    setError(null);
    const accepted = files.filter(isAccepted);
    const rejected = files.filter((f) => !isAccepted(f));

    if (rejected.length > 0) {
      setError(`Unsupported file type: ${rejected.map((f) => f.name).join(", ")}`);
    }
    if (accepted.length === 0) return;

    const newDocs: UploadedDocument[] = accepted.map((file) => ({
      id: createId("doc"),
      file,
      file_name: file.name,
      status: "indexing",
      uploadedAt: Date.now(),
    }));

    setDocuments((prev) => [...newDocs, ...prev]);
    setIsUploading(true);

    try {
      await uploadDocuments(accepted);
      // Mark each as processed (simulate indexing completion).
      for (const d of newDocs) updateStatus(d.id, "processed");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Upload failed";
      for (const d of newDocs) updateStatus(d.id, "error", msg);
      setError(msg);
    } finally {
      setIsUploading(false);
    }
  }, [updateStatus]);

  const processedDocuments = React.useMemo(
    () => documents.filter((d) => d.status === "processed"),
    [documents],
  );

  return {
    documents,
    processedDocuments,
    isUploading,
    error,
    addFiles,
    removeDocument,
    setDocuments,
  };
}

