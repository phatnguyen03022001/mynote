# Product Contract

## Primary job

When I encounter an idea, link, code fragment, reminder, or useful fact, I want to save it immediately and retrieve it later without first deciding where it belongs.

## Core loop

`capture -> inbox -> retrieve/search/pin/tag -> archive`

Capture is intentionally cheaper than organization. Inbox is the default state, not a failure to categorize.

## Note behavior

A note starts as text and may contain URLs or fenced code. Product metadata such as extracted links can enrich retrieval, but raw user content remains the source of truth. Pinning means "important now"; archive means "keep but remove from active inbox"; trash is reversible deletion.

## UX constraints

- Primary capture should be reachable immediately after sign-in.
- Core actions require no modal hierarchy or mandatory folder/tag choice.
- Search and capture receive dedicated keyboard shortcuts once the interactive note surface exists.
- Mobile capture is a first-class path, not a shrunk desktop afterthought.

## Product quality signals

Measure successful capture, retrieval latency from the user's perspective, search usefulness, archive/pin usage, and error rates before adding organizational features. Feature count is not a success metric.
