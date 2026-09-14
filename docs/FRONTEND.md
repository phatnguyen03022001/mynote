# Frontend Contract

## Rendering model

Use React Server Components by default. Data needed to render a route should normally be loaded on the server close to the owning feature. Client Components exist only for browser events, optimistic interaction, focus/keyboard behavior, or local ephemeral state.

Do not introduce a global client state library for server-owned note data. URL state is preferred for shareable filters/search; local component state is preferred for transient editor interaction.

## UI system

Tailwind CSS and shadcn/ui are the component baseline. Add shadcn primitives on demand rather than installing a catalog. Product components should compose primitives without hiding semantics behind generic "smart" abstractions.

## Interaction principles

- Capture is the dominant action and should remain reachable without navigation ceremony.
- Optimistic updates are appropriate for reversible pin/archive changes; rollback and error feedback are mandatory.
- Editing/autosave must expose a small state machine such as idle -> dirty -> saving -> saved/error; never imply persistence before success.
- Keyboard shortcuts cannot override standard browser/text-editing shortcuts unexpectedly.
- Empty/loading/error states are designed states, not leftovers.

## Accessibility

Semantic controls, visible focus, proper labels, keyboard reachability, reduced-motion respect, and adequate contrast are required. See `ACCESSIBILITY.md` for acceptance expectations.

## Performance

Avoid moving server-renderable code into the client bundle. Dynamic imports are a tool for genuinely heavy client-only surfaces, not a default. Track regressions in interaction latency and client JavaScript rather than optimizing synthetic microbenchmarks.
