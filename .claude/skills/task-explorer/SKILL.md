---
name: task-explorer
description: Use this skill to explore and document how a feature or task actually behaves in the running application. Trigger when the user says "explore this task", "discover the user flow", "how does X work in the app", "document this feature", or when implementing a task and no user flow exists yet. Always use this skill before implementing a new feature if docs/user-flows/ doesn't cover it.
allowed-tools: Bash(playwright-cli:*)
---

## Goal

Discover and document the real user flow for a task by inspecting the live app or existing flow docs.

## Steps

1. **Check existing flows first**
   - Search `docs/user-flows/` for files related to the current task/feature
   - If a matching flow exists → use it and skip browser exploration
   - If outdated or incomplete → proceed to explore

2. **Explore the live app** (only if flow not found or outdated)

```bash
   playwright-cli --headed --persistent --profile=chrome-profile http://localhost:3000
```

- Navigate to the relevant screen/feature
- Observe: entry points, user actions, state changes, success/error states
- Do NOT record implementation details — only what the user sees and does

3. **Document the user flow**
   - Format: step-by-step narrative from user perspective
   - Include: preconditions, main flow, alternative flows, edge cases
   - No technical details (no API calls, DB queries, component names)

4. **Save to docs/user-flows/**
   - Path: `docs/user-flows/[category]/[screen-or-feature]/UF-[name].md`
   - Example: `docs/user-flows/checkout/payment/UF-apply-coupon.md`
   - Reuse this file in future explorations for the same area

## Output format (UF-\*.md)

```markdown
# UF-[feature-name]

**Category**: [area of app]
**Last updated**: [date]

## Preconditions

- ...

## Main Flow

1. User does X
2. System shows Y
3. ...

## Alternative Flows

- If user does Z → ...

## Edge Cases

- ...
```
