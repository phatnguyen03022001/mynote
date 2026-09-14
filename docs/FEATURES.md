# Feature Registry

This file owns product scope. Status reflects intent, not an implementation-completeness claim.

## Now — V1

- Social authentication with Google and GitHub.
- Quick text capture into Inbox.
- Timeline of the signed-in user's notes, newest first.
- Edit with autosave/clear save state.
- Search over note content and tags.
- Lightweight `#tags` parsed from content or assigned explicitly.
- Pin/unpin and archive/unarchive.
- Trash and restore; permanent cleanup can be delayed/automated later.
- URL extraction and lightweight preview metadata with safe fetch limits.
- Markdown/code rendering sufficient for snippets, not a block editor.
- Keyboard-first desktop interactions and responsive mobile UX.
- Private-by-default ownership isolation.
- Optimistic feedback where rollback semantics are clear.
- Installable PWA once capture UI is stable.

## Next — only after V1 behavior is solid

- Better search ranking/highlighting.
- Saved filters or a minimal command palette if repeated navigation cost justifies them.
- Background URL metadata refresh with strict SSRF controls if synchronous enrichment is too slow.
- Trash retention/TTL policy and bulk cleanup.
- Import/export for user portability.

## Later — evidence required

- Sharing/public notes, attachments, offline writes, collaboration, reminders, or cross-device push.

## Explicit non-goals

No block editor, folder tree, backlinks/graph, realtime collaborative editing, AI assistant/RAG, vector database, custom password system, microservices, event bus, or speculative plugin platform in V1.
