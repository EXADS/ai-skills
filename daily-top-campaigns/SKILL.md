---
name: daily-top-campaigns
description: Use when the user asks for their top-performing advertiser campaigns for a single day (yesterday by default). Returns a ranked table plus a short narrative summary. Calls the get_advertiser_global_statistics tool.
---

# daily-top-campaigns

Show the user's top-performing advertiser campaigns for one day.

## When to use

- The user asks about "yesterday's top campaigns", "best campaigns today", "which campaigns did best on <date>", or any similar single-day ranking question.

## Procedure

1. From the user's request, infer the day (default: yesterday in their local timezone), the ranking metric (default: impressions), and the number of rows (default: a handful).
2. Retrieve campaign-level advertiser statistics for the resolved day by reading
   `fetch-advertiser-statistics/SKILL.md` (repo-relative sibling path) and following its Procedure,
   passing the resolved day as an explicit single-day window, the campaign dimension, and the
   metrics this skill renders (impressions, clicks, ctr, cost) — the platform validates those
   metric names, this skill doesn't. This skill resolves its own day first, so the sibling's own
   default window never fires.
   - If that sibling folder isn't installed, tell the user the building-block skill is missing and
     fall back to calling the `get_advertiser_global_statistics` tool directly for the resolved
     day, discovering its dimensions and metrics from its declared schema at call time.
3. Sort the returned campaigns by the chosen metric and keep the top rows.
4. Render a Markdown table (campaign id / name plus impressions, clicks, CTR, spend) followed by a 1–3 sentence narrative summary of what stood out.

## Error handling

- If neither the sibling skill nor the tool is available in the agent, tell the user.
- If there is no data for the requested day, say so plainly. Never fabricate.
