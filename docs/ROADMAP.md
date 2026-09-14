# Roadmap

Roadmap is organized by vertical product capability, not infrastructure projects for their own sake.

## Foundation

- Reproducible Next.js/TypeScript/shadcn/Mongo/Better Auth baseline.
- Environment validation, health endpoint, Docker/Compose, CI, test harness, architecture/security contracts.
- Google/GitHub provider configuration boundary.

Exit: clean quality gates, reproducible build/container, no secrets required at build time.

## Milestone 1 — private capture

- Auth UI/session-protected app shell.
- Create/list/edit note with strict per-user ownership.
- Inbox timeline with cursor pagination.
- Integration tests proving cross-user isolation.

Exit: a signed-in user can safely use MyNote instead of messaging themselves for basic text capture.

## Milestone 2 — retrieval and cleanup

- Search, tags, pin, archive, trash/restore.
- Keyboard navigation/shortcuts and optimistic reversible actions.
- Search/query indexes validated with realistic data.

Exit: notes remain recoverable as the collection grows; inbox can be kept clean without destructive deletion.

## Milestone 3 — rich capture polish

- URL extraction/safe preview metadata.
- Markdown/code rendering, autosave state polish.
- PWA/installability and mobile capture refinement.
- Operational metrics and production backup/restore drill.

Exit: daily-use polish without expanding into a general knowledge-management suite.

## Evidence-gated work

Sharing, uploads, offline writes, collaboration, reminders, AI/vector search, and organizational hierarchy require real usage evidence plus updated security/architecture review before entering a milestone.
