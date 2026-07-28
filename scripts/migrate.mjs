#!/usr/bin/env node
/* ------------------------------------------------------------------
   Applies lib/schema.sql to DATABASE_URL.

     npm run migrate

   Every statement in the schema is idempotent (`create table if not
   exists`, `create index if not exists`), so this is safe to run on
   every deploy and after every schema edit. There is no migration
   history table and no numbered folder: the schema file is the
   desired state, and adding to it is how you change the database.

   The one thing it does beyond the DDL is make sure ADMIN_EMAIL owns
   the place. Without that, promoting yourself means hand-writing SQL
   against production, which is exactly the kind of step that gets
   done wrong at 11pm on a Friday.
------------------------------------------------------------------ */

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { neon, neonConfig } from "@neondatabase/serverless";

/* Same local-proxy escape hatch as lib/db.js — see the comment there. */
if (process.env.NEON_LOCAL_PROXY) {
  neonConfig.fetchEndpoint = process.env.NEON_LOCAL_PROXY;
  neonConfig.useSecureWebSocket = false;
  neonConfig.poolQueryViaFetch = true;
}

const here = dirname(fileURLToPath(import.meta.url));
const schemaPath = join(here, "..", "lib", "schema.sql");

/**
 * Splits the schema into statements.
 *
 * A naive `split(";")` breaks on the semicolons inside the comments,
 * so this walks the file tracking whether it's inside a quoted string,
 * a line comment or a block comment, and only treats a semicolon as a
 * boundary when it's in none of them.
 */
function statements(source) {
  const out = [];
  let buffer = "";
  let inQuote = false;
  let inLine = false;
  let inBlock = false;

  for (let i = 0; i < source.length; i += 1) {
    const ch = source[i];
    const next = source[i + 1];

    if (inLine) {
      if (ch === "\n") inLine = false;
      continue;
    }
    if (inBlock) {
      if (ch === "*" && next === "/") {
        inBlock = false;
        i += 1;
      }
      continue;
    }
    if (!inQuote && ch === "-" && next === "-") {
      inLine = true;
      continue;
    }
    if (!inQuote && ch === "/" && next === "*") {
      inBlock = true;
      i += 1;
      continue;
    }
    if (ch === "'") {
      // '' inside a string is an escaped quote, not the end of one
      if (inQuote && next === "'") {
        buffer += "''";
        i += 1;
        continue;
      }
      inQuote = !inQuote;
    }
    if (ch === ";" && !inQuote) {
      const statement = buffer.trim();
      if (statement) out.push(statement);
      buffer = "";
      continue;
    }
    buffer += ch;
  }

  const tail = buffer.trim();
  if (tail) out.push(tail);
  return out;
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error(
      "DATABASE_URL is not set.\n\n" +
        "  1. Create a Neon Postgres store on the Vercel project (Storage → Create).\n" +
        "  2. Run `vercel env pull .env.local`.\n" +
        "  3. Run `npm run migrate` again.\n",
    );
    process.exit(1);
  }

  const sql = neon(url);
  const source = await readFile(schemaPath, "utf8");
  const list = statements(source);

  console.log(`Applying ${list.length} statements from lib/schema.sql …`);

  for (const [i, statement] of list.entries()) {
    const label = statement.replace(/\s+/g, " ").slice(0, 68);
    try {
      await sql.query(statement);
      console.log(`  ${String(i + 1).padStart(2, "0")}  ${label}`);
    } catch (error) {
      console.error(`\nFailed on statement ${i + 1}:\n${statement}\n\n${error.message}\n`);
      process.exit(1);
    }
  }

  const admin = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  if (admin) {
    const rows = await sql`select id, is_admin from users where email = ${admin}`;
    if (!rows.length) {
      console.log(
        `\nADMIN_EMAIL (${admin}) has no account yet — it gets the admin flag ` +
          "automatically the first time it signs in.",
      );
    } else {
      await sql`update users set is_admin = true where email = ${admin}`;
      await sql`
        insert into user_roles (user_id, role) values (${rows[0].id}, 'admin')
        on conflict do nothing`;
      console.log(`\nadmin: ${admin} confirmed as an administrator.`);
    }
  } else {
    console.log(
      "\nADMIN_EMAIL isn't set. The first account to sign in becomes the admin.",
    );
  }

  console.log("\nDone.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
