# ADR 0002: MongoDB persistence

**Status:** Accepted

## Context

The core entity is a user-owned note with small evolving metadata such as tags, URLs, archive/pin/delete state. The project also wants one datastore usable by Better Auth through an official adapter and straightforward local Docker parity.

## Decision

Use MongoDB through the official Node.js driver for application persistence and Better Auth's official MongoDB adapter for auth persistence. Production targets MongoDB Atlas; local development uses the pinned MongoDB 8.0 container.

## Consequences

Document evolution is natural and auth/application data share one operational database platform. Correctness still requires explicit document contracts, indexes, migrations, and ownership-scoped predicates. The project accepts MongoDB query/index semantics rather than hiding them behind a database-agnostic abstraction.
