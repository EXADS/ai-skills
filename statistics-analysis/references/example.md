# Example: statistics-analysis

**User:** How are my statistics looking this week vs. last week?

**Agent:**

Current window: 2026-05-14 to 2026-05-20. Comparison: 2026-05-07 to 2026-05-13.

| Metric      | Current     | Δ absolute  | Δ %     |
| ----------- | ----------- | ----------- | ------- |
| Impressions | 4,820,300   | +312,100    | +6.9%   |
| Clicks      | 38,442      | +2,108      | +5.8%   |
| Spend (€)   | 17,510.22   | +1,402.55   | +8.7%   |
| CTR         | 0.80%       | −0.01 pp    | −1.1%   |

Biggest movers:

| Campaign             | Δ Spend (€) | Δ %     |
| -------------------- | ----------- | ------- |
| Acme Spring Sale     | +2,118.40   | +24.6%  |
| Acme Retargeting     | −612.70     | −19.3%  |
| Acme Geo-Test US     | +303.10     | +new    |

- Acme Spring Sale drove the entire spend uplift; without it, total spend would have been roughly flat.
- Acme Retargeting pulled back nearly 20% — worth checking whether budgets or pacing changed.
- A new geo-targeted campaign (Acme Geo-Test US) appeared this window and is already a meaningful share of spend.
