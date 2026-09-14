# ADR 0001: Modular monolith

**Status:** Accepted

## Context

MyNote is a focused personal note product with one web client, one ownership model, and no demonstrated independent scaling/availability boundary between product capabilities. Distributed services would add network contracts, deployment coordination, observability, consistency, and local-development cost before providing user value.

## Decision

Deploy MyNote as one Next.js modular monolith. Keep feature boundaries explicit inside the codebase and isolate infrastructure behind small concrete modules, but do not create service boundaries, queues, or internal RPC.

## Consequences

Positive: simple transactions/data flow, fast local development, one deployable, lower operational cost, easier end-to-end reasoning. Negative: feature teams cannot deploy independently and process-level failures share a blast radius. If measured scale/ownership requirements later justify extraction, existing feature boundaries provide a seam; extraction is not pre-built.
