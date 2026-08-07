---
name: fetch-advertiser-statistics
description: Use when the user wants advertiser statistics (e.g. campaign performance broken down by country, day, or other dimensions) for their own account, or when another skill needs to retrieve advertiser statistics as a building block. Calls the get_advertiser_global_statistics tool with a discovered set of dimensions and metrics and an explicit date window.
---

# fetch-advertiser-statistics

Fetch advertiser statistics, broken down by the requested dimensions, for a date window — as a
direct end-user query or as a retrieval building block for other skills.

## When to use

- The user asks for advertiser/campaign statistics directly, e.g. "show me clicks and cost by
  country last week", "cpm and ctr by campaign for May".
- Another skill needs advertiser statistics and delegates to this skill instead of retrieving
  them itself.

## Procedure

1. If the request names no dimensions and no metrics, inspect the `get_advertiser_global_statistics`
   tool's declared schema at call time and reply with the dimensions and metrics it currently
   supports, plus a usage example phrased as prose (e.g. "try asking for cpm, impressions and
   clicks by country for the last 7 days") — never a slash-command form, since this skill triggers
   on its description, not an explicit command.
2. Resolve the date window:
    - If the caller (a user or a delegating skill) supplies an explicit window, use it as given.
    - If no window is supplied, default to the **last 7 full days, not including today** — resolve
      "today" from the agent host's local date. Always send an explicit start and end date to the
      tool; never rely on its own default. **State the resolved start and end dates in the output.**
    - If the requested window exceeds the tool's declared maximum, reject the request and name the
      cap — do not silently truncate it.
3. Validate every requested **dimension** against the tool's declared schema before calling. Do
   **not** pre-validate metric names — the platform's own metric groups are machine-readable but
   individual metric names are not, so send requested metrics as given and let the platform be the
   authority on whether they're valid.
4. Call `get_advertiser_global_statistics` for the resolved dimensions, metrics, and window.
5. Render the results as a Markdown table — consumable directly by a user or by a delegating
   skill's own value-add step.

## Error handling

- Unknown dimension → name it, list the currently valid dimensions, and do not call the tool.
- A requested metric the platform rejects → surface the platform's refusal plainly, naming the
  metric and whatever valid options can be identified; never invent or approximate a value for it.
- Valid request, no rows for the window → say plainly there is no data for the selected period;
  this is not an error and not a blank response.
- A request naming an entity (e.g. a campaign) the authenticated account does not own → surface the
  platform's refusal plainly. Never retry, widen the filter, invent rows, or present an empty table
  as a valid result. Access scoping itself is inherited from the MCP authentication; this skill adds
  no authorisation logic of its own.
- Upstream failure (tool unavailable, auth failure, timeout) → tell the user in plain language;
  never show a stack trace or raw error, never fabricate a result.
