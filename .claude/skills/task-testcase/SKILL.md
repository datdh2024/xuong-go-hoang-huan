---
name: mm:task-testcase
description: >
  Use before implementing any task — write test cases and an implementation plan,
  wait for user review before proceeding. Trigger: "write test cases", "implementation plan".
---

# Task Test Cases & Implementation Plan

Write test cases and acceptance criteria before implementation begins. User must review and approve before any code is written.

## Input

- Specific task + user-flow + codebase context

## Output

- Test cases + acceptance criteria
- **Schema:** `test cases` · `acceptance criteria`

---

## Steps

### 1. Read task and user-flow

Read the task details and the related user-flow from `docs/user-flows/`. Understand what needs to be built and the expected user behavior.

### 2. Survey the codebase

Review the current codebase to understand:
- Existing patterns and conventions
- Related files that will be affected
- Testing patterns already in use (`src/__tests__/`)
- E2E test patterns (`tests/e2e/`)

```bash
# Check existing test patterns
ls src/__tests__/
ls tests/e2e/
```

### 3. Write test cases

Write test cases covering three categories:

#### Happy Path
The main success scenarios — what should happen when everything works correctly.

```markdown
### TC-01: [Happy path scenario]
- **Given:** [precondition]
- **When:** [user action]
- **Then:** [expected result]
```

#### Edge Cases
Boundary conditions, unusual inputs, limit values.

```markdown
### TC-02: [Edge case scenario]
- **Given:** [precondition]
- **When:** [boundary action]
- **Then:** [expected behavior at boundary]
```

#### Error Cases
What happens when things go wrong — invalid input, network errors, missing data.

```markdown
### TC-03: [Error scenario]
- **Given:** [precondition]
- **When:** [error trigger]
- **Then:** [graceful error handling]
```

### 4. Define acceptance criteria

Write clear, testable acceptance criteria using GIVEN/WHEN/THEN format:

```markdown
## Acceptance Criteria

- [ ] GIVEN [state], WHEN [action], THEN [outcome]
- [ ] GIVEN [state], WHEN [action], THEN [outcome]
- [ ] [Edge case criterion]
- [ ] [Error case criterion]
```

### 5. **MANDATORY STOP** — Wait for user review

Present the test cases and acceptance criteria to the user. **Do not proceed to implementation until the user approves.**

Ask:
> "Here are the test cases and acceptance criteria — do these cover all the scenarios you expect? Would you like to add, modify, or remove any cases?"

### 6. Update in Jira

After user approval, update the task in Jira with the finalized test cases and acceptance criteria.

---

## Guardrails

- **Never start implementation before user approves test cases** (Step 5 is mandatory)
- Test cases must be specific and testable — no vague criteria like "works correctly"
- Every acceptance criterion must use GIVEN/WHEN/THEN format
- Include at least one test case from each category (happy, edge, error)
- Test cases should be written from the user's perspective, not implementation perspective
