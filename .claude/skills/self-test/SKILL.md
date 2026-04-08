---
name: mm:self-test
description: >
  Use after completing implementation or a fix, to verify the feature as an end user.
  Trigger: "self-test", "re-test feature".
---

# Self-Test

Verify a feature as an end user using playwright-cli, running through all approved test cases.

## Input

- Implemented feature + approved test cases (from `mm:task-testcase`)

## Output

- Test results per case + list of failures + regression check
- **Schema:** `status (PASS/FAIL)` · `cases passed` · `cases failed` · `regression risk` · `notes`

---

## Steps

### 1. Read approved test cases

Read the test cases from the `mm:task-testcase` output. These are the cases to verify:
- Happy path cases
- Edge cases
- Error cases

### 2. Test on the local frontend

Use the `/playwright-cli` skill to test on localhost:3000, following each test case:

- Navigate to the relevant page
- Perform the actions described in each test case
- Verify the expected outcomes visually
- Take screenshots for evidence

### 3. Execute tests in order

Run tests in this priority:

1. **Happy path first** — verify the main success flows work
2. **Edge cases** — verify boundary conditions
3. **Error cases** — verify graceful error handling

### 4. Record results

For each test case, record:

| Case | Status | Notes |
|------|--------|-------|
| TC-01: [name] | PASS / FAIL | [description if FAIL] |
| TC-02: [name] | PASS / FAIL | [description if FAIL] |

### 5. Regression check

Test related flows that were previously working:
- Navigate to adjacent features
- Verify nothing is broken by the new changes
- Check mobile/responsive behavior if applicable

### 6. Fix failures

If any case **FAILS**:
1. Analyze root cause
2. Fix the issue
3. Re-run that specific test case
4. Verify the fix doesn't break other cases

Repeat until all cases pass.

### 7. Output consolidated results

Present the final summary:

```markdown
## Self-Test Results

- **Status:** PASS / FAIL
- **Cases passed:** X / Y
- **Cases failed:** [list with descriptions]
- **Regression risk:** LOW / MEDIUM / HIGH
- **Notes:** [any observations or concerns]
```

---

## Guardrails

- Always use playwright-cli for visual verification — don't just run automated tests
- Every test case from `mm:task-testcase` must be verified — no skipping
- If a failure is found, fix and re-test before marking as complete
- Regression checks are not optional — always verify adjacent features
- Take screenshots for evidence, especially for FAIL cases
