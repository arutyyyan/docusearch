import type {
  Citation,
  QueryResponse,
  QueryStreamEvent,
  UploadedDocument,
} from "@/types/rag";

function sleep(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const t = setTimeout(() => resolve(), ms);
    if (!signal) return;
    if (signal.aborted) {
      clearTimeout(t);
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(t);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });
}

function chooseCitations(docs: UploadedDocument[], question: string): Citation[] {
  const processed = docs.filter((d) => d.status === "processed");
  const picked = processed.slice(0, 3);
  const terms = question
    .trim()
    .split(/\s+/)
    .map((t) => t.replace(/[^\p{L}\p{N}]/gu, ""))
    .filter(Boolean)
    .slice(0, 5);

  return picked.map((d, i) => {
    const isPdf = d.file.type === "application/pdf" || d.file_name.toLowerCase().endsWith(".pdf");
    const page = isPdf ? ((i + 1) * 2) : null;
    const snippet = `…${terms.length ? ` ${terms.join(" ")} ` : " "}… (mock excerpt from ${
      d.file_name
    })`;
    const score = Math.max(0.65, 0.92 - i * 0.08);
    return { file_name: d.file_name, page, snippet, score };
  });
}

export async function mockUpload(_files: File[], { signal }: { signal?: AbortSignal } = {}) {
  // Simulate upload + indexing.
  await sleep(450, signal);
  return { ok: true as const };
}

export function mockQuery(question: string, docs: UploadedDocument[]): QueryResponse {
  const citations = chooseCitations(docs, question);
  const answer =
    citations.length === 0
      ? "I don’t have any processed documents yet. Upload documents, wait for indexing to complete, then ask again."
      : [
          "Based on the uploaded materials, here’s the most direct answer supported by the retrieved excerpts:",
          "",
          `- Key point A derived from the strongest matching passages.`,
          `- Key point B corroborated across multiple files.`,
          "",
          "See the References panel for file/page/snippet-level grounding.",
        ].join("\n");

  return { answer, citations };
}

export async function* mockQueryStream(
  question: string,
  docs: UploadedDocument[],
  { signal }: { signal?: AbortSignal } = {},
): AsyncGenerator<QueryStreamEvent> {
  const { answer, citations } = mockQuery(question, docs);

  try {
    const chunks = answer.split(/(\s+)/); // keep whitespace tokens
    for (const c of chunks) {
      if (signal?.aborted) return;
      yield { type: "token", value: c };
      await sleep(18, signal);
    }
    yield { type: "citations", value: citations };
    yield { type: "done" };
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") return;
    yield { type: "error", message: err instanceof Error ? err.message : "Unknown error" };
  }
}

