# US-22 — Auto-prompt bubble for first-time visitors

**Status:** pending
**Category:** UX
**Priority:** Low
**Risk:** Low

---

## User Story

As a **first-time visitor who has been browsing for 10+ seconds**, I want the chat button to show a small animated prompt bubble ("Cần tư vấn? Nhắn tin ngay!") so I'm reminded that quick help is available without having to search for a contact option.

---

## Background

A subtle prompt on the chat bubble — shown once per session after a short delay — nudges visitors who may not notice the floating button. It should auto-dismiss and never show again in the same session to avoid being intrusive.

---

## Acceptance Criteria

- [ ] After 10 seconds on any page, a small tooltip/bubble appears above the chat button with the text "Cần tư vấn? Nhắn tin ngay!"
- [ ] The prompt appears only once per browser session (tracked via `sessionStorage`)
- [ ] The prompt auto-dismisses after 5 seconds if not interacted with
- [ ] Clicking the prompt opens the chat popup (same as clicking the button)
- [ ] The prompt has a manual close (×) button
- [ ] Prompt text is configurable in `SITE_SETTINGS`
- [ ] No prompt is shown if the user has already opened the popup during the session

---

## Files to Create/Touch

- `src/components/layout/FloatingCTA.tsx` — add auto-prompt logic
- `src/lib/data.ts` — add `chatPromptText` to `SITE_SETTINGS`
- `src/__tests__/components/layout/FloatingCTA.test.tsx` — update tests

---

## Dependencies

- US-20 must be completed first (popup must exist)
- US-21 recommended first (greeting enhances the popup the prompt leads to)
