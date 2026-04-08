---
name: mm:task-apply-fe
description: >
  Use to implement Frontend tasks (React/Next.js) using TDD, with playwright-cli
  to explore the UI first. Trigger: "work on FE task", "implement component", "write UI".
---

# Apply Frontend Task (TDD)

Implement a Frontend task using TDD, exploring the current UI with playwright-cli before writing code.

## Input

- FE task + test cases + implementation plan + API contract from BE

## Output

- Implemented FE code + passing component tests

---

## Steps

### 1. Read task details

Read:
- Task details and requirements
- Test cases and acceptance criteria (from `mm:task-testcase`)
- The approved implementation plan
- API contract from BE (from `docs/api-contracts/`) if the task consumes an API
- Related user-flow from `docs/user-flows/`

### 2. Explore current UI

Use the `/playwright-cli` skill to explore the current UI at localhost:3000 before writing any code:

- Navigate to the relevant page(s)
- Take screenshots to understand the current state
- Note existing components, layout, and patterns
- Identify what needs to change vs what already exists

This step prevents building something that conflicts with the existing UI.

### 3. Implement using TDD

Use the `/test-driven-development` skill to implement the task. Follow the strict RED → GREEN → REFACTOR cycle:

1. **RED** — Write a failing test first
2. **GREEN** — Write minimal code to make it pass
3. **REFACTOR** — Clean up while keeping tests green

#### Frontend-specific patterns

- **Pages:** `src/app/(site)/[route]/page.tsx`
- **Components:** `src/components/`
- **Hooks:** `src/hooks/`
- **Unit tests:** `src/__tests__/` (mirror source structure)
- **E2E tests:** `tests/e2e/`

#### E2E decision gate

Evaluate whether E2E tests are required (see `/test-driven-development` skill for the decision gate). FE tasks frequently require E2E tests since they involve user-visible flows.

### 4. Verify all tests pass

```bash
# Unit tests
npm run test:run

# E2E tests (if applicable)
npm run test:e2e
```

Ensure:
- [ ] All new unit tests pass
- [ ] All new E2E tests pass (if applicable)
- [ ] All existing tests still pass (no regressions)

### 5. Self-test reminder

Before creating a PR, run `mm:self-test` to verify the flow on the UI as an end user.

### 6. Documentation reminder

After the PR is merged, run `mm:document` to sync artifacts.

---

## Guardrails

- **Always explore the UI first** with playwright-cli — don't assume the current state
- **Never write implementation code before a failing test** — follow the Iron Law
- Always use the `/test-driven-development` skill — don't skip TDD steps
- Use the project's color tokens (`wood-*`, `gold-*`) — never raw hex values
- Follow the existing component patterns in `src/components/`
- If the task requires API data, read the API contract first
- Async Server Components cannot be unit-tested with Vitest — use Playwright E2E for those
