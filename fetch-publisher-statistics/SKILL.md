---
name: fetch-publisher-statistics
description: Use when the user wants publisher statistics (e.g. site or zone revenue, impressions, or CPM broken down by country, day, or other dimensions) for their own account. Calls the get_publisher_global_statistics tool with a discovered set of dimensions and metrics and an explicit date window.
---

# fetch-publisher-statistics

Fetch publisher statistics, broken down by the requested dimensions, for a date window.

## When to use

- The user asks for publisher/site/zone statistics directly, e.g. "show me revenue by site last
  week", "cpm and impressions by zone for May".

## Procedure

1. If the request names no dimensions and no metrics, inspect the `get_publisher_global_statistics`
   tool's declared schema at call time and reply with the dimensions and metrics it currently
   supports, plus a usage example phrased as prose — never a slash-command form, since this skill
   triggers on its description, not an explicit command.
2. Resolve the date window:
   - If the caller supplies an explicit window, use it as given.
   - If no window is supplied, default to the **last 7 full days, not including today** — resolve
     "today" from the agent host's local date. Always send an explicit start and end date to the
     tool; never rely on its own default. **State the resolved start and end dates in the output.**
   - If the requested window exceeds the tool's declared maximum, reject the request and name the
     cap — do not silently truncate it.
3. Validate every requested **dimension** against the tool's declared schema before calling. Do
   **not** pre-validate metric names — the platform's own metric groups are machine-readable but
   individual metric names are not, so send requested metrics as given and let the platform be the
   authority on whether they're valid. A metric the platform doesn't declare at all (for example,
   "fill rate") is not approximated from other metrics — it lands on the unrecognised-metric path
   below.
4. Call `get_publisher_global_statistics` for the resolved dimensions, metrics, and window.
5. Render the results as a Markdown table.

## Error handling

- Unknown dimension → name it, list the currently valid dimensions, and do not call the tool.
- A requested metric the platform rejects or does not declare (e.g. "fill rate") → surface that
  plainly, naming the metric and whatever valid options can be identified; never invent or
  approximate a value for it.
- Valid request, no rows for the window → say plainly there is no data for the selected period;
  this is not an error and not a blank response.
- A request naming an entity (e.g. a site or zone) the authenticated account does not own →
  surface the platform's refusal plainly. Never retry, widen the filter, invent rows, or present an
  empty table as a valid result. Access scoping itself is inherited from the MCP authentication;
  this skill adds no authorisation logic of its own.
- Upstream failure (tool unavailable, auth failure, timeout) → tell the user in plain language;
  never show a stack trace or raw error, never fabricate a result.
