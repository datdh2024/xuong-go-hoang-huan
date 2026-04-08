---
name: mm:task-explorer
description: >
  Use when receiving a new Epic/Story and needing to assess feasibility and update the user-flow.
  Trigger: "new task received", "check feasibility", "explore epic", "view user flow".
---

# Task Explorer

Assess feasibility of a new Epic/Story and create or update user-flow artifacts.

## Input

- Large Epic/Story (from Jira or user description)

## Output

- New or updated user-flow document
- **Schema:** `name` · `short description` · `status` (BACKLOG/TODO/RELEASED) · `user-flow` · `related-flow`

---

## Steps

### 1. Read Epic/Story information

Read the Epic/Story details from Jira using the Atlassian MCP tools. Understand the scope, requirements, and business context.

### 2. Check existing user-flows

Search `docs/user-flows/` to see if a related flow already exists.

```bash
ls docs/user-flows/
```

If a related flow exists, read it to understand the current state.

### 3. Explore the current UI (if no existing flow)

If no related flow exists, use the `/playwright-cli` skill to explore the app at localhost:3000 to understand the current UI and behavior.

- Navigate to relevant pages
- Take screenshots for reference
- Note current UI patterns and components

### 4. Assess feasibility and impact

Analyze:
- **Feasibility:** Can this be implemented with the current stack and architecture?
- **Impact on other features:** Which existing flows or components will be affected?
- **Dependencies:** What needs to exist before this can be built?
- **Risks:** Any technical or UX risks?

### 5. Create or update user-flow artifact

Write the user-flow document to `docs/user-flows/[group]/UF-[name].md` following this schema:

```markdown
# UF-[name]: [Short Description]

- **Status:** BACKLOG | TODO | RELEASED
- **Related flows:** [list of related UF-XX references]

## User Flow

[Step-by-step description of the user journey]

## Feasibility Assessment

[Summary of findings from Step 4]

## Impact Analysis

[Which existing features/flows are affected]
```

After creating/updating the flow, check that the `docs/user-flows/` index file is up to date.

---

## Guardrails

- This is a **non-code** skill — output is documentation only
- Always check for existing flows before creating new ones
- If the Epic/Story is unclear, ask the user for clarification before proceeding
- Status should default to BACKLOG for new flows
