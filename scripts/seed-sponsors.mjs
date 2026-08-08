#!/usr/bin/env node
/* ------------------------------------------------------------------
   The confirmed sponsors, as of the first season.

     node --env-file-if-exists=.env.local scripts/seed-sponsors.mjs

   Idempotent on `org`, so re-running updates rather than duplicates —
   which is what you want when a tier changes or a logo lands.

   `amount` is set to the tier's published floor rather than a real
   invoice figure: these are in-kind and partner arrangements, and the
   number exists so tierFor() and the admin totals have something
   consistent to read. Change it when a real figure is agreed.
------------------------------------------------------------------ */

import { neon, neonConfig } from "@neondatabase/serverless";

if (process.env.NEON_LOCAL_PROXY) {
  neonConfig.fetchEndpoint = process.env.NEON_LOCAL_PROXY;
  neonConfig.useSecureWebSocket = false;
  neonConfig.poolQueryViaFetch = true;
}

const SPONSORS = [
  {
    org: "Workuity",
    tier: "platinum",
    amount: 10000,
    website: "https://www.workuity.com/",
    logo_url: "/sponsor-workuity.png",
    items: "The venue sponsor — Workuity Biltmore hosts all six meetups and the hackathon weekend.",
    credit_name: "Workuity",
    sort: 1,
  },
  {
    org: "desic",
    tier: "gold",
    amount: 5000,
    website: "https://www.desic.xyz/",
    logo_url: "/sponsor-desic.svg",
    items: "Program underwrite.",
    credit_name: "desic",
    wordmark: true,
    sort: 2,
  },
  {
    org: "AutomationInterns.com",
    tier: "gold",
    amount: 5000,
    website: "https://automationinterns.com/",
    logo_url: "/sponsor-automationinterns.png",
    items: "Program underwrite.",
    credit_name: "Jon S",
    sort: 3,
  },
  {
    org: "CEI Gateway",
    tier: "silver",
    amount: 2500,
    website: "https://www.ceigateway.com/",
    logo_url: "/sponsor-cei.png",
    items: "Community partner.",
    credit_name: "CEI Gateway",
    sort: 4,
  },
];

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. See the README.");
  process.exit(1);
}

const sql = neon(url);

for (const s of SPONSORS) {
  const existing = await sql`select id from sponsorships where org = ${s.org}`;

  if (existing.length) {
    await sql`
      update sponsorships set
        tier = ${s.tier}, amount = ${s.amount}, website = ${s.website},
        logo_url = ${s.logo_url}, items = ${s.items}, credit_name = ${s.credit_name},
        sort = ${s.sort}, wordmark = ${Boolean(s.wordmark)}, status = 'confirmed', is_public = true, updated_at = now()
      where id = ${existing[0].id}`;
    console.log(`updated  ${s.org.padEnd(14)} ${s.tier}`);
  } else {
    await sql`
      insert into sponsorships
        (org, tier, amount, website, logo_url, items, credit_name, sort, wordmark, status, is_public)
      values
        (${s.org}, ${s.tier}, ${s.amount}, ${s.website}, ${s.logo_url}, ${s.items},
         ${s.credit_name}, ${s.sort}, ${Boolean(s.wordmark)}, 'confirmed', true)`;
    console.log(`inserted ${s.org.padEnd(14)} ${s.tier}`);
  }
}

const rows = await sql`
  select org, tier, status from sponsorships where is_public = true order by sort`;
console.log("\nPublic wall:");
for (const r of rows) console.log(`  ${r.tier.padEnd(9)} ${r.org} (${r.status})`);
