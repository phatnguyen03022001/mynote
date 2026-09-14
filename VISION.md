# MyNote Vision

## Problem

Fast capture tools such as messaging a note to yourself have almost zero friction, but unrelated information collapses into one chronological chat. Traditional note systems solve retrieval by asking the user to maintain pages, folders, graphs, or taxonomies before those structures have earned their cost.

MyNote keeps the low-friction capture behavior and adds just enough structure to retrieve information reliably.

## Product promise

**Capture first. Organize later.** A note should be storable in seconds and findable later without requiring the user to design a personal knowledge system.

## Product principles

1. Capture has fewer decisions than organization.
2. Search beats hierarchy for the default retrieval path.
3. Inbox, pin, tags, archive, and trash are sufficient until observed usage proves otherwise.
4. Keyboard workflows are first-class; mobile remains fully usable.
5. Private by default. A user can never observe another user's note through data, timing-sensitive application behavior, or error wording under normal operation.
6. Progressive complexity: no subsystem exists only because the product might need it someday.
7. Fast perceived response matters more than decorative UI complexity.

## Success criteria

- A signed-in user can capture a short note or link with minimal interaction.
- Recent or important notes are recoverable quickly via search, tags, pinning, and filters.
- Inbox can be cleaned without destructive deletion through archive.
- Core capture/retrieve actions remain usable on mobile and keyboard-only desktop navigation.
- Cross-user data isolation is enforced at the persistence query boundary and covered by integration tests.
- Production failures are diagnosable without logging note content, OAuth tokens, or secrets.

## Explicit non-goals for V1

No Notion-style block system, nested folders, graph view, realtime collaboration, AI/RAG, vector database, microservices, event bus, custom password auth, public sharing, or complex offline conflict resolution.

A non-goal can become a feature only after a concrete user problem demonstrates that the added product and operational complexity is justified.
