# yo water:claude-init

## Description

Initializes the current directory with the Water Framework Claude Code configuration.

This command sets up [Claude Code](https://claude.ai/claude-code) to work as a **Water Framework expert** in any project folder, whether it is an existing Water workspace or a generic directory that needs Water Framework guidance.

## What it does

1. **Copies `CLAUDE.md`** from the generator's built-in template (`templates/claude/CLAUDE.md`) into the current directory.
   This file instructs Claude Code to act as a Water Framework Architect, following the framework's conventions, patterns, and best practices.

2. **Creates a `.claude/` directory** in the current folder.

3. **Clones `https://github.com/Water-Framework/claude.git`** inside `.claude/`.
   This repository contains the Water Framework knowledge base: skill modules, reference docs, and specialized guidance for architecture, persistence, REST, security, testing, and more.

## Usage

```bash
yo water:claude-init
```

No arguments or options are required. The command is fully automated.

## Prerequisites

- `git` must be installed and accessible in the PATH
- An active internet connection to reach GitHub

## Output

```
<current-directory>/
  CLAUDE.md          # Water Framework instructions for Claude Code
  .claude/           # Cloned from https://github.com/Water-Framework/claude.git
    skills/          # Specialized skill modules (water-generate, etc.)
    ...
```

## Idempotency

- If `CLAUDE.md` already exists, it is **not overwritten**.
- If `.claude/` already exists and is **not empty**, the git clone is **skipped**.
- The command is safe to run multiple times.

## Notes

- This command does **not** require an existing Water workspace (`.yo-rc.json`).
  It can be run in any directory.
- After initialization, open Claude Code in the same directory — it will automatically load `CLAUDE.md` and the knowledge base from `.claude/`.
