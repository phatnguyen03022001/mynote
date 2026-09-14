# Backend Contract

The backend is the server side of the Next.js modular monolith, not a separate service.

## Boundary choices

- Route handlers: Better Auth endpoints, health endpoints, and future externally addressable/webhook APIs.
- Server actions/application functions: authenticated first-party UI mutations when they simplify transport and preserve testable feature logic.
- Feature logic: validation-independent application policy that can be tested without HTTP details.
- MongoDB access: explicit feature-owned queries; do not create a generic repository abstraction that erases query intent.

## Mutation flow

1. Parse and validate external input.
2. Resolve authenticated identity from the server session.
3. Build a query containing resource identifier **and** `userId`.
4. Perform the atomic operation if MongoDB supports it directly.
5. Map no-match to a non-disclosing not-found result.
6. Return the minimum data needed by the caller.

## Error taxonomy

Use stable application categories such as validation, unauthenticated, not-found, conflict/rate-limited, and unexpected infrastructure error. Log unexpected errors with request/correlation context but without private content or credentials.

## Idempotency and concurrency

Prefer atomic MongoDB updates over read-modify-write. Add explicit idempotency keys only for operations where duplicate delivery is realistic and harmful; do not build an idempotency framework preemptively.

## Health

`/api/health` is liveness and deliberately dependency-free. If deployment orchestration later needs readiness, add a separate readiness endpoint with bounded Mongo checks rather than making liveness depend on external systems.
