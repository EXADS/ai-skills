# Example: fetch-advertiser-statistics

**User:** Show me cpm, impressions and clicks by country for the last 7 days.

**Agent:**

Window: 2026-05-14 to 2026-05-20 (last 7 full days, not including today).

| Country | Impressions | Clicks | CPM (€) |
|---------|-------------|--------|---------|
| USA     | 1,204,300   | 9,842  | 3.12    |
| BRA     | 842,110     | 6,230  | 1.98    |
| DEU     | 511,900     | 4,015  | 2.44    |

**User:** Show me campaign stats but group by `traffic_channel`.

**Agent:**

"traffic_channel" isn't a dimension I can currently group by. Available dimensions include:
campaign, country, device, zone, date, hour, day of week, operating system, and browser — try one
of those instead.
