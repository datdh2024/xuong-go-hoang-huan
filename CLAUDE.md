# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

---

## Commands

```bash
npm run dev          # start dev server on :3000
npm run build        # production build
npm run lint         # ESLint

npm run test         # Vitest watch mode (unit tests)
npm run test:run     # Vitest single run (CI)
npm run test:e2e     # Playwright E2E tests (requires dev server or uses webServer config)
```

Run a single unit test file:

```bash
npx vitest run src/__tests__/hooks/useDarkMode.test.ts
```

Run a single E2E spec:

```bash
npx playwright test tests/e2e/dark-mode.spec.ts
```

Install test dependencies before first test run:

```bash
npm install
npx playwright install chromium
```

---

## Architecture

### Stack

- **Next.js 16.2** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS v4** — config in `tailwind.config.ts`; CSS variables defined in `src/app/globals.css` under `@theme inline`
- **Sanity CMS v5** — schemas in `src/sanity/schemas/`, GROQ queries in `src/sanity/lib/queries.ts`, studio at `/studio`
- **Vitest + React Testing Library** — unit tests in `src/__tests__/`
- **Playwright** — E2E tests in `tests/e2e/`

### Route layout

```
src/app/
  layout.tsx               ← root layout: fonts, metadata, <html>/<body>
  globals.css              ← Tailwind @theme tokens (wood-*, gold-*)
  (site)/                  ← route group for the public website
    layout.tsx             ← wraps all pages with Header + Footer + FloatingCTA
    page.tsx               ← homepage (HeroSlider → Highlights → ProjectsGrid → HouseTemplates → FaqSection → QuoteForm)
    gioi-thieu/page.tsx    ← About page
    cong-trinh/page.tsx    ← Projects listing
    cong-trinh/[slug]/     ← Project detail
    lien-he/page.tsx       ← Contact page
  api/contact/route.ts     ← POST handler: sends email via Resend + Zalo OA notification
  studio/[[...tool]]/      ← Sanity Studio (embedded)
```

### Data layer — two-tier pattern

All pages currently render **static placeholder data** from `src/lib/data.ts`. Sanity GROQ queries are written and ready in `src/sanity/lib/queries.ts` but are not yet wired into pages (US-01 is pending). When connecting Sanity, import the relevant query and call `client.fetch(query)` inside a Server Component — do not use client-side fetching for initial data.

The Sanity client (`src/sanity/lib/client.ts`) reads `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` from env.

### Color palette

Custom tokens — use these class names, never raw hex:

| Token                  | Use                        |
| ---------------------- | -------------------------- |
| `wood-50` … `wood-900` | backgrounds, text, borders |
| `gold-400/500/600`     | accents, CTAs, active nav  |

Both `tailwind.config.ts` and `globals.css @theme inline` define the same tokens; they must stay in sync.

### Environment variables

```
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET
SANITY_API_TOKEN
RESEND_API_KEY          # email from contact form
CONTACT_EMAIL           # recipient for contact form emails
ZALO_OA_ACCESS_TOKEN    # optional: Zalo OA notifications
ZALO_ADMIN_USER_ID      # optional: Zalo recipient
```

---

## Feature work

User flows are documented in `docs/user-flows/`. Each file (`UF-XX-*.md`) contains the full acceptance criteria and the exact files to touch. Read the relevant flow doc before starting any feature.

---

## Testing conventions

- Unit test files live in `src/__tests__/` mirroring `src/` structure (e.g. `hooks/`, `components/`, `sanity/`)
- The global setup at `src/__tests__/setup.ts` mocks `next/navigation` and `window.matchMedia`
- Client Components that use browser APIs (localStorage, matchMedia) must be tested with `jsdom` environment (already the Vitest default)
- Async Server Components cannot be unit-tested with Vitest — use Playwright E2E for those
- E2E tests use `page.addInitScript()` to pre-seed localStorage before navigation

## Development Workflow (MANDATORY)

When implementing any new feature, you **MUST** follow this process:

### 1. Test-Driven Development (TDD)

It is **MANDATORY** to strictly follow `test-driven-development` principles before writing any implementation code.

The TDD process:

1. **RED** — Write the test first, then run it → the test MUST fail (because the implementation does not exist yet).
2. **GREEN** — Write the minimal amount of code necessary to make the test pass.
3. **REFACTOR** — Clean up and optimize the code while ensuring the tests remain green.

Repeat the RED → GREEN → REFACTOR cycle for every small unit of logic.

### 2. End-to-End Testing (E2E)

After all unit tests pass, run E2E tests to verify the full page/component flow:

- E2E tests live in `tests/e2e/` and use Playwright with Chromium only
- Run `npm run test:e2e` — this starts the dev server automatically via `webServer` config
- If an E2E test fails → fix the code → re-run until everything passes

### 3. Definition of DONE Checklist

- [ ] All TDD cycles are completed (RED → GREEN → REFACTOR).
- [ ] Unit tests pass (`npm run test:run`).
- [ ] E2E tests pass (`npm run test:e2e`).
- [ ] No regressions (all previously written tests still pass).

# Notes:

- Don't add future feature descriptions or codes when update CLAUDE.md
