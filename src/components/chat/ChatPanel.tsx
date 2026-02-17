"use client";

import * as React from "react";

import { Button } from "@/components/ui/Button";
import { TextArea } from "@/components/ui/TextArea";
import { cn } from "@/lib/cn";
import type { ChatMessage } from "@/types/rag";

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] whitespace-pre-wrap rounded-lg border px-3 py-2 text-sm leading-6",
          isUser
            ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950"
            : "border-zinc-200 bg-white text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50",
        )}
      >
        {message.content || (isUser ? "" : <span className="text-zinc-400">…</span>)}
      </div>
    </div>
  );
}

export function ChatPanel({
  messages,
  isStreaming,
  error,
  onSend,
}: {
  messages: ChatMessage[];
  isStreaming: boolean;
  error: string | null;
  onSend: (text: string) => void;
}) {
  const [text, setText] = React.useState("");
  const listRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length, isStreaming]);

  const submit = React.useCallback(() => {
    const q = text.trim();
    if (!q) return;
    onSend(q);
    setText("");
  }, [onSend, text]);

  return (
    <div className="flex h-[70dvh] min-h-[520px] flex-col">
      <div ref={listRef} className="flex-1 space-y-3 overflow-auto px-4 py-4">
        {messages.length === 0 ? (
          <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-300">
            Upload documents on the left, then ask a question (e.g., “What are the key requirements?”).
          </div>
        ) : null}
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950 dark:text-red-200">
            {error}
          </div>
        ) : null}
      </div>

      <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="flex items-end gap-2"
        >
          <div className="flex-1">
            <TextArea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ask a question about the uploaded documents…"
              rows={2}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  submit();
                }
              }}
              disabled={isStreaming}
              aria-label="Chat input"
            />
            <div className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
              Press <span className="font-medium">Ctrl/⌘ + Enter</span> to send.
            </div>
          </div>
          <Button type="submit" isLoading={isStreaming} disabled={!text.trim()}>
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}

