# Operations

## Environments

Local development supports native Node with Docker MongoDB (`docker compose up -d mongo`) and full Compose parity (`docker compose up --build`). Production is expected to run the Next.js standalone artifact with MongoDB Atlas and deployment-managed secrets.

Keep development, preview/staging, and production credentials/databases isolated. Never point automated tests at production data.

## Build and deploy

The immutable release unit is the tested source commit and its standalone/Docker build. CI must pass lint, typecheck, tests, production build, E2E smoke, and Docker build before a release is considered promotable.

Application startup must not perform destructive data migrations. Schema/data migrations are explicit, restartable operations run before code depends exclusively on the new shape.

## Health semantics

`/api/health` is liveness and must stay dependency-free so Mongo/provider outages do not cause process restart loops. Add a separate bounded readiness check if the hosting platform later needs dependency-aware traffic gating.

## Deployment strategy

Prefer platform-native immutable deployments with health verification. Roll forward for ordinary application defects when safe; rollback to the previous known-good immutable build when a release causes immediate user impact and data compatibility allows it.

A code rollback is not a database rollback. Data changes must be backward/forward compatible across the intended deployment window or accompanied by a deliberate recovery plan.

## Secrets

Production secrets live in deployment/secret-manager configuration, never Git. Rotation procedure: create new credential, deploy consumers, validate, revoke old credential. OAuth secret rotation also verifies provider callback configuration.

## Backup and restore

Before production user data is considered durable, configure Atlas backup appropriate to the tier and perform a restore drill. A backup that has never been restored is not a proven recovery mechanism. Document target RPO/RTO when usage/business requirements make them meaningful.

## Incident basics

1. Establish user impact and affected boundary.
2. Stop further harmful rollout if necessary.
3. Inspect safe logs/metrics and recent deploy/config changes.
4. Mitigate via rollback/config isolation/feature disable only if data safety permits.
5. Preserve evidence without exporting private note content unnecessarily.
6. After recovery, record root cause and a concrete prevention/detection improvement.
