---
name: social-audit
description: Read every profile a stranger finds when they look you up and find what contradicts your positioning. Use before a launch.
---

Audit the surface, not just the site. Someone who hears about you checks four or five places before deciding, and most of them are stale.

1. **List every property.** Search the product name and the founder name and write down everything that comes back — X, LinkedIn (personal and company), GitHub, the site, Product Hunt, an old Substack, a dead Discord invite. Include the ones you forgot you made. Those do the most damage.
2. **Read each one cold.** Pretend you have never heard of this product. For each profile: what does it claim to be, who does it seem to be for, and when was it last touched?
3. **Check against the positioning brief.** Open `04-positioning/brief.md`. If it does not exist, stop and run `/positioning-brief` — auditing against a README grades the wrong thing. For each property, mark it consistent, contradictory, or silent. Contradictory is worse than silent — a bio describing a product you pivoted away from actively confuses a buyer.
4. **Flag the specific damage.** Name it concretely: a banner from a previous product, a bio in the wrong tense, a pinned post about a launch that never happened, a link to a 404. Vague notes like "needs updating" do not get acted on.
5. **Rank by traffic, not by effort.** Fix what people actually reach first. One profile that gets checked before every sales call matters more than four nobody visits.

Output a table to `05-site/social-audit.md`: property, URL, verdict, the specific problem, and priority. Be blunt — this is the one document where politeness costs the user customers.
