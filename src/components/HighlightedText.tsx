import * as React from "react";

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildTerms(query: string) {
  const raw = query
    .trim()
    .split(/\s+/)
    .map((t) => t.replace(/[^\p{L}\p{N}]/gu, ""))
    .filter((t) => t.length >= 2);
  return Array.from(new Set(raw)).slice(0, 8);
}

export function HighlightedText({
  text,
  query,
  className,
}: {
  text: string;
  query: string;
  className?: string;
}) {
  const terms = React.useMemo(() => buildTerms(query), [query]);
  const parts = React.useMemo(() => {
    if (!terms.length) return [text];
    const re = new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "gi");
    return text.split(re);
  }, [terms, text]);

  return (
    <span className={className}>
      {parts.map((p, idx) => {
        const isHit = terms.length
          ? terms.some((t) => t.toLowerCase() === p.toLowerCase())
          : false;
        return isHit ? (
          <mark
            key={idx}
            className="rounded bg-amber-200/70 px-0.5 text-zinc-900 dark:bg-amber-400/30 dark:text-zinc-50"
          >
            {p}
          </mark>
        ) : (
          <React.Fragment key={idx}>{p}</React.Fragment>
        );
      })}
    </span>
  );
}

