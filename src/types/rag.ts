export type Citation = {
  file_name: string;
  page: number | null;
  snippet: string;
  score: number;
};

export type QueryResponse = {
  answer: string;
  citations: Citation[];
};

export type DocumentStatus = "indexing" | "processed" | "error";

export type UploadedDocument = {
  id: string;
  file: File;
  file_name: string;
  status: DocumentStatus;
  error?: string;
  uploadedAt: number;
};

export type ChatMessage =
  | { id: string; role: "user"; content: string; createdAt: number }
  | { id: string; role: "assistant"; content: string; createdAt: number };

export type QueryStreamEvent =
  | { type: "token"; value: string }
  | { type: "citations"; value: Citation[] }
  | { type: "done" }
  | { type: "error"; message: string };

