# US-13 — Add Zalo OA notifications and contact API hardening

**Status:** pending
**Category:** Infrastructure
**Task ID:** #13

---

## User Story

As a **workshop owner**, I want to receive instant Zalo notifications on my phone when a customer submits the quote request form so that I can respond within minutes and not lose potential leads.

---

## Background

`src/app/api/contact/route.ts` already has Zalo OA notification logic, but it silently fails (`.catch(() => {})`) when `ZALO_OA_ACCESS_TOKEN` is not configured. Additionally, there is no fallback notification log — if both Resend and Zalo fail, the lead is lost with no record.

---

## Acceptance Criteria

- [ ] Contact API route logs failed notification attempts to console with structured data (name, phone, houseType) so leads are never silently lost
- [ ] Environment variables are validated on startup with helpful error messages: `RESEND_API_KEY`, `CONTACT_EMAIL`, `ZALO_OA_ACCESS_TOKEN`, `ZALO_ADMIN_USER_ID`
- [ ] A `.env.local.example` file is created documenting all required and optional environment variables
- [ ] If submission succeeds but notifications fail, still return `{ ok: true }` but log errors server-side
- [ ] Rate limiting is added to `/api/contact` to prevent spam (max 5 requests per IP per hour)
- [ ] Form data is sanitized/validated server-side (not just client-side with zod) before sending notifications
- [ ] Optional: store each submission in a Sanity `lead` document as a backup record

---

## Files to Touch

- `src/app/api/contact/route.ts`
- Create `.env.local.example`
- Optionally create `src/sanity/schemas/lead.ts`
