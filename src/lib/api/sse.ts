export type SseEvent = {
  event: string;
  data: string;
};

export async function* readSse(
  res: Response,
  { signal }: { signal?: AbortSignal } = {},
): AsyncGenerator<SseEvent> {
  if (!res.body) return;
  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";
  let event = "message";
  let dataLines: string[] = [];

  const flush = () => {
    const data = dataLines.join("\n");
    const out: SseEvent = { event, data };
    event = "message";
    dataLines = [];
    return out;
  };

  while (true) {
    if (signal?.aborted) return;
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // Process complete lines.
    while (true) {
      const idx = buffer.indexOf("\n");
      if (idx === -1) break;
      const line = buffer.slice(0, idx).replace(/\r$/, "");
      buffer = buffer.slice(idx + 1);

      if (line === "") {
        if (dataLines.length > 0) yield flush();
        continue;
      }
      if (line.startsWith(":")) continue; // comment

      const sep = line.indexOf(":");
      const field = sep === -1 ? line : line.slice(0, sep);
      const rawValue = sep === -1 ? "" : line.slice(sep + 1);
      const valueStr = rawValue.startsWith(" ") ? rawValue.slice(1) : rawValue;

      if (field === "event") event = valueStr || "message";
      if (field === "data") dataLines.push(valueStr);
    }
  }

  if (dataLines.length > 0) yield flush();
}

