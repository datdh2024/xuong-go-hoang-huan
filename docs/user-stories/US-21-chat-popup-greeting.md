# US-21 — Greeting message and staff avatar in chat popup

**Status:** pending
**Category:** Feature
**Priority:** Medium
**Risk:** Low

---

## User Story

As a **visitor who opens the chat popup**, I want to see a friendly greeting from the team (name, avatar, short intro text) so I feel welcomed and confident that a real person will respond.

---

## Background

A bare list of contact icons feels transactional. A human face and greeting ("Xin chào! Chúng tôi luôn sẵn sàng tư vấn…") increases trust and click-through rate. This is a polish layer on top of US-20.

---

## Acceptance Criteria

- [ ] The top section of the chat popup shows a staff avatar image, name, and role (e.g. "Tư vấn viên")
- [ ] A short greeting message is displayed below the avatar (configurable in `SITE_SETTINGS` or Sanity)
- [ ] Response time hint is shown (e.g. "Thường trả lời trong vài phút")
- [ ] Avatar image falls back to a default placeholder if not configured
- [ ] Content renders correctly on all screen sizes

---

## Files to Create/Touch

- `src/components/layout/FloatingCTA.tsx` — add greeting section to popup
- `src/lib/data.ts` — add `chatGreeting`, `chatStaffName`, `chatStaffRole`, `chatStaffAvatar` to `SITE_SETTINGS`
- `src/__tests__/components/layout/FloatingCTA.test.tsx` — update tests

---

## Dependencies

- US-20 must be completed first (popup panel must exist)
