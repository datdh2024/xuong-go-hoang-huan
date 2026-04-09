# US-11 — Add Google Analytics 4 (GA4) Integration

| Field       | Value                                  |
| ----------- | -------------------------------------- |
| **ID**      | US-11                                  |
| **Group**   | Analytics                              |
| **Jira**    | SR-883                                 |
| **Status**  | To Do                                  |

## User Story

**As a** business owner,
**I want to** track visitor behavior in Google Analytics 4
**so that** I can understand what content resonates with customers and measure website ROI.

## Goal

Integrate GA4 tracking into the website to capture page views, form submissions, phone calls, Zalo interactions, and project views — enabling data-driven decisions about content and marketing.

## Acceptance Criteria

1. GA4 measurement ID is stored in the environment variable `NEXT_PUBLIC_GA_MEASUREMENT_ID`
2. GA4 script (`gtag.js`) is loaded via Next.js `<Script>` component with `strategy="afterInteractive"`
3. Page view events fire automatically on every route change (including client-side navigation)
4. Custom events are tracked for key user interactions:
   - `form_submit` — when the contact/quote form is submitted
   - `phone_click` — when the user taps/clicks the phone number link (`tel:0985241204`)
   - `zalo_click` — when the user clicks the Zalo floating CTA or Zalo link
   - `project_view` — when the user visits a project detail page (`/cong-trinh/[slug]`)
5. Analytics tracking is completely skipped in development environment (`NODE_ENV !== 'production'`)

## Steps (User Perspective)

1. A visitor opens the website — GA4 silently loads and records a page view
2. The visitor navigates between pages (Home, About, Projects, Contact) — each navigation fires a page view event
3. The visitor clicks the phone number in the header or floating CTA — a `phone_click` event is sent to GA4
4. The visitor clicks "Chat Zalo" floating button — a `zalo_click` event is sent to GA4
5. The visitor opens a project detail page (e.g., "Nhà gỗ Quốc Oai") — a `project_view` event is sent with the project name/slug
6. The visitor fills out and submits the contact form — a `form_submit` event is sent to GA4
7. The business owner views GA4 dashboard to see all tracked events and page views

## Notes

- Currently **no GA4 scripts are present** on the site — this is a new integration
- The site has a floating CTA bar with Zalo (`https://zalo.me/0985241204`) and phone (`tel:0985241204`) links
- The contact form exists both on the homepage (quote section) and at `/lien-he`
- Phone number link exists in the header and footer
- Project detail pages use the route pattern `/cong-trinh/[slug]`
