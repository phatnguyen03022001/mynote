"use client";

import { useCallback, useDeferredValue, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { Archive, Inbox, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { UserMenu } from "@/components/auth/user-menu";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { NoteCard, type NotePatchBody } from "./note-card";
import type { NoteRecord, NoteView } from "./note-repository";

async function json<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

function notesUrl(view: NoteView, query: string) {
  const params = new URLSearchParams({ view });
  if (query) params.set("q", query);
  return `/api/notes?${params}`;
}

const views: Array<{ value: NoteView; label: string; icon: typeof Inbox }> = [
  { value: "inbox", label: "Inbox", icon: Inbox },
  { value: "archive", label: "Archive", icon: Archive },
  { value: "trash", label: "Trash", icon: Trash2 },
];

export function NotesWorkspace({ user }: { user: { name?: string | null; email: string } }) {
  const queryClient = useQueryClient();
  const [view, setView] = useState<NoteView>("inbox");
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const deferredSearch = useDeferredValue(search.trim());

  const notesQuery = useQuery({
    queryKey: ["notes", view, deferredSearch],
    queryFn: () => json<NoteRecord[]>(notesUrl(view, deferredSearch)),
  });

  const createMutation = useMutation({
    mutationFn: (content: string) => json<NoteRecord>("/api/notes", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ content }),
    }),
    onSuccess: async () => {
      setDraft("");
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note saved");
    },
    onError: () => toast.error("Could not save note"),
  });

  const { mutateAsync: patchAsync } = useMutation({
    mutationFn: ({ id, body }: { id: string; body: NotePatchBody }) => json<NoteRecord>(`/api/notes/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
    onError: () => toast.error("Could not update note"),
  });

  const patchNote = useCallback(
    (id: string, body: NotePatchBody) => patchAsync({ id, body }),
    [patchAsync],
  );

  function submit() {
    if (!draft.trim() || createMutation.isPending) return;
    createMutation.mutate(draft);
  }

  return (
    <div className="mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="border-b border-border p-4 md:border-b-0 md:border-r md:p-6">
        <div className="mb-6">
          <p className="text-lg font-semibold tracking-tight">MyNote</p>
          <p className="truncate text-xs text-muted-foreground">{user.name || user.email}</p>
        </div>
        <nav className="grid grid-cols-3 gap-2 md:grid-cols-1" aria-label="Note views">
          {views.map(({ value, label, icon: Icon }) => (
            <Button key={value} variant={view === value ? "secondary" : "ghost"} className="justify-start" onClick={() => setView(value)}>
              <Icon aria-hidden="true" /> {label}
            </Button>
          ))}
        </nav>
      </aside>

      <main className="min-w-0 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-3xl space-y-6">
          <header className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{views.find((item) => item.value === view)?.label}</h1>
              <p className="text-sm text-muted-foreground">Capture first. Organize later.</p>
            </div>
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <UserMenu user={user} />
            </div>
          </header>

          {view === "inbox" ? (
            <Card>
              <CardContent className="space-y-3 p-4">
                <Textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") { event.preventDefault(); submit(); }
                  }}
                  placeholder="Capture a thought, link, snippet, or #tag…"
                  aria-label="Capture note"
                  className="min-h-28 resize-y border-0 px-0 shadow-none focus-visible:ring-0"
                />
                <div className="flex items-center justify-between gap-3 border-t pt-3">
                  <span className="text-xs text-muted-foreground">⌘/Ctrl + Enter to save</span>
                  <Button onClick={submit} disabled={!draft.trim() || createMutation.isPending} aria-label="Save note">Save note</Button>
                </div>
              </CardContent>
            </Card>
          ) : null}

          <div className="relative">
            <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search notes and tags…" className="pl-9" />
          </div>

          <section aria-label="Notes" className="space-y-3">
            {notesQuery.isLoading ? <><Skeleton className="h-32 w-full" /><Skeleton className="h-24 w-full" /></> : null}
            {notesQuery.isError ? <p className="rounded-lg border p-6 text-sm text-destructive">Could not load notes.</p> : null}
            {!notesQuery.isLoading && notesQuery.data?.length === 0 ? <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">Nothing here yet.</div> : null}
            <AnimatePresence initial={false}>
              {notesQuery.data?.map((note) => (
                <motion.article key={note.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <NoteCard note={note} view={view} onPatch={patchNote} />
                </motion.article>
              ))}
            </AnimatePresence>
          </section>
        </div>
      </main>
    </div>
  );
}
