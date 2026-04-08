#!/usr/bin/env node

/**
 * PreToolUse hook: blocks git add, git commit, and git push from Bash tool calls
 * unless the environment variable ALLOW_COMMIT=1 is set.
 *
 * This prevents superpowers/agents from staging/committing/pushing after each task.
 * When you're ready to commit all work at once, either:
 *   1. Remove this hook from settings
 *   2. Set ALLOW_COMMIT=1 in your shell before running Claude Code
 */

const input = JSON.parse(require("fs").readFileSync("/dev/stdin", "utf8"));

if (input.tool_name !== "Bash") {
  process.exit(0);
}

const command = input.tool_input?.command || "";

const isGitBlocked =
  /\bgit\s+add\b/.test(command) ||
  /\bgit\s+commit\b/.test(command) ||
  /\bgit\s+push\b/.test(command);

if (isGitBlocked && process.env.ALLOW_COMMIT !== "1") {
  const result = {
    decision: "block",
    reason:
      "Blocked by hook: git add/commit/push disabled. Commit only when all tasks are done. To allow: set ALLOW_COMMIT=1 or remove the hook.",
  };
  process.stdout.write(JSON.stringify(result));
}
