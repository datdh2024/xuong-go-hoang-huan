---
name: mm:document
description: >
  Use after completing implementation or a fix, to sync artifacts with the changed code.
  Input is git diff. Trigger: "update documentation", "sync artifacts".
---

# Document — Sync Artifacts

Update all affected artifacts after implementation or a fix. Ensures documentation stays in sync with code.

## Input

- Git diff + commit messages + list of changed files

## Output

- All affected artifacts updated: user-flow, test cases, unit tests, E2E tests

---

## Steps

### 1. Read git diff and commit messages

Determine the scope of changes:

```bash
git diff HEAD~1 --stat
git log --oneline -5
git diff HEAD~1
```

Identify:
- Which files were changed
- What the changes do (new feature, bug fix, refactor)
- Which areas of the app are affected

### 2. Identify affected artifacts

Map changes to artifacts:

| Change Type | Affected Artifacts |
|-------------|-------------------|
| UI/flow change | User-flow docs |
| Logic/behavior change | Test cases |
| New/modified tests | Unit test docs |
| User journey change | E2E tests |
| API change | API contracts |

### 3. Update user-flows

If changes affect user flows or UI behavior:
- Read the relevant flow in `docs/user-flows/[group]/UF-[name].md`
- Update steps, expected behavior, or screenshots
- Update status if applicable (BACKLOG → TODO → RELEASED)

### 4. Update test cases

If changes affect logic or acceptance criteria:
- Review existing test cases for the affected feature
- Add new test cases for new behavior
- Update or remove test cases for changed/removed behavior

### 5. Update unit test documentation

If new tests were added or existing ones changed:
- Verify test file names and locations follow conventions (`src/__tests__/`)
- Ensure test descriptions match current behavior

### 6. Update E2E tests

If changes affect user journeys:
- Review E2E tests in `tests/e2e/`
- Update selectors, assertions, or flows as needed
- Add new E2E specs for new user journeys

### 7. Check user-flows index

Ensure the table of contents in `docs/user-flows/` is not outdated:
- All flow files are listed
- No dead links to removed flows
- Status values are current

### 8. Check api-contracts index

Ensure the table of contents in `docs/api-contracts/` is not outdated:
- All contract files are listed
- No dead links to removed contracts
- Endpoints and methods are current

---

## Checklist

Before marking documentation as complete:

- [ ] User-flows updated (if flows changed)
- [ ] Test cases updated (if logic changed)
- [ ] Unit test docs current (if tests changed)
- [ ] E2E tests updated (if journeys changed)
- [ ] API contracts updated (if endpoints changed)
- [ ] `docs/user-flows/` index verified
- [ ] `docs/api-contracts/` index verified

---

## Guardrails

- Only update artifacts affected by the changes — don't rewrite everything
- User-flow status must reflect reality: don't mark RELEASED if not deployed
- If a flow was removed, remove the file AND update the index
- API contracts must match the actual implementation — verify against code
