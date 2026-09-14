# Security Engineering

## Assets and trust boundaries

Primary assets are private note content, account identity/session state, OAuth credentials, database credentials, and availability of the capture/retrieval flow. Trust boundaries exist at browser input, OAuth callbacks, server actions/HTTP handlers, outbound metadata fetches, deployment environment, and MongoDB.

## Threats and controls

### Broken object authorization

Highest-risk application threat. All note queries and mutations include authenticated `userId` in the MongoDB predicate. Foreign-owned and nonexistent resources map to the same external not-found behavior. Integration tests with two distinct users are mandatory for ownership-sensitive operations.

### Session/OAuth compromise

Delegate protocol/session mechanics to Better Auth, use HTTPS in production, secure provider callback configuration, rotate compromised secrets, and never copy provider tokens into note-domain data. Session cookies/tokens are excluded from logs.

### Injection and malformed input

Validate untrusted input before application logic. Mongo queries are constructed from typed fields rather than accepting client-supplied query documents/operators. Render user content through safe Markdown/code rendering; never inject unsanitized HTML.

### SSRF from link previews

URL metadata fetching is not implemented until controls exist: allow only HTTP/HTTPS, resolve/deny loopback/private/link-local addresses, cap redirects/body/time, re-check each redirect target, set a safe user agent, and never forward user cookies/authorization. Prefer a dedicated bounded fetch function with direct tests.

### Secret/data leakage

Secrets remain server-only. Logs and telemetry exclude note bodies, query text when sensitive, cookies, OAuth payloads, auth headers, MongoDB URIs, and environment values. Error responses expose stable categories, not provider/database stack details.

### Abuse and availability

When publicly exposed, rate-limit auth-sensitive/high-cost endpoints based on measured abuse patterns. Bound note sizes, URL metadata work, search page size, and external request timeouts before scale makes unbounded work an incident vector.

## Dependency and supply-chain posture

Use pinned lockfiles, supported Node/Next/Mongo lines, minimal dependencies, automated CI builds, and prompt security patching. New dependencies require a concrete capability gap and maintenance/security review proportional to risk.

## Security review triggers

Public sharing, file uploads, outbound URL fetching, webhooks, API keys, realtime collaboration, or new authentication methods require an explicit threat-model update before release.
