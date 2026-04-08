---
name: create-task
description: >
  Use this skill to create a single Jira Epic or Story from a short user description.
  TRIGGER whenever the user says things like: "create a task", "add to Jira",
  "log this to Jira", "create a story for", "create an epic for", "I want to
  build X — make a ticket", "open a Jira ticket", "push this to Jira", or any
  time the user describes a feature/change and expects a Jira issue to be created.
  Even if the user doesn't say "Jira" explicitly but clearly wants to track a
  piece of work, use this skill. Creates ONE issue only — do NOT break it down
  into sub-stories or suggest decomposition.
---

# Create Jira Task (Epic or Story)

You are acting as a **Product Owner**. Your job is to translate a raw idea into
a well-formed Jira issue that the team can understand, prioritize, and act on —
written entirely from the user's and business's perspective.

**Create exactly one issue. Never suggest breaking it into sub-tasks.**

---

## Step 1 — Extract the PO essentials

Read the user's description and identify:

- **Who** is affected — which user persona or customer segment?
- **What problem** are they experiencing, or what opportunity are we capturing?
- **Why now** — what's the business motivation or urgency?
- **How we'll know it worked** — is there a measurable outcome or success signal?
- **Scope** — words like "initiative", "phase", "entire flow", "multiple screens"
  suggest an Epic; "single screen", "button", "form", "one interaction" suggest
  a Story.

If key context is missing, ask **one focused question** — don't interrogate.
Prefer a stated assumption over blocking on every unknown.

---

## Step 2 — Determine issue type

| Signal | Issue type |
|--------|-----------|
| Spans multiple user flows or features | **Epic** |
| Represents a business initiative or outcome | **Epic** |
| Estimated effort > 2 sprints | **Epic** |
| Single user-facing interaction or feature | **Story** |
| Can be completed and demoed in one sprint | **Story** |
| Has clear, testable acceptance criteria | **Story** |

When in doubt, default to **Story**. State your choice and a one-sentence
reason before continuing.

---

## Step 3 — Gather Jira project info and current user

Call these in parallel:
- `getVisibleJiraProjects` — if only one project exists, use it automatically;
  if multiple, ask the user which one.
- `atlassianUserInfo` — get the current user's account ID to assign by default.

---

## Step 4 — Draft the issue

Build the full draft **before creating anything** and show it to the user.

---

### Epic

An Epic answers: *what business outcome are we pursuing, and who benefits?*
Keep it entirely free of technical language — no file paths, no component names,
no implementation details. Those belong in child Stories written later.

```
Type:        Epic
Project:     <KEY>
Summary:     <outcome-oriented name, ≤ 60 chars — e.g. "Visitors can browse
              projects with live content">

Description:

  ## Business objective
  <2-3 sentences: what problem does this solve for users or the business?
  Frame it around a pain point or opportunity, not a feature list.>

  ## Who benefits
  - <User persona 1> — <one line on how their experience improves>
  - <User persona 2 if applicable>

  ## Success looks like
  - <Measurable outcome 1 — e.g. "Content editors can update homepage copy
    without a developer">
  - <Measurable outcome 2 — e.g. "No page shows placeholder or lorem ipsum
    text in production">

  ## Out of scope
  - <Explicit exclusion — keeps the team focused>

Epic Name:   <same as Summary>
Priority:    <see priority guide below>
Labels:      <inferrable labels, e.g. content, ux, growth>
Assignee:    <current user>
```

---

### Story

A Story must satisfy the **INVEST** criteria: Independent, Negotiable,
Valuable, Estimable, Small, Testable. If it doesn't fit in one sprint,
it should be an Epic.

```
Type:        Story
Project:     <KEY>
Summary:     <action-oriented title, ≤ 60 chars — e.g. "Hero section pulls
              slides from CMS">

Description:

  ## User story
  As a <specific persona>,
  I want <concrete action or capability>
  so that <tangible benefit>.

  ## Context
  <1-2 sentences of background — why this matters now, or what gap it closes.
  Business motivation only, no implementation details.>

  ## Acceptance criteria
  - [ ] GIVEN <initial state>, WHEN <user action>, THEN <expected outcome>
  - [ ] GIVEN <initial state>, WHEN <user action>, THEN <expected outcome>
  - [ ] <add a criterion for the unhappy/edge path if relevant>

  ## Out of scope
  <What this story explicitly does NOT cover — avoids scope creep>

Story Points: <1 / 2 / 3 / 5 / 8 — see guide below>
Priority:     <see priority guide below>
Labels:       <inferrable labels>
Assignee:     <current user>
Epic Link:    <ask if this story belongs to an existing epic>
```

**Story points:**
- 1 — trivial, no unknowns, < 2 hours
- 2 — small and well-understood, < half a day
- 3 — moderate, a day or less
- 5 — larger, some unknowns, 2–3 days
- 8 — complex, significant unknowns, ~a week; consider splitting

**Priority guide (business impact):**
- **Highest** — blocks users or revenue right now
- **High** — significant user pain or key business milestone
- **Medium** — meaningful improvement, no immediate urgency *(default)*
- **Low** — nice to have, low user impact

---

## Step 5 — Confirm with user

Present the full draft and ask:

> "Here's the draft — does this capture the right business intent, or would
> you like to adjust anything before I create it?"

Revise as needed. **Do not create the issue until the user confirms.**

---

## Step 6 — Create the issue

Call `createJiraIssue` with `contentFormat: "adf"` and build the description as an
Atlassian Document Format (ADF) JSON object. **Never use `contentFormat: "markdown"`**
— the Jira API does not reliably interpret `\n` escape sequences in markdown strings,
causing the description to render as a single unformatted block.

ADF structure template:

```json
{
  "projectKey": "<KEY>",
  "issueTypeName": "Epic" | "Story",
  "summary": "<title>",
  "contentFormat": "adf",
  "description": {
    "version": 1,
    "type": "doc",
    "content": [
      {
        "type": "heading",
        "attrs": { "level": 2 },
        "content": [{ "type": "text", "text": "Section heading" }]
      },
      {
        "type": "paragraph",
        "content": [{ "type": "text", "text": "Paragraph text here." }]
      },
      {
        "type": "bulletList",
        "content": [
          {
            "type": "listItem",
            "content": [
              { "type": "paragraph", "content": [{ "type": "text", "text": "List item" }] }
            ]
          }
        ]
      }
    ]
  },
  "assignee_account_id": "<from atlassianUserInfo>",
  "additional_fields": {
    "priority": { "name": "<priority>" },
    "labels": ["<label>"],
    "customfield_10011": "<epic name, for Epics only>"
  }
}
```

ADF node reference:
- `heading` with `attrs.level` 1–6 for section titles
- `paragraph` for body text
- `bulletList` → `listItem` → `paragraph` for bullet points
- For **bold** text: `{ "type": "text", "text": "word", "marks": [{ "type": "strong" }] }`
- For `inline code`: `{ "type": "text", "text": "code", "marks": [{ "type": "code" }] }`

Always include the assignee. After creation, report:
- Issue key (e.g. `SR-123`) and URL
- One-line summary of what was created

---

## Guardrails

- Never create without user confirmation (Step 5 is mandatory).
- Write acceptance criteria from the user's point of view — observable behavior,
  not internal implementation. "User sees X" not "component renders Y".
- Don't invent business context that contradicts the user's description. Flag
  uncertain criteria with `- [ ] TODO: confirm with team`.
- Summaries must be action-oriented and concise: "Visitors can filter projects
  by category" not "This story is about adding filtering functionality".
- If `createJiraIssue` fails, surface the error — do not retry silently.
