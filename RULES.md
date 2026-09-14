# Engineering Rules

These are project invariants. Prefer the smallest correct change that preserves them.

## Architecture

- Keep MyNote a modular monolith. Do not add services, queues, caches, repositories, or generic abstractions without a current requirement.
- Organize product logic by feature; shared `lib/` code is reserved for true cross-feature infrastructure.
- Dependency direction is UI/transport -> application/feature logic -> persistence/infrastructure. Infrastructure must not import UI.
- Route handlers exist for HTTP boundaries such as auth, health, and external integrations. Internal web mutations should prefer server-side application functions/server actions when they reduce ceremony.

## Type and validation rules

- TypeScript remains strict. Do not introduce `any`, unchecked casts, or suppressed compiler errors to bypass a design problem.
- Validate untrusted input at the first server trust boundary with Zod or an equally explicit schema.
- Environment variables are parsed once through the server env boundary. Secrets never use `NEXT_PUBLIC_`.
- Model expected failures explicitly; do not swallow exceptions or return success on failed persistence.

## Authentication and authorization

- Authentication answers who the user is; authorization is still required for every user-owned resource operation.
- Every note read/write/delete predicate includes the authenticated `userId`. Never fetch a note by `_id` and authorize ownership afterward.
- Foreign-owned and nonexistent notes should have the same externally observable not-found behavior.
- Better Auth owns account/session persistence. Do not duplicate session or provider-account state in application collections.

## Frontend

- Server Components are the default. Add a Client Component only where browser state/events require one.
- Keep client islands small and colocated with the interaction they own.
- shadcn/ui primitives are preferred over one-off component systems; add only components currently needed.
- Preserve keyboard navigation, visible focus, semantic HTML, and responsive behavior in every feature.

## Testing and delivery

- Behavior changes require a failing test or reproducible failing check before implementation whenever practical.
- Authorization-sensitive code requires integration coverage against a real MongoDB instance; mocks alone are insufficient.
- Before committing: `pnpm check` and `pnpm build` must pass. Relevant E2E tests must pass for changed critical journeys.
- CI failures are release blockers, not optional signals.
- Never commit `.env*`, tokens, OAuth secrets, MongoDB credentials, or production data.

## Change discipline

- Do not add a dependency if the platform or existing dependency already solves the problem simply.
- Do not perform unrelated refactors inside a feature change.
- New durable architecture decisions require an ADR; routine implementation details do not.
- Documentation changes follow contract changes. Avoid docs that merely restate code line-by-line.
