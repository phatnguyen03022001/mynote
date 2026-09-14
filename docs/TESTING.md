# Testing Strategy

Testing protects behavior and system boundaries; raw coverage percentage is a signal, not the target.

## Layers

### Unit and component

Use Vitest and React Testing Library for pure parsing/policy logic, UI states, keyboard behavior, and small components. Prefer observable behavior over implementation details.

### Integration

Run real MongoDB-backed tests for note persistence, indexes/query assumptions, authorization predicates, and cross-user isolation. High-risk scenarios include user A attempting to read/update/archive/delete user B's identifier and confirming the result is indistinguishable from a missing note.

Auth integration tests should verify protected operations require a valid session boundary; do not unit-test Better Auth internals.

### End-to-end

Use Playwright for a small set of critical journeys: app availability, authentication flow where test provider setup permits it, create/edit/search, pin/archive, delete/restore, and session protection. Keep E2E count small enough to remain reliable.

## Test design

- A behavioral bug gets a regression test that fails before the fix when practical.
- Tests own their data and do not depend on execution order.
- Avoid arbitrary sleeps; wait on UI/network state.
- Mock third-party metadata/OAuth edges where external nondeterminism is not what the test is proving.
- Do not mock MongoDB in tests whose purpose is query correctness or ownership isolation.

## Required gates

`pnpm check` covers lint, TypeScript, and Vitest. `pnpm build` validates production compilation. `pnpm e2e` covers browser smoke/critical journeys. Docker changes additionally require a successful image build and Compose config validation.
