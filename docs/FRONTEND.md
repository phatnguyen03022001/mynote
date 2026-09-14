# Frontend Contract

## Rendering model

Use React Server Components by default. Data needed to render a route should normally be loaded on the server close to the owning feature. Client Components exist only for browser events, optimistic interaction, focus/keyboard behavior, or local ephemeral state.

Do not introduce a global client state library for server-owned note data. URL state is preferred for shareable filters/search; local component state is preferred for transient editor interaction.

## Client state and interaction libraries

- TanStack Query owns client-side server-state caching only when a browser interaction benefits from cache, invalidation, background refresh, or optimistic mutation. It does not replace Server Components or server-side data access; mount a QueryClient provider only at the narrowest client boundary that needs it.
- Zustand is reserved for cross-component ephemeral UI state that is awkward to colocate. It must not become the source of truth for persisted notes, auth, or URL-shareable state.
- Motion (`motion/react`) is the animation layer for meaningful interaction feedback. Prefer CSS for trivial transitions and respect reduced-motion preferences.
- next-intl owns translated UI messages. The initial locale is `en`; server-side translation is the default. Add a client provider only when a Client Component needs translated messages, and do not add locale-prefixed routing until a second locale or product requirement makes routing semantics necessary.
- Drag-and-drop has no dependency yet. Add one only when an approved reorder/drag interaction exists and native pointer/keyboard behavior is insufficient.

## UI system

Tailwind CSS and shadcn/ui are the component baseline. Add shadcn primitives on demand rather than installing a catalog. Product components should compose primitives without hiding semantics behind generic "smart" abstractions.

The visual system is neutral monochrome: white-to-black surfaces and grayscale accents in both light and dark themes. Semantic destructive states may use red. Theme preference defaults to the operating-system setting and persists an explicit user override.

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
