# API and Transport Contracts

MyNote does not create a REST API for every internal operation by default. Transport follows the consumer boundary.

## Current HTTP endpoints

- `GET /api/health`: public dependency-free liveness. Returns `{ "status": "ok" }` with `Cache-Control: no-store`.
- `/api/auth/[...all]`: Better Auth HTTP surface for social auth/session behavior.

## First-party product mutations

Prefer server actions or thin route handlers that call feature application functions. Regardless of transport, input validation and authenticated ownership policy are identical.

## Contract rules

- JSON contracts use stable machine-readable error categories rather than leaking database/provider messages.
- Resource identifiers from clients are untrusted input.
- Mutations return only fields needed for the immediate UI reconciliation.
- Do not expose MongoDB document structure as a public API contract accidentally.
- External/public APIs, if introduced, require explicit versioning, rate limits, auth model, and an ADR because they create compatibility obligations.
