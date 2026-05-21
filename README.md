# EXADS AI Skills

Official EXADS agent skills, including MCP-backed skills so you can better leverage your data and automate common workflows.

The skills in this repository follow the open [Agent Skills](https://agentskills.io/) specification.

## Prerequisites

- An AI coding agent that supports the [Agent Skills](https://agentskills.io/) specification.
- Access to an EXADS MCP. Configure it in your agent according to the MCP's own documentation.

## Installation

Each skill is a self-contained folder (e.g. `daily-top-campaigns/`) anchored by a `SKILL.md`. How you install it depends on where you run your agent.

### Claude Code

Clone this repository into your agent's skills directory (`~/.claude/skills/`):

```bash
git clone https://github.com/EXADS/ai-skills.git ~/.claude/skills/exads-skills
```

Restart your agent so the new skills are discovered. Each skill declares its own trigger conditions in its `SKILL.md` frontmatter, so once installed your agent will load them automatically when relevant.

For other CLI agents, follow that agent's convention for where to place skill directories.

### Claude (claude.ai)

Zip the individual skill folder (not the repo root) so the archive's single top-level folder contains its `SKILL.md`, then upload it under *Customize > Skills*. See [Use Skills in Claude](https://support.claude.com/en/articles/12512180-use-skills-in-claude) for the full procedure and prerequisites (code execution must be enabled).

### ChatGPT (chatgpt.com)

Package the skill folder the same way (a `.zip` with a single top-level folder containing `SKILL.md`) and upload it via Skills in ChatGPT. See [Skills in ChatGPT](https://help.openai.com/en/articles/20001066-skills-in-chatgpt) for the full procedure; custom skill upload is currently in beta on Business, Enterprise, and Edu plans.

## Skills

_(Skills will be listed here as they are added.)_
