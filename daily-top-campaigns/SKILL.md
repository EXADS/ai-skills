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
2. Call the `get_advertiser_global_statistics` tool for the resolved day. Inspect the tool's declared input schema at call time to learn its parameter names; do not assume them.
3. Sort the returned campaigns by the chosen metric and keep the top rows.
4. Render a Markdown table (campaign id / name plus impressions, clicks, CTR, spend) followed by a 1–3 sentence narrative summary of what stood out.

## Error handling

- If the tool is not available in the agent, tell the user.
- If there is no data for the requested day, say so plainly. Never fabricate.
