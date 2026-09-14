<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# MyNote agent contract

Read `VISION.md` and `RULES.md` before non-trivial work, then read only the subsystem docs relevant to the change. Keep the Next.js generated block above intact; `next dev` may regenerate it.

## Working policy

- Work on `main` only unless the repository owner explicitly changes the policy.
- Make the smallest correct vertical change; do not add speculative architecture.
- Before using a Next.js API that may have changed, follow the generated rule above and inspect the bundled Next.js docs.
- Prefer existing dependencies/platform capabilities. Explain and justify any new production dependency.
- Never weaken TypeScript, lint, tests, authz, or validation to make a check pass.

## Mandatory boundaries

- Server Components by default; small Client Components only for browser interaction.
- Validate untrusted input at the server boundary.
- Derive user identity from the server session, never client-provided identity.
- Scope every note persistence query/mutation by authenticated `userId` in the query itself.
- Do not leak secrets or private note content to client bundles, logs, test snapshots, or commits.
- Better Auth owns auth/session persistence; feature code owns note behavior.

## Verification

Run `pnpm check` and `pnpm build` before considering a change complete. Run relevant Playwright and Docker checks when those surfaces change. Inspect `git diff` for unrelated edits and update the owning documentation only when a contract changed.
