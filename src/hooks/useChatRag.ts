"use client";

import * as React from "react";

import { queryRagStream } from "@/lib/api/rag";
import { createId } from "@/lib/id";
import type { Citation, ChatMessage, UploadedDocument } from "@/types/rag";

export function useChatRag({
  documents,
}: {
  documents: UploadedDocument[];
}) {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [citations, setCitations] = React.useState<Citation[]>([]);
  const [lastQuestion, setLastQuestion] = React.useState("");
  const [isStreaming, setIsStreaming] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const abortRef = React.useRef<AbortController | null>(null);

  const stop = React.useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsStreaming(false);
  }, []);

  const reset = React.useCallback(() => {
    stop();
    setMessages([]);
    setCitations([]);
    setLastQuestion("");
    setError(null);
  }, [stop]);

  const send = React.useCallback(
    async (questionRaw: string) => {
      const question = questionRaw.trim();
      if (!question) return;

      stop();
      setError(null);
      setLastQuestion(question);

      const now = Date.now();
      const userMsg: ChatMessage = {
        id: createId("msg"),
        role: "user",
        content: question,
        createdAt: now,
      };
      const assistantId = createId("msg");
      const assistantMsg: ChatMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
        createdAt: now + 1,
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setCitations([]);
      setIsStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const usableDocs = documents.filter((d) => d.status === "processed");
        for await (const evt of queryRagStream(question, usableDocs, {
          signal: controller.signal,
        })) {
          if (evt.type === "token") {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, content: m.content + evt.value }
                  : m,
              ),
            );
          } else if (evt.type === "citations") {
            setCitations(evt.value);
          } else if (evt.type === "error") {
            setError(evt.message);
          } else if (evt.type === "done") {
            setIsStreaming(false);
            abortRef.current = null;
          }
        }
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        setError(e instanceof Error ? e.message : "Query failed");
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [documents, stop],
  );

  return { messages, citations, lastQuestion, isStreaming, error, send, stop, reset };
}

