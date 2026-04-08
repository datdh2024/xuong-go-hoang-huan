# Claude Code Workflow — Skills

> Workflow: Idea → Release | Task management tool: Jira

---

## Planning Group

### mm:task-explorer

```yaml
name: mm:task-explorer
description: >
  Use when receiving a new Epic/Story and needing to assess feasibility and update the user-flow.
  Trigger: "new task received", "check feasibility", "explore epic", "view user flow".
```

- **Input:** Large Epic/Story
- **Output:** New or updated user-flow (non-code)
- **Output schema:** `name` · `short description` · `status` (BACKLOG/TODO/RELEASED) · `user-flow` · `related-flow`
- **Trigger when:** "new task received", "check feasibility", "explore epic", "view user flow"

**Steps:**

1. Read Epic/Story information from Jira
2. Check `docs/user-flows/` to see if a related flow already exists
3. If not → use playwright-cli to explore the app at localhost to understand the current UI
4. Assess feasibility and impact on other features
5. Create or update the user-flow artifact following the output schema

---

### mm:task-break

```yaml
name: mm:task-break
description: >
  Use when needing to break down an Epic/Story into tasks, estimate points,
  and review edge cases. Trigger: "break task", "estimate", "break down story".
```

- **Input:** Epic/Story + related user-flow
- **Output:** List of tasks with details, story point estimates, and edge cases
- **Output schema:** `name` · `type (FE/BE/other)` · `estimate` · `edge cases` · `dependencies`
- **Trigger when:** "break task", "estimate", "break down story", "review edge cases"

**Steps:**

1. Read Epic/Story and the corresponding user-flow
2. Analyze and break down into tasks by layer: DB → BE → FE → other (in dependency order)
3. For each task: name it, define type, write details, estimate points
4. Review edge cases for each task
5. Identify dependencies between tasks
6. Output the task list following the schema — **mandatory stop, wait for user review and edits**
7. After user confirms → push tasks to Jira

---

### mm:task-testcase

```yaml
name: mm:task-testcase
description: >
  Use before implementing any task — write test cases and an implementation plan,
  wait for user review before proceeding. Trigger: "write test cases", "implementation plan".
```

- **Input:** Specific task + user-flow + codebase context
- **Output:** Test cases + acceptance criteria (user must review before proceeding)
- **Output schema:** `test cases` · `acceptance criteria`
- **Trigger when:** "write test cases", "acceptance criteria for task X"

**Steps:**

1. Read task details and the related user-flow
2. Survey the codebase: review current patterns, related files, conventions in use
3. Write test cases covering the happy path, edge cases, and error cases
4. Define clear acceptance criteria
5. Mandatory stop — wait for user review and approval before moving to implementation
6. Update test cases and implementation plan in Jira

---

## Implementation Group

### mm:db-design

```yaml
name: mm:db-design
description: >
  Use when a task requires database changes — creating tables, adding columns, writing migrations.
  Trigger: "design DB", "write migration", "add table/column", "schema change".
```

- **Input:** Task + user-flow + current schema
- **Output:** Schema changes
- **Checklist:** backward compatibility · index strategy
- **Trigger when:** "design DB", "write migration", "add table/column", "schema change"

**Steps:**

1. Read the current schema and understand the existing data model
2. Design the changes: new table / new column / index / relation
3. Check backward compatibility with existing data and code
4. Propose an index strategy suited to the expected query patterns
5. Stop — wait for user review

---

### mm:task-apply-be

```yaml
name: mm:task-apply-be
description: >
  Use to implement Backend tasks (NestJS) using TDD — write tests first, then implement.
  Trigger: "work on BE task", "implement API", "write service/controller", "self test BE".
```

- **Input:** BE task + test cases + implementation plan
- **Output:** Implemented BE code + passing unit tests
- **Method:** TDD — write tests first, implement after. Reference the TDD superpower skill.
- **Trigger when:** "work on BE task", "implement API", "write service/controller", "self test BE"

**Steps:**

1. Read task details, test cases, and the approved implementation plan
2. Use the /test-driven-development skill to implement the task
3. Create `api-contract.md` in `docs/api-contracts/` for reference
4. Reminder: run `mm:document` after the PR is merged to sync artifacts

---

### mm:task-apply-fe

```yaml
name: mm:task-apply-fe
description: >
  Use to implement Frontend tasks (React/Next.js) using TDD, with playwright-cli
  to explore the UI first. Trigger: "work on FE task", "implement component", "write UI".
```

- **Input:** FE task + test cases + implementation plan + API contract from BE
- **Output:** Implemented FE code + passing component tests
- **Method:** TDD + playwright-cli to explore the current UI at localhost before writing code
- **Trigger when:** "work on FE task", "implement component/page", "write UI", "self test FE"

**Steps:**

1. Read task details, test cases, implementation plan, and the API contract from BE
2. Use playwright-cli to explore the current UI at localhost to understand context before writing code
3. Use the /test-driven-development skill to implement the task
4. Reminder: run `mm:self-test` to verify the flow on the UI before creating a PR
5. Reminder: run `mm:document` after the PR is merged to sync artifacts

---

### mm:self-test

```yaml
name: mm:self-test
description: >
  Use after completing implementation or a fix, to verify the feature as an end user.
  Trigger: "self-test", "re-test feature".
```

- **Input:** Implemented feature + approved test cases
- **Output:** Test results per case + list of failures if any + regression check
- **Output schema:** `status (PASS/FAIL)` · `cases passed` · `cases failed` · `regression risk` · `notes`
- **Trigger when:** "self-test", "re-test feature", "verify before creating PR"

**Steps:**

1. Read the approved test cases from `mm:task-testcase`
2. Use playwright-cli to test on the local frontend, following each test case
3. Run tests: happy path first, then edge cases, then error cases
4. Record result for each case: PASS / FAIL + short description if FAIL
5. Regression check: try related flows that were working previously
6. If any case FAILS → analyze root cause, fix, then re-run that test case
7. Output a consolidated results summary following the output schema before finishing

---

## Bug & Release Group

### mm:fix-bug

```yaml
name: mm:fix-bug
description: >
  Use when a bug report needs investigation and a fix. Process: reproduce → root cause →
  plan → user review → code. Trigger: "fix bug", "bug report", "error at X".
```

- **Input:** Brief description of the current bug
- **Output:** Fix plan (user review) → updated code
- **Method:** Investigate code → reproduce bug → root cause → plan → user review → update code. Can use `mm:task-explorer` or playwright-cli as needed.
- **Trigger when:** "fix bug", "bug report", "error at X", "fix issue at Y"

**Steps:**

1. Read the bug report, understand expected vs actual behavior
2. Reproduce the bug — confirm it exists before investigating
3. Investigate code: trace from symptom to root cause (use playwright-cli or mm:task-explorer if needed)
4. Identify root cause — do not just fix the symptom
5. Create a fix plan: files to change, approach, risks if any
6. Stop — wait for user review of the fix plan
7. Implement the fix following the approved plan
8. Write or update a test case to cover this bug
9. Self-test: confirm the bug is fixed and there is no regression
10. Reminder: run `mm:document` after the PR is merged to sync artifacts

---

## Documentation Group

### mm:document

```yaml
name: mm:document
description: >
  Use after completing implementation or a fix, to sync artifacts with the changed code.
  Input is git diff. Trigger: "update documentation", "sync artifacts".
```

- **Input:** Git diff + commit messages + list of changed files
- **Output:** All affected artifacts updated: user-flow, test cases, unit tests, E2E tests
- **Checklist:** Verify user-flow index file after updating
- **Trigger when:** "update documentation", "update docs", "sync artifacts after PR", "rewrite user-flow"

**Steps:**

1. Read git diff and commit messages to determine the scope of changes
2. Identify which artifacts are affected: user-flow, test cases, unit tests, E2E tests
3. Update user-flow if there are changes to flow or UI behavior
4. Update test cases if there are changes to logic or acceptance criteria
5. Update unit test docs if new tests were added or existing ones changed
6. Update E2E tests if there are changes to user journeys
7. Check the `docs/user-flows/` index file — ensure the table of contents is not outdated
8. Check the `docs/api-contracts/` index file — ensure the table of contents is not outdated

---

## Artifacts

- **user-flows:** `docs/user-flows/[group]/UF-[name].md` — with an index file as table of contents
- **api-contracts:** `docs/api-contracts/[group]/contract-[name].md` — with an index file as table of contents
- **tests/e2e:** in the root folder
- **unit-test:** structured following NestJS folder structure
