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
  "0003_contact_messages.sql",
  "0004_audiobook_rights.sql",
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

describe("audiobooks", () => {
  async function rights(product: string) {
    const { rows } = await db.query<{ can_listen: boolean; can_download: boolean }>(
      "select * from public.audiobook_rights($1)",
      [ids[product]],
    );
    return rows[0]!;
  }
  const future = () => new Date(Date.now() + 20 * 864e5).toISOString();

  it("give visitors neither listening nor downloading", async () => {
    await as(null);
    expect(await rights("member-book")).toEqual({ can_listen: false, can_download: false });
  });

  it("let members listen but not download", async () => {
    const uid = await signUp("listener@example.com");
    await membership("listener@example.com", "active", future());
    await as(uid);
    expect(await rights("member-book")).toEqual({ can_listen: true, can_download: false });
  });

  it("let buyers listen and download, matched by email before they sign up", async () => {
    await db.query(
      "insert into public.entitlements (email, product_id, source) values ($1, $2, 'gumroad')",
      ["owner2@example.com", ids["member-book"]],
    );
    const uid = await signUp("owner2@example.com");
    await as(uid);
    expect(await rights("member-book")).toEqual({ can_listen: true, can_download: true });
  });

  it("let bundle buyers download every book in the bundle", async () => {
    const uid = await signUp("bundler@example.com");
    await db.query("insert into public.entitlements (user_id, product_id) values ($1, $2)", [
      uid,
      ids["bundle"],
    ]);
    await as(uid);
    expect(await rights("bundled-premium")).toEqual({ can_listen: true, can_download: true });
  });

  it("take both away after a refund", async () => {
    const uid = await signUp("refunded@example.com");
    await db.query(
      "insert into public.entitlements (user_id, email, product_id, revoked_at) values ($1, $2, $3, now())",
      [uid, "refunded@example.com", ids["member-book"]],
    );
    await as(uid);
    expect(await rights("member-book")).toEqual({ can_listen: false, can_download: false });
  });

  it("stop signed-in browsers from opening audio files directly", async () => {
    const audio = `${ids["member-book"]}/member-book.mp3`;
    const pdf = `${ids["member-book"]}/member-book.pdf`;
    await db.query("update public.products set audio_path = $1, file_path = $2 where id = $3", [
      audio,
      pdf,
      ids["member-book"],
    ]);
    await db.query(
      "insert into storage.objects (bucket_id, name) values ('product-files', $1), ('product-files', $2)",
      [audio, pdf],
    );
    await db.exec(
      "grant usage on schema storage to authenticated; grant select on storage.objects to authenticated;",
    );
    const buyer = (
      await db.query<{ id: string }>("select id from auth.users where email = 'owner2@example.com'")
    ).rows[0]!.id;
    await as(buyer);
    await db.exec("set role authenticated");
    const { rows } = await db.query<{ name: string }>(
      "select name from storage.objects order by name",
    );
    await db.exec("reset role");
    expect(rows.map((r) => r.name)).toEqual([pdf]); // the PDF, never the audio
  });
});
