# MyNote

MyNote is a keyboard-first personal inbox for notes, links, snippets, and code. The product optimizes for capture and retrieval, not for maintaining a complicated knowledge-management system.

> Capture first. Organize later.

## Product shape

The core loop is intentionally small: capture into Inbox, retrieve with search/tags/pins, then archive when the item is no longer active. See [VISION.md](VISION.md) and [docs/PRODUCT.md](docs/PRODUCT.md) for the product contract.

## Stack

- Next.js 16 App Router, React 19, TypeScript strict
- Tailwind CSS and shadcn/ui
- TanStack Query for client-side server state; Zustand for bounded ephemeral UI state
- Motion for interaction animation; next-intl for localization
- Better Auth with Google and GitHub OAuth
- MongoDB with the official Node.js driver and Better Auth MongoDB adapter
- Zod at environment and input trust boundaries
- Vitest + React Testing Library, Playwright
- Docker/Compose, GitHub Actions, Vercel-compatible standalone output

Runtime is pinned to Node 24 LTS and pnpm 11. See `.node-version`, `.nvmrc`, and `packageManager` in `package.json`.

## Local development

```bash
corepack enable
pnpm install
cp .env.example .env.local
# Set BETTER_AUTH_SECRET, e.g. `openssl rand -base64 32`
docker compose up -d mongo
pnpm dev
```

Open `http://localhost:3000`. `GET /api/health` is dependency-free liveness; it intentionally does not prove MongoDB or OAuth readiness.

For full container parity, set any desired OAuth variables and run `docker compose up --build`.

## Quality gates

```bash
pnpm check       # lint + typecheck + unit/component tests
pnpm build       # production Next.js build
pnpm e2e:install # one-time local Chromium install
pnpm e2e         # browser smoke/critical flows
```

CI runs the same checks and also verifies the production Docker image.

## Documentation map

- [VISION.md](VISION.md): why the product exists, principles, success, non-goals
- [RULES.md](RULES.md): non-negotiable engineering invariants
- [AGENTS.md](AGENTS.md): instructions for coding agents
- [docs/FEATURES.md](docs/FEATURES.md): Now / Next / Later product registry
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): system boundaries and dependency direction
- [docs/FRONTEND.md](docs/FRONTEND.md), [docs/BACKEND.md](docs/BACKEND.md), [docs/DATA.md](docs/DATA.md), [docs/AUTH.md](docs/AUTH.md): subsystem contracts
- [docs/TESTING.md](docs/TESTING.md), [docs/SECURITY.md](docs/SECURITY.md), [docs/OPERATIONS.md](docs/OPERATIONS.md): reliability and delivery contracts
- [docs/adr/](docs/adr/README.md): durable architectural decisions and their trade-offs

Documentation is a contract, not a diary. Update the owning document when a boundary or invariant changes; do not duplicate the same rule into multiple files.
