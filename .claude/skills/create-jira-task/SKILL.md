---
name: create-jira-task
description: >
  Create one or more Jira Tasks under a parent Story/Epic, inheriting assignee,
  epic, and setting Story Points correctly. Use when the user says "create jira
  task", "push tasks to jira", "add tasks to jira", or after a task-break
  breakdown is confirmed and needs to be pushed to Jira as Tasks (not Stories).
---

# Create Jira Tasks

Creates Tasks in Jira under a parent Story or Epic, inheriting parent fields
and setting Story Points in the correct custom field for this project.

---

## Step 1 — Resolve cloud ID

Call `getAccessibleAtlassianResources` to get the `cloudId`. This project uses:

- **cloudId:** `6fcd6a88-1d3d-47f9-a131-67906c195825`
- **projectKey:** `SR`

Cache these — do not re-fetch within the same session.

---

## Step 2 — Fetch parent issue fields

Call `searchJiraIssuesUsingJql` with:

```
jql: "key = <PARENT_KEY>"
fields: ["summary", "assignee", "customfield_10014", "priority", "labels", "status"]
```

Extract and store:

- `assignee.accountId` — inherit to all child tasks
- `customfield_10014` — epic link (e.g. `SR-872`), inherit to all child tasks
- `priority.name` — inherit unless overridden

---

## Step 3 — Discover the Story Points field

Call `getJiraIssueTypeMetaWithFields` with:

- `cloudId`: from Step 1
- `projectIdOrKey`: `SR`
- `issueTypeId`: `10006` (Task)

Look for the field with `"name": "Story Points"` and `schema.type: "number"`.

**Known field for this project:** `customfield_10035` (Story Points, float).

> Note: `customfield_10016` is "Story point estimate" (a different field) — do NOT use it.

---

## Step 4 — Create each task

For each task, call `createJiraIssue` with:

```json
{
  "cloudId": "<cloudId>",
  "projectKey": "SR",
  "issueTypeName": "Task",
  "summary": "<task name>",
  "contentFormat": "markdown",
  "description": "<description without estimate line>",
  "assignee_account_id": "<from parent>",
  "additional_fields": {
    "customfield_10014": "<epic key from parent>",
    "customfield_10035": <story points as number>,
    "priority": { "name": "<from parent>" }
  }
}
```

**Rules:**

- `issueTypeName` must be `"Task"` — never `"Story"`
- Story points go in `customfield_10035` as a **number** (not string)
- Do NOT include estimate in the description — it belongs in the SP field only
- Create all independent tasks in parallel

---

## Step 5 — Link tasks to parent

After all tasks are created, call `createIssueLink` for each task:

```json
{
  "cloudId": "<cloudId>",
  "type": "Relates",
  "inwardIssue": "<PARENT_KEY>",
  "outwardIssue": "<new task key>"
}
```

Create all links in parallel.

---

## Step 6 — Wire dependency "Blocks" links

For tasks that block other tasks (e.g. task A must be done before task B):

```json
{
  "cloudId": "<cloudId>",
  "type": "Blocks",
  "inwardIssue": "<blocking task key>",
  "outwardIssue": "<blocked task key>"
}
```

Semantics: `inwardIssue` **blocks** `outwardIssue`.
Create all blocking links in parallel.

---

## Step 7 — Report

Print a summary table:

| Jira          | Name | SP  | Assignee | Epic   |
| ------------- | ---- | --- | -------- | ------ |
| [SR-NNN](url) | ...  | N   | ...      | SR-NNN |

---

## Guardrails

- Always use `issueTypeName: "Task"` — not Story, not Sub-task
- Always inherit `assignee`, `epic (customfield_10014)`, and `priority` from parent
- Story points field is `customfield_10035` (float) for project SR
- Never put "Estimate: X points" in the description body — use the SP field
- Create tasks and links in parallel where there are no dependencies between calls
- If `createJiraIssue` fails on any task, surface the error immediately — do not skip silently

---

## Quick reference — SR project field IDs

| Field                | customfield         | Notes                                   |
| -------------------- | ------------------- | --------------------------------------- |
| Story Points         | `customfield_10035` | Float, the real SP field                |
| Story point estimate | `customfield_10016` | Different field — do NOT use for SP     |
| Epic Link            | `customfield_10014` | Pass epic key as string e.g. `"SR-872"` |
| Sprint               | `customfield_10020` | Array of sprint objects                 |
| Start date           | `customfield_10015` | Date string `YYYY-MM-DD`                |
