# Contributing

MyNote optimizes for small, reviewable vertical changes rather than broad refactors.

## Workflow

1. Read `VISION.md`, `RULES.md`, and the subsystem document relevant to the change.
2. Define the behavior and boundary being changed. Resolve material unknowns before consequential implementation; classify version-sensitive evidence as `FACT`, `INFERENCE`, `ASSUMPTION`, or `UNKNOWN`.
3. Reproduce the missing/incorrect behavior with a test or deterministic check where practical.
4. Implement the smallest correct change.
5. Run the local quality gates. For consequential work, review the actual diff against product/system authority and check ownership, dependency direction, security, testability, and accidental complexity.
6. Update docs only when a product or system contract changed.

This repository currently works directly on `main`; do not create alternate branches/worktrees unless the repository owner changes that policy.

## Required checks

```bash
pnpm check
pnpm build
```

Run `pnpm e2e` for user-visible critical journeys and `docker build -t mynote:verify .` when container/build behavior changes.

## Publishing to `main`

This is a `MAIN_ONLY` repository. Publication is serial and drift-sensitive.

1. Commit only reviewed, intended changes.
2. Run `pnpm git:prepush`; it freshly resolves remote `main`, rejects stale tracking state/divergence, and requires a clean working tree.
3. Push with a normal non-force `git push origin main`.
4. Run `pnpm git:verify-push`; it requires remote `main` to equal local `HEAD`.

If preflight reports remote drift, stop. Fetch and reconcile explicitly; do not reset, overwrite, or force-push unknown remote work.

## Commit guidance

Use concise imperative commits such as `feat: add note archive flow`, `fix: scope note update by owner`, or `docs: clarify auth boundary`. Never commit generated reports, local environment files, secrets, or debug dumps.
