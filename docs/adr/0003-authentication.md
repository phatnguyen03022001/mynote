# ADR 0003: Better Auth social authentication

**Status:** Accepted

## Context

MyNote needs secure account/session handling and Google plus developer-friendly GitHub login without spending product scope on custom password storage, OAuth protocol code, or a bespoke session system.

## Decision

Use Better Auth with its Next.js integration and MongoDB adapter. Initial providers are Google and GitHub. Provider enablement is environment-driven and requires complete credential pairs. Application authorization remains separate and is enforced on every user-owned resource query.

## Consequences

The project delegates a security-sensitive subsystem to a maintained library and avoids custom credential flows. It inherits Better Auth's upgrade/configuration surface and must keep it patched. Provider outages affect login but must not weaken existing authorization. Facebook/custom password auth are not part of V1.
