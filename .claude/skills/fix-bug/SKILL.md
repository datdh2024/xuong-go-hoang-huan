---
name: mm:fix-bug
description: >
  Use when a bug report needs investigation and a fix. Process: reproduce → root cause →
  plan → user review → code. Trigger: "fix bug", "bug report", "error at X".
---

# Fix Bug

Investigate and fix a bug following a systematic process: reproduce → root cause → plan → review → fix.

## Input

- Brief description of the current bug

## Output

- Fix plan (user review) → updated code + test covering the bug

---

## Steps

### 1. Read the bug report

Understand:
- **Expected behavior:** What should happen?
- **Actual behavior:** What happens instead?
- **Steps to reproduce:** How to trigger the bug?
- **Environment:** Where does it occur? (browser, device, specific data)

### 2. Reproduce the bug

Confirm the bug exists before investigating. Use one or both:

- **Automated:** Write a failing test that demonstrates the bug
- **Manual:** Use `/playwright-cli` to reproduce on localhost:3000

If the bug **cannot be reproduced**, ask the user for more details before proceeding.

### 3. Investigate root cause

Trace from symptom to root cause:

1. Start at the symptom (error message, wrong UI, incorrect data)
2. Trace through the code path (use Grep/Read to find relevant files)
3. Identify the exact line(s) causing the issue
4. Understand **why** it happens — don't just find **where**

Use `/playwright-cli` or `mm:task-explorer` if needed to understand the broader context.

**Do not just fix the symptom — find the root cause.**

### 4. Create fix plan

Document:

```markdown
## Fix Plan

### Root Cause
[What's causing the bug and why]

### Files to Change
- `path/to/file.ts` — [what changes and why]
- `path/to/file.ts` — [what changes and why]

### Approach
[How the fix works — brief technical description]

### Risks
[Any potential side effects or regressions]
```

### 5. **MANDATORY STOP** — Wait for user review

Present the fix plan to the user. **Do not implement until approved.**

Ask:
> "Here's the fix plan — does this approach make sense? Any concerns about the risks?"

### 6. Implement the fix

Follow the approved plan. Use TDD:

1. **RED** — Write/confirm a failing test that reproduces the bug
2. **GREEN** — Implement the fix to make the test pass
3. **REFACTOR** — Clean up if needed

### 7. Write or update test cases

Ensure a test exists that:
- Reproduces the exact bug scenario
- Passes with the fix applied
- Will catch regressions if the bug returns

### 8. Self-test

Confirm:
- [ ] The bug is fixed (verify manually with playwright-cli)
- [ ] No regressions (run full test suite)
- [ ] Related flows still work

```bash
npm run test:run
npm run test:e2e
```

### 9. Documentation reminder

After the PR is merged, run `mm:document` to sync affected artifacts.

---

## Guardrails

- **Always reproduce before investigating** — don't guess at root causes
- **Always get user approval on the fix plan** before writing code (Step 5 is mandatory)
- **Never fix symptoms only** — find and fix the root cause
- **Always add a regression test** — every bug fix must include a test
- If the fix touches multiple areas, consider whether it should be split into smaller fixes
