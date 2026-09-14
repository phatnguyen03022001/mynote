# Accessibility

Target WCAG 2.2 AA for product UI.

## Required behavior

- All actions are operable with keyboard alone and have visible focus.
- Native semantic elements are preferred; custom widgets implement correct roles, names, states, and keyboard behavior.
- Form inputs have programmatic labels and errors connected to the relevant field.
- Focus moves intentionally after dialogs/destructive confirmations and returns to a sensible origin.
- Color is never the only carrier of state; contrast meets AA expectations.
- Motion respects `prefers-reduced-motion` and no essential operation depends on animation.
- Touch targets and responsive layouts remain usable on small screens/zoom.

## Keyboard-first product rules

Shortcuts are discoverable and do not fire while typing when they conflict with text input. `Cmd/Ctrl+K` style command/search behavior must preserve browser/platform expectations. Escape/Enter semantics are explicit per interaction.

## Testing

Component tests cover names/roles and keyboard behavior for custom interactions. Playwright critical flows should include keyboard-only paths where practical. Automated tooling supplements, but does not replace, manual focus/order/screen-reader review for complex widgets.
