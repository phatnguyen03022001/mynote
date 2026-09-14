# Contributing

MyNote optimizes for small, reviewable vertical changes rather than broad refactors.

## Workflow

1. Read `VISION.md`, `RULES.md`, and the subsystem document relevant to the change.
2. Define the behavior and boundary being changed.
3. Reproduce the missing/incorrect behavior with a test or deterministic check where practical.
4. Implement the smallest correct change.
5. Run the local quality gates and inspect the diff for unrelated edits.
6. Update docs only when a product or system contract changed.

This repository currently works directly on `main`; do not create alternate branches/worktrees unless the repository owner changes that policy.

## Required checks

```bash
pnpm check
pnpm build
```

Run `pnpm e2e` for user-visible critical journeys and `docker build -t mynote:verify .` when container/build behavior changes.

## Commit guidance

Use concise imperative commits such as `feat: add note archive flow`, `fix: scope note update by owner`, or `docs: clarify auth boundary`. Never commit generated reports, local environment files, secrets, or debug dumps.
