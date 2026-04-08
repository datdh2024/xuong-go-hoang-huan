---
name: sync-docs
description: >
  Synchronize all project documentation artifacts with code changes — user stories, test cases, index files, and test results. Use this skill after completing implementation, merging PRs, fixing bugs, or any time code has changed and docs may be out of sync. Trigger when the user says "sync docs", "update docs", "sync artifacts", or after any implementation/fix session ends. Also use when git diff shows changes that could affect documented behaviors, acceptance criteria, or test cases.
---

# sync-docs

Analyze code changes and synchronize all documentation artifacts — user stories, test cases, index files, and self-test results.

---

## Input

- Git diff (auto-detected from current branch vs base branch)
- Optionally: specific story/feature scope provided by user

---

## Output

| Artifact           | Path                                          | Action          |
| ------------------ | --------------------------------------------- | --------------- |
| User Stories       | `docs/user-stories/[group]/US-[id]-[name].md` | Create / Update |
| Test Cases         | `docs/test-cases/[group]/TC-[id]-[name].md`   | Create / Update |
| User Stories Index | `docs/user-stories/index.md`                  | Update          |
| Test Cases Index   | `docs/test-cases/index.md`                    | Update          |

---

## Steps

### Step 1 — Analyze changes

Determine what changed by reading git state:

```bash
# Changes on current branch vs base (master)
git diff master...HEAD --stat
git diff master...HEAD
git log master..HEAD --oneline
```

If the branch has no divergence from master (e.g., changes are local/uncommitted):

```bash
git diff --stat
git diff
```

From the diff, identify:

1. **Which features/stories are affected** — map changed files to stories using the route layout in CLAUDE.md and existing docs in `docs/user-stories/`
2. **What kind of changes**: new feature, behavior change, bug fix, refactor, UI change
3. **Scope of impact**: does this affect acceptance criteria? user flow? test expectations?

### Step 2 — Audit existing documentation

Read the current state of all potentially affected docs:

1. Read `docs/user-stories/index.md` — get the full list of documented stories
2. Read `docs/test-cases/index.md` — get the full list of documented test cases
3. For each affected feature, read:
   - `docs/user-stories/[group]/US-[id]-[name].md`
   - `docs/test-cases/[group]/TC-[id]-[name].md`

Build a change map:

| Document | Status   | What needs updating              |
| -------- | -------- | -------------------------------- |
| US-17    | outdated | acceptance criteria #3 changed   |
| TC-17    | outdated | TC-17-05 expected result changed |
| ...      | ...      | ...                              |

### Step 3 — Update User Stories

For each affected user story:

- **If story exists and behavior changed**: update the relevant sections (acceptance criteria, steps, notes). Add a `Last synced` date at the bottom.
- **If story exists but only internal refactor**: no update needed — note "no doc changes" in the change map.
- **If a new feature was added without a story**: create a new `US-[id]-[name].md` following the schema from `task-explore` skill.

**User Story schema reminder:**

```
- id, group, title, goal
- acceptance_criteria: list[string]
- steps: list[string]
- notes: string (optional)
```

### Step 4 — Update Test Cases

For each affected test case file:

- **If test expectations changed** (different behavior, new edge case discovered): update the affected test cases — modify `expected_result`, `steps`, or `precondition` as needed.
- **If new test cases are needed** (new feature paths, new edge cases from bug fixes): add them following the existing numbering pattern (TC-[id]-[NN]).
- **If code changed in a way that could affect test results**: reset `test-result` to `PENDING` for affected cases so they get re-verified.
- **If a bug fix added a regression test**: add it as an `error_case` type test case.

**Test Case schema reminder:**

```
cases:
  - id: TC-[id]-[name]-[N]
    test-result: PENDING | PASS | FAIL
    test-result-note: string
    type: happy_path | edge_case | error_case
    description: string
    precondition: string
    steps: list[string]
    expected_result: string
```

### Step 5 — Update Index Files

After all doc updates:

1. **`docs/user-stories/index.md`**: ensure every story file has an entry. Add new entries for newly created stories. Update descriptions if they no longer match.
2. **`docs/test-cases/index.md`**: ensure every test case file has an entry. Update the count summary (e.g., "14 test cases (7 happy path, 5 edge case, 2 error case)") to reflect actual counts.

### Step 6 — Cross-reference Check

Verify bidirectional links are intact:

- Each test case file links back to its user story
- Each user story references its test case file (if applicable)
- Index files have correct relative paths
- No broken links to deleted or renamed files

### Step 7 — Summary Report

Present a summary to the user:

```
Sync-docs complete
─────────────────────────────────
Changes analyzed:  [N] files changed, [N] commits
Stories updated:   [list or "none"]
Stories created:   [list or "none"]
Test cases updated: [list or "none"]
Test cases added:  [N] new cases
Test results reset: [list of TC IDs reset to PENDING]
Index files:       [updated / no changes]
Cross-references:  [OK / issues found]
─────────────────────────────────
```

If any test results were reset to PENDING, remind the user:

> Run `/self-test` to re-verify the affected test cases.

---

## Rules

- **Do not invent behavior.** Only document what the code actually does — read the implementation if unsure.
- **Preserve existing structure.** Match the formatting, heading style, and numbering of existing doc files.
- **Minimal changes.** Only update sections that are actually affected by the code changes. Do not rewrite entire documents for minor updates.
- **Reset, don't guess.** When code changes could affect a test result, reset it to `PENDING` rather than guessing PASS/FAIL.
