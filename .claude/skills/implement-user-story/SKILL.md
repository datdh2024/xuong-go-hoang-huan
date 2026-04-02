---
name: implement-user-story
description: Use this skill when implementing a Jira user story end-to-end, from writing tests to committing code. Trigger when the user says "implement this story", "start working on", "build this feature", "code this up", or picks up a Jira ticket to work on. Always use this skill for any story-level implementation work — do not skip even for "small" stories.
---

## Goal

Implement a user story using TDD, with user confirmation at each phase, ending in a committed branch and updated documentation.

## Steps

1. **Explore the task**
   - Apply `/task-explorer` skill to find or create the relevant user flow in `docs/user-flows/`
   - Read the Jira story: title, description, acceptance criteria, linked flows

2. **Test-driven development**
   - Apply `/test-driven-development` skill
   - Follow TDD phases: Red → Green → Refactor
   - **Wait for user confirmation after each phase before continuing**

3. **User acceptance**
   - Present completed implementation to user
   - Ask: "Does this satisfy the acceptance criteria? Anything to change?"
   - Do not proceed until user explicitly confirms completion

4. **Update documentation**
   - Update `docs/user-flows/` if behavior changed
   - Update or add tests to reflect final behavior
   - Update any affected README or API docs

5. **Update Jira**
   - Set story status → Done (or as appropriate)
   - Add a note summarizing what was implemented and any deviations from original spec

6. **Commit and push**
   - Branch name: derived from parent Epic/Story key, e.g. `feat/PROJ-42-checkout-flow`
   - Create branch if it doesn't exist
   - Commit with message: `[PROJ-XX] Short description of change`
   - Push branch to remote

## Checkpoints (do not skip)

- [ ] User flow documented before coding starts
- [ ] User confirmed TDD phase completion
- [ ] User accepted final implementation
- [ ] Docs updated
- [ ] Jira updated
- [ ] Code committed and pushed
