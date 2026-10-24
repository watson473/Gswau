// @vitest-environment node
// Runs the real migrations in an in-memory Postgres (PGlite) and checks the access rules.
import { readFileSync } from "node:fs";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { beforeAll, describe, expect, it } from "vitest";

const migrations = [
  "0000_gswau_schema.sql",
  "0001_subscribers_podcast_reviews.sql",
  "0002_phase1_membership.sql",
];

// Minimal stand-ins for what Supabase provides: roles, auth.users, auth.uid() and storage.
const supabaseStubs = `
  create role anon; create role authenticated; create role service_role;
  create schema auth;
  create table auth.users (id uuid primary key default gen_random_uuid(), email text, raw_user_meta_data jsonb default '{}');
  create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('test.uid', true), '')::uuid $$;
  create schema storage;
  create table storage.buckets (id text primary key, name text, public boolean);
  create table storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text, name text);
  alter table storage.objects enable row level security;
`;

let db: PGlite;
const ids: Record<string, string> = {};

async function as(uid: string | null) {
  await db.query("select set_config('test.uid', $1, false)", [uid ?? ""]);
}
async function canOpen(product: string) {
  const { rows } = await db.query<{ ok: boolean }>("select public.has_access($1) as ok", [
    ids[product],
  ]);
  return rows[0]!.ok;
}
async function signUp(email: string) {
  const { rows } = await db.query<{ id: string }>(
    "insert into auth.users (email) values ($1) returning id",
    [email],
  );
  return rows[0]!.id;
}
async function membership(email: string, status: string, periodEnd: string | null) {
  await db.query(
    "insert into public.memberships (email, status, current_period_end) values ($1, $2, $3::timestamptz)",
    [email, status, periodEnd],
  );
}

beforeAll(async () => {
  db = new PGlite();
  await db.exec(supabaseStubs);
  for (const file of migrations)
    await db.exec(readFileSync(path.resolve(__dirname, "../../drizzle/migrations", file), "utf8"));

  for (const [slug, tier, type] of [
    ["free-chapter", "free", "ebook"],
    ["member-book", "members", "ebook"],
    ["premium-course", "premium", "course"],
    ["bundle", "members", "bundle"],
    ["bundled-premium", "premium", "ebook"],
  ]) {
    const { rows } = await db.query<{ id: string }>(
      "insert into public.products (slug, title, type, access_tier) values ($1, $1, $2::product_type, $3::access_tier) returning id",
      [slug, type, tier],
    );
    ids[slug!] = rows[0]!.id;
  }
  await db.query("insert into public.bundle_items (bundle_id, product_id) values ($1, $2)", [
    ids["bundle"],
    ids["bundled-premium"],
  ]);
  ids["admin"] = await signUp("owner@gswau.com"); // first account becomes admin
});

describe("visitors without an account", () => {
  it("open free products only", async () => {
    await as(null);
    expect(await canOpen("free-chapter")).toBe(true);
    expect(await canOpen("member-book")).toBe(false);
    expect(await canOpen("premium-course")).toBe(false);
  });
});

describe("members", () => {
  it("open member products but not premium extras", async () => {
    const uid = await signUp("active@example.com");
    await membership(
      "active@example.com",
      "active",
      new Date(Date.now() + 20 * 864e5).toISOString(),
    );
    await as(uid);
    expect(await canOpen("member-book")).toBe(true);
    expect(await canOpen("premium-course")).toBe(false);
  });

  it("keep access after cancelling until the paid period ends", async () => {
    const uid = await signUp("cancelled@example.com");
    await membership(
      "cancelled@example.com",
      "cancelled",
      new Date(Date.now() + 5 * 864e5).toISOString(),
    );
    await as(uid);
    expect(await canOpen("member-book")).toBe(true);
  });

  it("lose access when the membership has ended", async () => {
    const uid = await signUp("ended@example.com");
    await membership("ended@example.com", "ended", new Date(Date.now() + 5 * 864e5).toISOString());
    await as(uid);
    expect(await canOpen("member-book")).toBe(false);
  });

  it("lose access once the period plus 3 days' grace has passed", async () => {
    const uid = await signUp("lapsed@example.com");
    await membership(
      "lapsed@example.com",
      "past_due",
      new Date(Date.now() - 4 * 864e5).toISOString(),
    );
    await as(uid);
    expect(await canOpen("member-book")).toBe(false);
  });

  it("match their membership by email even before it is linked", async () => {
    await membership("later@example.com", "active", null);
    const uid = await signUp("Later@Example.com");
    await as(uid);
    expect(await canOpen("member-book")).toBe(true);
  });
});

describe("individual purchases", () => {
  it("are kept after a membership lapses", async () => {
    await db.query(
      "insert into public.entitlements (email, product_id, source) values ($1, $2, 'gumroad')",
      ["buyer@example.com", ids["premium-course"]],
    );
    await membership("buyer@example.com", "ended", null);
    const uid = await signUp("buyer@example.com");
    await as(uid);
    expect(await canOpen("premium-course")).toBe(true);
    expect(await canOpen("member-book")).toBe(false);
    const { rows } = await db.query<{ user_id: string }>(
      "select user_id from public.entitlements where email = 'buyer@example.com'",
    );
    expect(rows[0]!.user_id).toBe(uid); // linked on signup
  });

  it("are removed when revoked (refund)", async () => {
    const uid = await signUp("refund@example.com");
    await db.query(
      "insert into public.entitlements (user_id, email, product_id, revoked_at) values ($1, $2, $3, now())",
      [uid, "refund@example.com", ids["premium-course"]],
    );
    await as(uid);
    expect(await canOpen("premium-course")).toBe(false);
  });

  it("include every book in a purchased bundle", async () => {
    const uid = await signUp("bundle@example.com");
    await db.query("insert into public.entitlements (user_id, product_id) values ($1, $2)", [
      uid,
      ids["bundle"],
    ]);
    await as(uid);
    expect(await canOpen("bundled-premium")).toBe(true);
  });
});

describe("admins", () => {
  it("open everything", async () => {
    await as(ids["admin"]!);
    expect(await canOpen("premium-course")).toBe(true);
  });
});
