---
name: break-task
description: Use this skill when breaking down a Jira Epic or Story into smaller user stories or subtasks. Trigger whenever the user mentions "break down", "split task", "decompose epic", "create user stories", "what are the subtasks", or wants to plan sprints from a parent ticket. Always use this skill before implementation begins on a large Epic.
---

## Goal

Break a parent Epic/Story into actionable, well-scoped user stories ready for sprint planning.

## Steps

1. **Fetch the Epic/Story** from Jira (or accept from user input). Read title, description, acceptance criteria.

2. **Discover related user flows**
   - Check `docs/user-flows/` for flows related to this feature
   - List matched flows and include their paths as references in each relevant story

3. **Draft user stories**
   - Each story = one specific feature slice (not too granular — a story should take 1–3 days)
   - Format: `As a [user], I want [action], so that [value]`
   - No technical implementation details — only user-visible behavior
   - Link related user flow file(s) in each story's description
   - Apply Agile: each story must be independently valuable and testable

4. **Confirm with user**
   - Present the full story list and ask for review
   - Wait for user feedback before proceeding
   - Apply any corrections

5. **Prioritize stories**
   - Rank by: Priority (High/Medium/Low) × Impact (High/Medium/Low)
   - High priority + High impact → top of list
   - Present as a sorted table with rationale

6. **Save to Jira**
   - Create each story as a child of the parent Epic/Story
   - Issue type: Story (if parent is Epic) or Task (if parent is Story)
   - Include: title, description, user flow links, priority label

## Output

A prioritized list of user stories in Jira, each linked to relevant user flows.
