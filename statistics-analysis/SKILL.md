---
name: statistics-analysis
description: Use when the user asks for a trend or analysis of their advertiser performance over a date range (default last 7 full days vs the prior 7 days), or wants observations on what changed week-on-week. Calls the `get_advertiser_global_statistics` tool for the current and comparison windows and produces headline totals, deltas, and relevant observations.
---

# statistics-analysis

Analyse the user's advertiser performance over a date range and compare it to a prior window.

## When to use

- The user asks "how did I do this week", "compare last week to the one before", "what changed recently", or any similar multi-day question.
- The user wants headlines and observations across multiple days, not a single-day ranking.

## Procedure

1. From the user's request, infer the current window (default: the last 7 full days in their local timezone) and the comparison window (default: the 7 days immediately before).
2. Call the `get_advertiser_global_statistics` tool once per window. Inspect the tool's declared input schema at call time to learn its parameter names; do not assume them.
3. Aggregate each response into headline totals (impressions, clicks, spend, CTR) and compute week-on-week deltas, both absolute and percentage.
4. Compare campaign-level data between the two windows to identify the campaigns with the largest swings.
5. Produce:
   - a headline table with current-window totals and the deltas vs the comparison window,
   - a short table of the campaigns with the biggest swings,
   - relevant observations about what changed and why it might matter.

## Error handling

- If the tool is not available in the agent, tell the user.
- If a time window has no data, say so plainly and skip the parts of the analysis that depend on it. Never fabricate deltas or observations.
