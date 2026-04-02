---
name: task-explorer
description: Use this skill when you need to explore tasks in the project.
allowed-tools: Bash(playwright-cli:*)
---

- check docs/user-flows, find the user flow related to current task
- if current flow not found, use playwight-cli to access current DEV app frontend on localhost:3000 with args --headed --persistent --profile=chrome-profile to discover app and current task behavior
- don't include technical information, just user flow
- when you discover a new or changes user flow, save it to docs/user-flows/[category/screen/group]/UF-\*.md. use this folder to in next time you need to discover app or feature
