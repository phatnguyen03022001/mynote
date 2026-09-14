# Performance

MyNote optimizes the capture/retrieve path, not benchmark scores in isolation.

## Frontend budgets

Keep server-renderable work out of the client bundle. Avoid global client state and large editor dependencies until product requirements need them. Critical capture UI should become interactive without loading unrelated archive/search/detail code.

Use performance measurement before introducing memoization, caches, virtualization, or dynamic-loading complexity. Virtualize long lists only when measured rendering cost justifies it.

## Backend/query posture

Every production query must have a bounded result size. Timeline/search use cursor pagination and indexes matching query predicates/sorts. Avoid N+1 metadata/auth lookups and unbounded regex scans. Inspect MongoDB query plans when a query becomes latency-sensitive.

## External work

URL preview requests, if shipped, have strict connection/read timeouts, response-size limits, redirect limits, and concurrency bounds. The primary note save path should not be held hostage by slow third-party hosts; move enrichment off the critical response path if measurements show it is material.

## Targets

Initial engineering targets are directional: capture feedback should feel immediate, ordinary indexed note queries should remain comfortably below interactive latency budgets, and regressions in p95 critical-path latency/client JS should block unnecessary complexity. Set numeric SLOs only after representative production traffic exists.
