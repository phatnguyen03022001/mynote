# Architecture

## Shape

MyNote is a Next.js modular monolith. The web UI, application behavior, auth HTTP boundary, and data access deploy as one application process; MongoDB is the durable datastore and Better Auth owns authentication/session persistence.

```text
Browser
  -> Next.js App Router
       -> Server Components / small Client islands
       -> Server actions / Route handlers
            -> feature application logic
                 -> MongoDB driver / Better Auth adapter
                      -> MongoDB Atlas or local MongoDB
```

## Dependency boundaries

- `src/app/`: routing, composition, HTTP/server-action boundaries. It must not become a dumping ground for business rules.
- `src/components/ui/`: shadcn/ui primitives and generic visual composition only.
- `src/features/<feature>/`: future feature-owned schemas, application logic, UI, and tests that change together.
- `src/lib/env/`: environment parsing.
- `src/lib/auth/`: Better Auth configuration/provider mapping.
- `src/lib/db/`: shared Mongo connection infrastructure, not user-authorization policy by itself.

## Request flow

For authenticated user mutations the invariant is:

`input -> validate -> authenticate -> authorize in resource predicate -> apply operation -> persist -> return typed result`

Transport code should be thin. A feature function receives validated intent plus authenticated identity; persistence queries enforce owner scope.

## Failure model

Expected validation/not-found/conflict conditions return controlled outcomes. Unexpected infrastructure failures are logged with safe context and surface as generic user errors. Do not leak whether a foreign user's resource exists.

## Scaling posture

Scale the monolith vertically/horizontally and add indexes before introducing distributed architecture. A subsystem is extracted only when a measured operational or ownership boundary cannot be handled cleanly inside the monolith. Future scale is not itself a reason to split services today.
