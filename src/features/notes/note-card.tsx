"use client";

import { useEffect, useRef, useState } from "react";
import { Archive, Inbox, Pencil, Pin, RotateCcw, Trash2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { NoteRecord, NoteView } from "./note-repository";

export type NotePatchBody =
  | { action: "update"; content?: string; pinned?: boolean; archived?: boolean }
  | { action: "trash" }
  | { action: "restore" };

type SaveState = "idle" | "dirty" | "saving" | "saved" | "error";

export function NoteCard({
  note,
  view,
  onPatch,
}: {
  note: NoteRecord;
  view: NoteView;
  onPatch: (id: string, body: NotePatchBody) => Promise<unknown>;
}) {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(note.content);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const lastSaved = useRef(note.content);

  useEffect(() => {
    if (!editing || content === lastSaved.current) return;
    setSaveState("dirty");
    const timer = window.setTimeout(async () => {
      setSaveState("saving");
      try {
        await onPatch(note.id, { action: "update", content });
        lastSaved.current = content;
        setSaveState("saved");
      } catch {
        setSaveState("error");
      }
    }, 500);
    return () => window.clearTimeout(timer);
  }, [content, editing, note.id, onPatch]);

  const status = saveState === "dirty" ? "Unsaved" : saveState === "saving" ? "Saving…" : saveState === "saved" ? "Saved" : saveState === "error" ? "Save failed" : null;

  return (
    <Card>
      <CardContent className="space-y-4 p-4 sm:p-5">
        {editing ? (
          <Textarea aria-label="Edit note content" value={content} onChange={(event) => setContent(event.target.value)} className="min-h-28 resize-y" autoFocus />
        ) : (
          <p className="whitespace-pre-wrap break-words text-sm leading-6">{note.content}</p>
        )}

        {note.tags.length ? (
          <div className="flex flex-wrap gap-1.5">
            {note.tags.map((tag) => <Badge key={tag} variant="secondary">#{tag}</Badge>)}
          </div>
        ) : null}

        {note.urls.length ? (
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            {note.urls.map((url) => <a key={url} href={url} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-foreground">{new URL(url).hostname}</a>)}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{new Date(note.updatedAt).toLocaleString()}</span>
            {status ? <span aria-live="polite">{status}</span> : null}
          </div>
          <div className="flex gap-1">
            {view !== "trash" ? <Button size="icon-sm" variant="ghost" aria-label={editing ? "Stop editing note" : "Edit note"} onClick={() => {
              if (!editing) {
                setContent(note.content);
                lastSaved.current = note.content;
                setSaveState("idle");
              }
              setEditing((value) => !value);
            }}>{editing ? <X aria-hidden="true" /> : <Pencil aria-hidden="true" />}</Button> : null}
            {view !== "trash" ? <Button size="icon-sm" variant="ghost" aria-label={note.pinned ? "Unpin note" : "Pin note"} onClick={() => void onPatch(note.id, { action: "update", pinned: !note.pinned })}><Pin aria-hidden="true" className={note.pinned ? "fill-current" : ""} /></Button> : null}
            {view === "inbox" ? <Button size="icon-sm" variant="ghost" aria-label="Archive note" onClick={() => void onPatch(note.id, { action: "update", archived: true })}><Archive aria-hidden="true" /></Button> : null}
            {view === "archive" ? <Button size="icon-sm" variant="ghost" aria-label="Move to inbox" onClick={() => void onPatch(note.id, { action: "update", archived: false })}><Inbox aria-hidden="true" /></Button> : null}
            {view === "trash" ? <Button size="icon-sm" variant="ghost" aria-label="Restore note" onClick={() => void onPatch(note.id, { action: "restore" })}><RotateCcw aria-hidden="true" /></Button> : <Button size="icon-sm" variant="ghost" aria-label="Move note to trash" onClick={() => void onPatch(note.id, { action: "trash" })}><Trash2 aria-hidden="true" /></Button>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
