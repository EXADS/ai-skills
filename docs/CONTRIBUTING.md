# Contributing to EXADS/ai-skills

Thanks for contributing — every new skill makes EXADS usage more productive with AI Agents! This guide covers the full proposal-and-PR flow.

## Step 0 — Is it a good skill candidate?

Good candidates:

- are triggered by natural-language intent (the user asks for something; the AI Agent loads the skill automatically),
- encapsulate EXADS-specific knowledge or workflows, and
- are useful to more than one person.

If it's a one-off script or a personal shortcut, it probably doesn't belong here.

## Step 1 — Open a proposal issue

Use the **"Skill proposal"** template in [`.github/ISSUE_TEMPLATE/`](../.github/ISSUE_TEMPLATE/skill_proposal.md). We'll look into the idea, suggest improvements, and once it's solid, we'll develop it or let you do it.

## Step 2 — Write the skill

### Folder structure

A skill is a self-contained folder at the repo root:

```
<skill-name>/
├── SKILL.md            # required
└── references/         # optional — bundled docs the AI Agent can read on demand
    └── <reference-name>.md
```

`<skill-name>` must be [kebab-case](https://developer.mozilla.org/en-US/docs/Glossary/Kebab_case) and match the `name` in the [frontmatter](https://agentskills.io/specification#frontmatter).

### SKILL.md frontmatter (checked by CI)

```yaml
---
name: <kebab-case, matches folder name, ≤40 chars>
description: Use when <trigger — what should make the AI Agent load this skill>. Include 2-3 example prompts. ≤1500 chars.
---
```

[`scripts/validate-skills.mjs`](../scripts/validate-skills.mjs) enforces these rules. A mismatched/over-long `name` or an over-long `description` **fails** CI; a description that doesn't start with "Use when…" and any key beyond `name`/`description` produce **warnings** — keep it to the two keys.

### Writing the description

The description is how the AI Agent decides whether to load your skill. Be specific about triggers.

- Bad: *"Handles EXADS stuff"*
- Good: *"Use when the user asks how to inspect a campaign — 'why isn't campaign X delivering', 'show campaign settings', 'decode campaign status'. Returns structured settings plus rate-capped deliveries."*

### Writing the body

The body is instructions to *the AI Agent*, not a user-facing manual. Write imperatively:

- Ask for the campaign ID if not provided
- Call the `get_advertiser_global_statistics` tool
- Return as a Markdown table

Include at least one worked example. Use [`daily-top-campaigns/`](../daily-top-campaigns/) as the canonical model — a tight `SKILL.md` plus a `references/example.md`.

## Step 3 — Test locally

### Claude Code

Clone the repo into your agent's skills directory and restart Claude Code:

```bash
git clone https://github.com/EXADS/ai-skills.git ~/.claude/skills/exads-skills
```

Then trigger the skill with one of the prompts from your description. If the AI Agent doesn't pick it up, tighten the description.

### claude.ai / ChatGPT

For a local test run, zip your skill folder (so `SKILL.md` is at the zip root) and upload it as a *personal* skill via the Skills menu on either surface. Org-level upload waits for merge + release (see [After merge](#after-merge)).

## Step 4 — Run the local checks

```bash
node scripts/validate-skills.mjs   # frontmatter rules — must pass
```

Release zips are built by CI when a version tag is pushed, via `scripts/build-skill-zips.mjs`. (That script is being aligned with this flat layout — you don't need to run it locally.)

## Step 5 — Open the PR

Use the [PR template](../.github/pull_request_template.md). The checklist there covers the key points we look for in reviews: triggerability, scope, accuracy, and safety. Reviewers may suggest changes to the description or body to better meet those criteria.

## Review rubric

Reviewers check:

1. **Triggerability** — would the description catch realistic prompts?
2. **Scope** — one thing done well, not five poorly?
3. **Accuracy** — are EXADS-specific facts retrieved from an official source (MCP tool, official documentation)?
4. **Safety** — no secrets, no destructive side effects, no personal credentials bundled in?

## After merge

A maintainer tags a release (`vX.Y.Z`). CI builds the per-skill zips and attaches them to the GitHub Release. Users can then upload those zips to their AI Agent surface of choice. Org-level uploads (for shared use across an organization) require a release, so if you want to use your skill before the PR is merged, upload it as a personal skill.
