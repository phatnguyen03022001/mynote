# Observability

The goal is fast diagnosis with minimum private-data exposure.

## Logs

Use structured server logs with timestamp, severity, operation/event name, request/correlation identifier when available, safe user identifier representation where useful, latency, and error category. Never log note bodies, auth headers, cookies, OAuth tokens, database URIs, secrets, or raw provider responses containing credentials.

Expected validation/not-found outcomes should not generate noisy error logs. Unexpected exceptions should retain stack/context on the server while returning generic client errors.

## Metrics

Start with a small operational set: request/error rate, p50/p95 latency for capture/search/mutations, auth failure rate by safe category, Mongo operation latency/error rate, and external metadata fetch latency/error rate once that feature exists. Product analytics must remain separate from operational logs.

## Tracing

Do not add distributed tracing while the system is a single monolith unless diagnosis evidence shows logs/metrics are insufficient. If tracing is introduced, propagate a correlation ID across Next.js boundaries and sanitize attributes using the same data policy as logs.

## Alerting

Alert on sustained user-impacting conditions, not isolated events: elevated 5xx rate, authentication outage, material latency regression, Mongo connectivity failure, or deployment health failure. Alerts must link to actionable runbook context in `OPERATIONS.md`.
