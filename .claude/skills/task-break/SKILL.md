---
name: mm:task-break
description: >
  Use when needing to break down an Epic/Story into tasks, estimate points,
  and review edge cases. Trigger: "break task", "estimate", "break down story".
---

# Task Breakdown

Break down an Epic/Story into implementation tasks with estimates, edge cases, and dependencies.

## Input

- Epic/Story + related user-flow

## Output

- List of tasks with details, story point estimates, and edge cases
- **Schema:** `name` · `type (FE/BE/other)` · `estimate` · `edge cases` · `dependencies`

---

## Steps

### 1. Read Epic/Story and user-flow

Read the Epic/Story details and the corresponding user-flow from `docs/user-flows/`. Understand the full scope before breaking down.

### 2. Break down by layer (dependency order)

Analyze and decompose the work into tasks following this order:

1. **DB** — schema changes, migrations, indexes
2. **BE** — API endpoints, services, controllers (NestJS)
3. **FE** — components, pages, hooks (React/Next.js)
4. **Other** — infrastructure, configuration, documentation

Each layer depends on the one above — this ensures tasks can be worked on in sequence.

### 3. Define each task

For each task, provide:

| Field | Description |
|-------|-------------|
| **Name** | Clear, action-oriented title (≤ 60 chars) |
| **Type** | FE / BE / DB / Other |
| **Details** | What needs to be done — acceptance criteria |
| **Estimate** | Story points: 1 / 2 / 3 / 5 / 8 |
| **Edge cases** | What could go wrong, boundary conditions |
| **Dependencies** | Which other tasks must be done first |

**Story points guide:**
- 1 — trivial, no unknowns, < 2 hours
- 2 — small and well-understood, < half a day
- 3 — moderate, a day or less
- 5 — larger, some unknowns, 2–3 days
- 8 — complex, significant unknowns, ~a week; consider splitting

### 4. Review edge cases

For each task, identify:
- Input validation edge cases
- Error handling scenarios
- Concurrency / race conditions
- Backward compatibility concerns
- Security implications

### 5. Identify dependencies

Create a dependency graph showing the order tasks must be completed. Flag any circular dependencies or bottlenecks.

### 6. **MANDATORY STOP** — Wait for user review

Present the full task list to the user in a clear table format. **Do not proceed until the user reviews and confirms.**

Ask:
> "Here's the task breakdown — does this capture everything? Would you like to adjust any estimates, add edge cases, or reorder dependencies?"

### 7. Push to Jira (after confirmation)

After the user confirms, create each task in Jira using the `create-task` skill or Atlassian MCP tools. Maintain the dependency order and link related tasks.

---

## Output Format

Present tasks as a table:

| # | Name | Type | Estimate | Edge Cases | Dependencies |
|---|------|------|----------|------------|--------------|
| 1 | ... | DB | 2 | ... | None |
| 2 | ... | BE | 3 | ... | #1 |
| 3 | ... | FE | 5 | ... | #2 |

---

## Guardrails

- Never push tasks to Jira without user confirmation (Step 6 is mandatory)
- Always decompose in dependency order: DB → BE → FE → Other
- If a task estimates > 8 points, split it further
- Edge cases are not optional — every task must have at least one
