import { USE_MOCK_API } from "@/lib/api/config";
import { apiUrl, assertOk } from "@/lib/api/http";
import { readSse } from "@/lib/api/sse";
import { mockQueryStream, mockUpload } from "@/lib/mock/mockRag";
import type { QueryResponse, QueryStreamEvent, UploadedDocument } from "@/types/rag";

export async function uploadDocuments(
  files: File[],
  { signal }: { signal?: AbortSignal } = {},
) {
  if (USE_MOCK_API) return await mockUpload(files, { signal });

  const form = new FormData();
  for (const f of files) form.append("files", f);

  const res = await fetch(apiUrl("/upload"), { method: "POST", body: form, signal });
  await assertOk(res);
  return { ok: true as const };
}

export async function* queryRagStream(
  question: string,
  documents: UploadedDocument[],
  { signal }: { signal?: AbortSignal } = {},
): AsyncGenerator<QueryStreamEvent> {
  if (USE_MOCK_API) {
    yield* mockQueryStream(question, documents, { signal });
    return;
  }

  const res = await fetch(apiUrl("/query"), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "text/event-stream, application/json",
    },
    body: JSON.stringify({
      question,
      // Keep payload flexible for a real backend:
      documents: documents.map((d) => ({ file_name: d.file_name })),
    }),
    signal,
  });

  await assertOk(res);
  const contentType = res.headers.get("content-type") ?? "";

  if (contentType.includes("text/event-stream")) {
    for await (const evt of readSse(res, { signal })) {
      if (evt.event === "token") {
        yield { type: "token", value: evt.data };
      } else if (evt.event === "citations") {
        const parsed = JSON.parse(evt.data) as QueryResponse["citations"];
        yield { type: "citations", value: parsed };
      } else if (evt.event === "done") {
        yield { type: "done" };
      } else if (evt.event === "error") {
        yield { type: "error", message: evt.data || "Unknown error" };
      }
    }
    return;
  }

  // Non-streaming JSON fallback.
  const json = (await res.json()) as QueryResponse;
  yield { type: "token", value: json.answer };
  yield { type: "citations", value: json.citations ?? [] };
  yield { type: "done" };
}

