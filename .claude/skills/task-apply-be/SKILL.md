---
name: mm:task-apply-be
description: >
  Use to implement Backend tasks (NestJS) using TDD — write tests first, then implement.
  Trigger: "work on BE task", "implement API", "write service/controller", "self test BE".
---

# Apply Backend Task (TDD)

Implement a Backend task using strict Test-Driven Development. Write tests first, then implement.

## Input

- BE task + test cases + implementation plan (from `mm:task-testcase`)

## Output

- Implemented BE code + passing unit tests + API contract

---

## Steps

### 1. Read task details

Read:
- Task details and requirements
- Test cases and acceptance criteria (from `mm:task-testcase`)
- The approved implementation plan
- Related user-flow from `docs/user-flows/`

### 2. Implement using TDD

Use the `/test-driven-development` skill to implement the task. Follow the strict RED → GREEN → REFACTOR cycle:

1. **RED** — Write a failing test first
2. **GREEN** — Write minimal code to make it pass
3. **REFACTOR** — Clean up while keeping tests green

Repeat for each unit of behavior defined in the test cases.

#### Backend-specific patterns

- **API routes:** `src/app/api/[endpoint]/route.ts`
- **Services/utilities:** `src/lib/`
- **Sanity queries:** `src/sanity/lib/queries.ts`
- **Unit tests:** `src/__tests__/` (mirror source structure)

### 3. Create API contract

After implementation, create an API contract document in `docs/api-contracts/`:

```markdown
# contract-[name].md

## Endpoint

- **Method:** GET | POST | PUT | DELETE
- **Path:** /api/[endpoint]
- **Auth:** Required | Public

## Request

### Headers
| Header | Required | Description |
|--------|----------|-------------|

### Body (if POST/PUT)
```json
{
  "field": "type — description"
}
```

## Response

### Success (200)
```json
{
  "field": "type — description"
}
```

### Error responses
| Status | Body | When |
|--------|------|------|
| 400 | `{ "error": "..." }` | Invalid input |
| 404 | `{ "error": "..." }` | Not found |
```

### 4. Verify all tests pass

```bash
npm run test:run
```

Ensure:
- [ ] All new tests pass
- [ ] All existing tests still pass (no regressions)
- [ ] No warnings or errors in output

### 5. Reminder

After the PR is merged, run `mm:document` to sync artifacts (user-flows, test cases, API contracts).

---

## Guardrails

- **Never write implementation code before a failing test** — follow the Iron Law
- Always use the `/test-driven-development` skill — don't skip TDD steps
- API contracts must be created for any new or modified endpoint
- Follow existing patterns in the codebase (check similar files first)
- If the task requires Sanity schema changes, run `mm:db-design` first
