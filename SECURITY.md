# Security Policy

## Reporting

Do not publish credentials, tokens, private note content, or exploit details in a public issue. Report suspected vulnerabilities privately to the repository owner through an appropriate private channel.

## Supported code

Security fixes target the current `main` branch. Dependencies should remain on supported stable/LTS lines and known security patches should be applied promptly.

## Project security invariants

- User-owned notes are authorized in the database predicate, not after retrieval.
- Secrets remain server-only and are never committed or exposed through `NEXT_PUBLIC_` variables.
- OAuth/session behavior is delegated to Better Auth; application code does not implement custom token storage.
- Logs must not contain note bodies, OAuth tokens, cookies, database URIs, or auth secrets.
- Validation happens at external/server trust boundaries.

For the engineering threat model and controls, see `docs/SECURITY.md`.
