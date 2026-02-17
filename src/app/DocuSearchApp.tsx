"use client";

import { DocumentsPanel } from "@/components/documents/DocumentsPanel";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { ReferencesPanel } from "@/components/references/ReferencesPanel";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Panel, PanelContent, PanelHeader, PanelTitle } from "@/components/ui/Panel";
import { USE_MOCK_API } from "@/lib/api/config";
import { useChatRag } from "@/hooks/useChatRag";
import { useDocuments } from "@/hooks/useDocuments";

export function DocuSearchApp() {
  const docs = useDocuments();
  const chat = useChatRag({ documents: docs.documents });

  return (
    <AppShell
      header={
        <>
          <div className="flex items-center gap-3">
            <div className="text-sm font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              DocuSearch
            </div>
            <Badge tone="info" title="Frontend-only MVP">
              MVP
            </Badge>
            <Badge tone={USE_MOCK_API ? "warning" : "success"}>
              {USE_MOCK_API ? "Mock API" : "Live API"}
            </Badge>
          </div>
          <div className="hidden text-xs text-zinc-500 dark:text-zinc-400 md:block">
            Grounded answers with file/page/snippet-level references
          </div>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)_360px]">
        <Panel>
          <PanelHeader>
            <PanelTitle>Documents</PanelTitle>
          </PanelHeader>
          <PanelContent>
            <DocumentsPanel
              documents={docs.documents}
              isUploading={docs.isUploading}
              error={docs.error}
              onAddFiles={docs.addFiles}
              onRemoveDocument={docs.removeDocument}
            />
          </PanelContent>
        </Panel>

        <Panel className="min-w-0">
          <PanelHeader>
            <PanelTitle>Chat</PanelTitle>
            <div className="flex items-center gap-2">
              {chat.isStreaming ? (
                <Button variant="secondary" size="sm" onClick={chat.stop}>
                  Stop
                </Button>
              ) : null}
              <Button
                variant="ghost"
                size="sm"
                onClick={chat.reset}
                disabled={chat.messages.length === 0}
              >
                Clear
              </Button>
            </div>
          </PanelHeader>
          <ChatPanel
            messages={chat.messages}
            isStreaming={chat.isStreaming}
            error={chat.error}
            onSend={chat.send}
          />
        </Panel>

        <Panel className="min-w-0">
          <PanelHeader>
            <PanelTitle>References</PanelTitle>
          </PanelHeader>
          <PanelContent>
            <ReferencesPanel citations={chat.citations} query={chat.lastQuestion} />
          </PanelContent>
        </Panel>
      </div>
    </AppShell>
  );
}

