# MyNote Foundation Design

**Status:** Approved in chat; written spec for repository bootstrap review.
**Date:** 2026-09-15
**Repository:** `phatnguyen03022001/mynote`
**Branch policy:** `main` only. No worktrees or auxiliary local clones.

## 1. Product intent

MyNote is a keyboard-first personal inbox for capturing and retrieving short notes, links, code snippets, and lightweight markdown with less organizational overhead than Notion or Obsidian.

The motivating problem is message-thread note taking: capture is fast, but unrelated items become mixed together and retrieval degrades over time. MyNote preserves chat-like capture speed while adding search, tags, pinning, archive, and ownership isolation.

Core loop:

`Capture -> Inbox -> Search/Pin/Tag -> Archive`

Primary product principles:
- capture must be faster than organizing;
- retrieval must not depend on remembering where an item was filed;
- private by default;
- keyboard-first but fully usable on touch;
- progressive structure, not mandatory hierarchy;
- features must earn their maintenance cost.

## 2. V1 scope

V1 includes:
- Google and GitHub sign-in;
- quick-create text/markdown notes;
- edit with autosave semantics;
- pin/unpin;
- archive/unarchive;
- soft delete and restore;
- lightweight tags parsed or assigned explicitly;
- full-text-oriented search and filters;
- URL metadata preview;
- code-block rendering with syntax highlighting;
- responsive UI and installable PWA behavior;
- keyboard shortcuts for primary actions.

Explicit non-goals for V1:
- Notion-style block editor;
- folder trees or nested notebooks;
- graph/backlink view;
- realtime collaboration;
- public sharing;
- AI/RAG/vector search;
- custom password authentication;
- microservices, queues, or event buses;
- complex offline conflict resolution.

## 3. Technology baseline

Runtime and framework policy:
- Node.js 24 LTS line for development, CI, and containers;
- Next.js 16 Active LTS line, App Router;
- TypeScript in strict mode;
- React version supplied by the selected Next.js release;
- npm lockfile is the dependency source of truth.

Application stack:
- shadcn/ui components with Tailwind CSS;
- Better Auth with Google and GitHub social providers;
- official Better Auth MongoDB adapter;
- MongoDB Atlas in hosted environments;
- official `mongodb` Node.js driver for application persistence;
- Zod at untrusted/trust boundaries;
- Vitest and React Testing Library for unit/component tests;
- Playwright for browser E2E;
- GitHub Actions for CI;
- Vercel as the initial application deployment target.

Version rule: use supported stable/LTS releases, commit exact resolved versions through `package-lock.json`, and upgrade deliberately through reviewed dependency changes. Security patch releases take precedence over feature-version preference.

## 4. Architecture

Use a modular monolith in one Next.js application. Modules are separated by product capability, not by speculative infrastructure layers.

High-level flow:

`Browser -> Next.js route/component -> application operation -> repository -> MongoDB`

Trust flow for mutations:

`Input -> validate -> authenticate -> authorize ownership -> operate -> persist`

Primary modules:
- `auth`: session/provider integration and server-side identity boundary;
- `notes`: note commands, queries, lifecycle, and domain rules;
- `search`: query normalization and note retrieval filters;
- `metadata`: safe URL metadata extraction;
- `shared`: genuinely cross-cutting primitives only.

Server Components are the default rendering model. Client Components are limited to interactive islands requiring browser state/events. Application code must not import persistence internals into UI components.

No service/repository interface is introduced unless there are at least two meaningful implementations or isolation materially improves testing. Concrete modules are preferred over ceremony.

## 5. Data model and ownership

Application-owned `notes` documents contain:
- `_id`;
- `userId`;
- `content`;
- normalized `tags[]`;
- extracted `urls[]` and optional metadata cache;
- `pinned`, `archived`;
- `createdAt`, `updatedAt`;
- nullable `deletedAt`.

Better Auth owns its authentication collections. Application code must not duplicate or shadow session/account state.

Every user-owned read or write is scoped by authenticated `userId` in the persistence predicate. Fetching by `_id` and checking ownership afterward is forbidden. The invariant is conceptually `{ _id, userId }` for single-resource operations.

Initial indexes must support actual access paths only: user timeline ordering, pinned/archive filters, tag retrieval, soft-delete filtering, and the chosen search mechanism. Indexes are documented with the query they serve and removed if unused.

Pagination uses stable cursor semantics for timelines; offset pagination is not the default for growing note feeds. Search implementation begins with the smallest MongoDB capability that satisfies product requirements and must not introduce a vector database in V1.

## 6. Authentication and security boundary

Better Auth provides social sign-in with Google and GitHub and persists its own auth records in MongoDB. Password authentication is out of scope.

Route-level redirects are not authorization. Every protected server operation resolves a real server-side session and derives `userId` from that session; client-supplied owner identifiers are ignored.

Secrets remain server-only:
- MongoDB connection strings;
- Better Auth secret;
- Google client secret;
- GitHub client secret.

Only explicitly public configuration may use `NEXT_PUBLIC_*`. `.env*` secret files are gitignored; `.env.example` contains names and safe placeholders only.

Security controls include:
- input validation and bounded payload sizes;
- ownership-scoped data access;
- safe URL fetching with SSRF defenses for metadata extraction;
- no rendering of unsanitized HTML;
- secure cookie/session defaults from Better Auth;
- dependency and framework security patch discipline;
- rate limiting only where abuse evidence or public exposure justifies it.

Security-sensitive failures must fail closed and must not include secrets or raw credentials in logs.

## 7. Docker and local development

Docker is a reproducible development/deployment path, not a second architecture.

Planned container assets:
- multi-stage `Dockerfile` for production Next.js standalone output;
- `.dockerignore` excluding git metadata, local caches, secrets, and build output;
- `compose.yaml` for local app + MongoDB development;
- pinned MongoDB 8.0 patch image for deterministic local behavior;
- named MongoDB volume;
- health checks and dependency readiness;
- non-root application runtime user;
- production image containing only runtime artifacts.

Local modes:
1. native Node.js app + local Docker MongoDB for fastest iteration;
2. full Compose stack for environment parity;
3. native/containerized app + MongoDB Atlas by overriding `MONGODB_URI`.

Compose must not contain production secrets. Values come from local environment or ignored env files. Production uses Atlas and deployment-platform secrets rather than a Mongo container.

Docker build must be CI-verifiable. Container startup must not perform destructive schema/data operations implicitly.

## 8. Frontend design

Primary screens:
- sign-in;
- inbox/timeline;
- archived notes;
- trash;
- lightweight settings/session controls.

The inbox uses a persistent capture composer and newest-first note stream. Note organization is optional after capture, not a prerequisite to save.

Interaction rules:
- visible keyboard focus and complete keyboard navigation;
- `Cmd/Ctrl+K` focuses search;
- primary create/save workflow has a keyboard shortcut without blocking normal text entry;
- pin/archive/delete actions are optimistic only when rollback is deterministic;
- destructive actions are recoverable through soft delete;
- loading and error states are local to the smallest useful boundary.

Accessibility target is WCAG 2.2 AA for implemented flows. shadcn/ui primitives may be customized visually but their accessible behavior must not be removed.

Client state is ephemeral UI state. Durable note state comes from the server; no global client store is introduced until a demonstrated cross-tree state problem exists.

## 9. Backend and error model

Server actions are preferred for same-app mutations where they keep the contract simple. Route handlers are used for Better Auth, public protocol boundaries, metadata endpoints, or cases requiring explicit HTTP semantics.

Application operations receive validated input plus authenticated identity and return typed success/error results. UI code must not depend on MongoDB driver errors.

Error categories:
- `VALIDATION`: malformed or unsupported input;
- `UNAUTHENTICATED`: no valid session;
- `NOT_FOUND`: resource absent or not owned by caller;
- `CONFLICT`: stale/idempotency conflict when applicable;
- `RATE_LIMITED`: explicit abuse protection only;
- `INTERNAL`: unexpected server failure.

Authorization-sensitive resource misses use the same external behavior for nonexistent and foreign-owned documents to avoid ownership disclosure.

Unexpected errors are logged server-side with safe context and surfaced to users as stable, non-sensitive messages. No empty catch blocks or generic success fallbacks are allowed.

## 10. Testing strategy

Testing follows risk, not file count.

Unit tests cover deterministic domain helpers, tag/query normalization, validation, and formatting behavior.

Integration tests cover:
- MongoDB repository queries and indexes;
- ownership isolation between two users;
- create/edit/pin/archive/delete/restore mutations;
- auth-required boundaries;
- metadata extraction safety rules.

Component tests cover interactive UI state where browser E2E would be unnecessarily expensive.

Playwright E2E covers critical journeys:
- sign in via test-safe auth setup;
- create and edit a note;
- search/filter retrieval;
- pin and archive;
- delete and restore;
- protected-route/session behavior;
- primary keyboard workflow.

Tests must be deterministic, isolated, and fail for a meaningful behavioral reason. Coverage percentage is diagnostic, not a target; critical authorization and persistence paths require direct tests regardless of aggregate coverage.

## 11. Observability and operations

Observability begins small and structured:
- server logs use consistent event names and severity;
- request/correlation identifiers are propagated where useful;
- logs include safe identifiers and operation context, never secrets or note content by default;
- unexpected failures are observable separately from expected validation/auth outcomes;
- client error boundaries provide recoverable UI states.

Initial operational expectations:
- three environment classes: local, preview, production;
- preview uses isolated deployment configuration;
- production secrets live in the deployment platform, not GitHub or repository files;
- database changes and index changes are explicit, repeatable operations;
- deploys are reversible at the application layer;
- data-destructive changes require a documented recovery path;
- Atlas backup/restore capability is treated as an operational dependency before production-critical use.

No metrics platform, distributed tracing backend, queue, cache cluster, or APM vendor is required for V1. Add infrastructure only when an observed operational question cannot be answered cheaply with existing signals.

## 12. CI, quality gates, and delivery

Every change on `main` must remain releasable. Because this repository intentionally uses a single branch, local verification is mandatory before push.

Required quality gates once the scaffold exists:
- dependency install from lockfile;
- formatting check;
- lint;
- TypeScript typecheck;
- unit/integration tests;
- production Next.js build;
- Docker image build;
- targeted Playwright E2E when the tested flow exists.

CI must use pinned major action versions and least-privilege permissions. Secrets are not available to untrusted build steps unless a workflow explicitly requires them.

Commits are small, coherent, and use conventional intent prefixes such as `docs:`, `build:`, `test:`, `feat:`, `fix:`, and `refactor:`. Direct pushes to `main` are allowed by project policy but must not bypass the same verification expected from a reviewed change.

Rollback is primarily a known-good application commit/deployment. Database changes must therefore remain backward compatible until rollback is no longer required.

## 13. Documentation structure

Repository documentation will be split by responsibility to avoid duplicated sources of truth:
- `README.md`: project entry point, quick start, stack summary, doc index;
- `VISION.md`: product problem, principles, success criteria, non-goals;
- `AGENTS.md`: coding-agent operating contract and required workflow;
- `RULES.md`: project invariants, conventions, and forbidden shortcuts;
- `CONTRIBUTING.md`: human contribution workflow;
- `SECURITY.md`: vulnerability reporting and public security policy;
- `docs/PRODUCT.md`: product model, users, journeys, scope;
- `docs/FEATURES.md`: feature registry and acceptance boundaries;
- `docs/ARCHITECTURE.md`: system topology, module boundaries, dependency rules;
- `docs/FRONTEND.md`, `BACKEND.md`, `DATA.md`, `AUTH.md`, `API.md`;
- `docs/TESTING.md`, `SECURITY.md`, `OBSERVABILITY.md`, `OPERATIONS.md`;
- `docs/PERFORMANCE.md`, `ACCESSIBILITY.md`, `ROADMAP.md`;
- `docs/adr/`: durable architectural decisions only;
- `docs/superpowers/specs/` and `docs/superpowers/plans/`: approved designs and executable plans.

Documentation describes current contracts or explicit roadmap state. Speculative designs that are neither accepted nor scheduled do not belong in normative docs.

## 14. Agent operating contract

Coding agents must read `AGENTS.md`, `RULES.md`, and the relevant domain docs before changing behavior. They must prefer the smallest correct vertical change and preserve existing conventions.

Agents must not:
- add a dependency when platform/runtime capability is sufficient;
- introduce an abstraction for hypothetical future implementations;
- move persistence logic into UI components;
- trust client-provided identity or ownership fields;
- expose server secrets to browser code or logs;
- suppress TypeScript, lint, test, or build failures to obtain a green run;
- use `any` as an escape hatch without a documented external-boundary reason;
- swallow errors or convert failures into false success;
- change architectural boundaries without updating docs and, when durable, an ADR;
- open, mutate, clone, or create an alternate local repository/worktree for this project.

Required workflow:
`read context -> define behavior -> failing test where applicable -> minimal implementation -> targeted verification -> full relevant gates -> review diff -> commit`

The only authorized local repository path is `/Users/tienphat/Developer/mynote`. Work is performed on `main` only unless the user explicitly changes that policy.

## 15. Foundation acceptance criteria

The repository foundation is complete when:
- the documented file hierarchy exists and has no contradictory normative guidance;
- a Next.js 16 + strict TypeScript app builds on Node 24 LTS;
- shadcn/ui is initialized without introducing an unnecessary design-system wrapper;
- Better Auth is wired for Google and GitHub with MongoDB persistence and server-only secrets;
- MongoDB access is centralized enough to enforce ownership-scoped note queries;
- Docker supports reproducible production build plus local Mongo development;
- `.env.example` documents required variables without real credentials;
- lint, typecheck, tests, Next.js build, and Docker build are scriptable locally and in CI;
- unit/integration/E2E test structure exists and proves at least one critical vertical slice;
- README setup instructions work from a fresh clone;
- no V1 non-goal is accidentally scaffolded as infrastructure.

## 16. Deliberate trade-offs

A modular monolith is chosen over microservices because deployment, consistency, and debugging simplicity dominate independent scaling needs for this product.

MongoDB is chosen because the note aggregate is document-shaped, Better Auth has a supported adapter, and Atlas removes database operations burden. This does not justify schema-less application code: TypeScript types, validation, indexes, and migration discipline remain required.

Better Auth is chosen over custom OAuth/session code because authentication is security-sensitive commodity infrastructure. Google and GitHub maximize practical portfolio value while keeping provider count small.

Docker is supported for parity and reproducibility, but native macOS development remains first-class because forcing every edit through containers adds latency without product value.
