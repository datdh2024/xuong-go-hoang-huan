# US-20 — Floating chat popup with contact channels

**Status:** pending
**Category:** Feature
**Priority:** High
**Risk:** Medium

---

## User Story

As a **website visitor**, I want to click a chat bubble and see a popup panel with Zalo, Facebook Messenger, and phone options, so I can contact the workshop using my preferred app without filling out a full contact form.

---

## Background

The existing `FloatingCTA` component shows Zalo and Phone as plain icon buttons. This story replaces/extends it with a proper chat popup panel that expands on click, giving visitors a clear entry point for quick contact — the primary conversion action for this business.

---

## Acceptance Criteria

- [ ] A floating chat button is visible on all pages (bottom-right), replacing the current `FloatingCTA`
- [ ] Clicking the button toggles a popup panel open/closed
- [ ] The popup shows three contact channels: Zalo, Facebook Messenger, Phone
- [ ] Each channel is a clearly labelled button/link that opens the correct app/URL
- [ ] Popup can be dismissed by clicking the toggle button or clicking outside
- [ ] Popup is fully accessible (keyboard navigable, correct ARIA roles)
- [ ] Existing scroll-based visibility behaviour is preserved (appears after 200px scroll)
- [ ] Works correctly on mobile and desktop

---

## Files to Create/Touch

- `src/components/layout/FloatingCTA.tsx` — replace with popup implementation
- `src/lib/data.ts` — add `facebookPageUrl` or `messengerUrl` to `SITE_SETTINGS`
- `src/__tests__/components/layout/FloatingCTA.test.tsx` — unit tests

---

## Dependencies

- None (standalone UI component)
