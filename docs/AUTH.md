# Authentication and Authorization

Better Auth is the authentication system. Google and GitHub are the initial social providers. MongoDB is used through Better Auth's official MongoDB adapter.

## Server boundary

`src/lib/auth/server.ts` lazily constructs auth configuration so build-time tooling does not require live credentials or network access. `src/app/api/auth/[...all]/route.ts` adapts the Better Auth handler to Next.js only when a request reaches the route.

OAuth providers are enabled only when both client ID and client secret are configured. Partial provider configuration is rejected by environment validation.

## Trust model

- OAuth establishes identity; it does not authorize note access.
- Session identity is read server-side. Never accept `userId` from browser input as authority.
- Every user-owned persistence operation scopes its predicate by authenticated user ID.
- Better Auth owns sessions/accounts; MyNote does not copy tokens or provider account records into note-domain documents.

## Secrets

`BETTER_AUTH_SECRET`, OAuth secrets, and `MONGODB_URI` are server-only. Production credentials belong in the deployment secret store. Local `.env.local` is ignored by Git. Never log secrets, cookies, authorization headers, or OAuth payloads.

## Provider callbacks

Callback URLs are environment-specific and should point to the Better Auth Next.js endpoint for each configured provider. Provider console configuration is deployment setup, not hardcoded application logic.
