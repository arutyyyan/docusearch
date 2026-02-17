# DocuSearch (Frontend MVP)

Frontend-only MVP for a “Notebook LM alternative” focused strictly on **document search with RAG** and **precise file-level references**.

## What’s included

- **Next.js (App Router) + TypeScript + Tailwind**
- **Three-panel layout**
  - Left: **Documents** (upload + status)
  - Center: **Chat** (streaming answers)
  - Right: **References** (citations with file/page/snippet + highlighting)
- **Mockable API layer** (no backend routes are implemented here)
  - `POST /upload`
  - `POST /query`

## Running locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Configuration

The UI can run against a real backend or a local mock implementation.

- **Mock mode (default)**: no network calls; simulated upload + streaming query.
- **Real API mode**: point to your backend.

Create a `.env.local`:

```bash
NEXT_PUBLIC_USE_MOCK_API=true
# If false, requests go to NEXT_PUBLIC_API_BASE_URL (or same-origin if unset)
NEXT_PUBLIC_API_BASE_URL=
```

## Expected `/query` response shape (non-streaming)

```json
{
  "answer": "string",
  "citations": [
    {
      "file_name": "string",
      "page": 1,
      "snippet": "string",
      "score": 0.87
    }
  ]
}
```

## Streaming support (recommended)

The client supports **SSE** (`text/event-stream`) with these events:

- `event: token` + `data: <string>` (append to answer)
- `event: citations` + `data: <json citations array>`
- `event: done`

If the backend returns a single JSON response, the UI still works (with “simulated streaming” in mock mode only).
