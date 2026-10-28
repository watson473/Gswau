import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatLabel, money } from "@/lib/catalog";
import {
  connectGumroad,
  gumroadSetupStatus,
  importGumroadBuyers,
  replayGumroadNotification,
} from "@/lib/admin-gumroad.functions";
import { checkKit, sendToKit } from "@/lib/admin-kit.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin — GSWAU" },
      { name: "description", content: "Manage GSWAU." },
      { property: "og:title", content: "Admin — GSWAU" },
      { property: "og:description", content: "Manage GSWAU." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

const tabs = [
  "Products",
  "Members",
  "Access",
  "Gumroad",
  "Settings",
  "Analytics",
  "Courses",
  "Reviews",
  "Podcast",
  "Blog",
  "Email list",
] as const;
type Tab = (typeof tabs)[number];
const input = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm";
const tierLabel = { free: "Free", members: "Members", premium: "Premium" } as const;

// Copies the first pages of a book PDF into the public previews bucket.
async function makePreview(productId: string, slug: string, file: File) {
  const { PDFDocument } = await import("pdf-lib");
  const { data: setting } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "preview_pages")
    .maybeSingle();
  const pages = Number(setting?.value) || 10;
  const source = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
  const preview = await PDFDocument.create();
  const count = Math.min(pages, source.getPageCount());
  const copied = await preview.copyPages(source, [...Array(count).keys()]);
  copied.forEach((page) => preview.addPage(page));
  preview.setTitle(`${source.getTitle() ?? slug} — free preview`);
  const bytes = await preview.save();
  const path = `${productId}/${slug}-preview.pdf`;
  const { error } = await supabase.storage
    .from("previews")
    .upload(path, new Blob([bytes.slice().buffer as ArrayBuffer], { type: "application/pdf" }), {
      upsert: true,
    });
  if (error) throw new Error(error.message);
  return path;
}

function Admin() {
  const { isAdmin, ready } = useAuth();
  const [tab, setTab] = useState<Tab>("Products");
  if (!ready) return <p className="mx-auto max-w-6xl px-5 py-16 text-muted-foreground">Loading…</p>;
  if (!isAdmin)
    return (
      <div className="mx-auto max-w-6xl px-5 py-16">
        <h1 className="text-3xl font-semibold">Admins only</h1>
        <Link to="/account" className="mt-4 inline-block underline">
          Go to my library
        </Link>
      </div>
    );
  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="text-4xl font-semibold">Admin</h1>
      <div className="mt-6 flex flex-wrap gap-2 border-b border-border pb-3">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-sm px-3 py-1.5 text-sm ${tab === t ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="mt-8">
        {tab === "Products" && <Products />}
        {tab === "Members" && <Members />}
        {tab === "Access" && <Access />}
        {tab === "Gumroad" && <GumroadAdmin />}
        {tab === "Settings" && <SettingsAdmin />}
        {tab === "Analytics" && <AnalyticsAdmin />}
        {tab === "Courses" && <Courses />}
        {tab === "Reviews" && <Reviews />}
        {tab === "Podcast" && <PodcastAdmin />}
        {tab === "Blog" && <Blog />}
        {tab === "Email list" && <Leads />}
      </div>
    </div>
  );
}

function useProducts() {
  return useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => (await supabase.from("products").select("*").order("position")).data ?? [],
  });
}

function Products() {
  const { data = [] } = useProducts();
  const qc = useQueryClient();
  const [edit, setEdit] = useState<(typeof data)[number] | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin-products"] });
    qc.invalidateQueries({ queryKey: ["products"] });
  };

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!edit) return;
    const { id, created_at, updated_at, is_free, ...rest } = edit;
    const row = {
      ...rest,
      gumroad_permalink: rest.gumroad_permalink?.trim() || null,
      gumroad_product_id: rest.gumroad_product_id?.trim() || null,
      slug: rest.slug
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, "-"),
    };
    const { error } = id
      ? await supabase.from("products").update(row).eq("id", id)
      : await supabase.from("products").insert(row);
    setMsg(error ? error.message : "Saved.");
    if (!error) {
      setEdit(null);
      refresh();
    }
  }

  // Uploads the book PDF or audiobook; for a PDF, also makes the free preview from its first pages.
  async function upload(file: File, kind: "file" | "audio") {
    if (!edit?.id) return setMsg("Save the product first, then upload its files.");
    setMsg(`Uploading ${file.name}…`);
    const path = `${edit.id}/${file.name.replace(/[^\w.-]+/g, "_")}`;
    const { error } = await supabase.storage
      .from("product-files")
      .upload(path, file, { upsert: true });
    if (error) return setMsg(error.message);
    const column = kind === "audio" ? "audio_path" : "file_path";
    await supabase
      .from("products")
      .update(kind === "audio" ? { audio_path: path } : { file_path: path })
      .eq("id", edit.id);
    let next = { ...edit, [column]: path };
    let note = "File uploaded.";
    if (kind === "file" && file.type === "application/pdf") {
      try {
        const previewPath = await makePreview(edit.id, edit.slug, file);
        await supabase.from("products").update({ preview_path: previewPath }).eq("id", edit.id);
        next = { ...next, preview_path: previewPath };
        note = "File uploaded and preview created.";
      } catch (err) {
        note = `File uploaded, but the preview failed: ${err instanceof Error ? err.message : err}`;
      }
    }
    setEdit(next);
    setMsg(note);
    refresh();
  }

  const blank = {
    id: "",
    created_at: "",
    updated_at: "",
    type: "ebook" as const,
    title: "",
    subtitle: "",
    slug: "",
    description: "",
    cover_image_url: "",
    price_cents: 0,
    is_free: false,
    access_tier: "members" as const,
    gumroad_permalink: "",
    gumroad_product_id: "",
    preview_path: null,
    audio_path: null,
    is_lead_magnet: false,
    is_published: true,
    is_featured: false,
    buy_url: "",
    file_path: null,
    file_size_label: "",
    length_label: "",
    gallery_urls: [] as string[],
    position: data.length,
  };

  if (edit)
    return (
      <form onSubmit={save} className="grid max-w-2xl gap-3">
        <h2 className="text-2xl font-semibold">{edit.id ? "Edit" : "New"} product</h2>
        <label className="text-sm">
          Title
          <input
            required
            className={input}
            value={edit.title}
            onChange={(e) => setEdit({ ...edit, title: e.target.value })}
          />
        </label>
        <label className="text-sm">
          Subtitle
          <input
            className={input}
            value={edit.subtitle}
            onChange={(e) => setEdit({ ...edit, subtitle: e.target.value })}
          />
        </label>
        <label className="text-sm">
          Web address name (e.g. booked-and-busy)
          <input
            required
            className={input}
            value={edit.slug}
            onChange={(e) => setEdit({ ...edit, slug: e.target.value })}
          />
        </label>
        <label className="text-sm">
          Type
          <select
            className={input}
            value={edit.type}
            onChange={(e) => setEdit({ ...edit, type: e.target.value as typeof edit.type })}
          >
            {Object.entries(formatLabel).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Who can open it
          <select
            className={input}
            value={edit.access_tier}
            onChange={(e) =>
              setEdit({ ...edit, access_tier: e.target.value as typeof edit.access_tier })
            }
          >
            <option value="free">Free for everyone</option>
            <option value="members">Included with membership (also sold on its own)</option>
            <option value="premium">Premium extra (paid by everyone, members too)</option>
          </select>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm">
            Gumroad short link (e.g. qegay)
            <input
              className={input}
              value={edit.gumroad_permalink ?? ""}
              onChange={(e) => setEdit({ ...edit, gumroad_permalink: e.target.value })}
            />
          </label>
          <label className="text-sm">
            Gumroad product ID (filled in automatically)
            <input
              className={input}
              value={edit.gumroad_product_id ?? ""}
              onChange={(e) => setEdit({ ...edit, gumroad_product_id: e.target.value })}
            />
          </label>
        </div>
        <label className="text-sm">
          Price (USD)
          <input
            type="number"
            step="0.01"
            min="0"
            className={input}
            value={edit.price_cents / 100}
            onChange={(e) =>
              setEdit({ ...edit, price_cents: Math.round(Number(e.target.value) * 100) })
            }
          />
        </label>
        <label className="text-sm">
          Cover image link
          <input
            className={input}
            value={edit.cover_image_url ?? ""}
            onChange={(e) => setEdit({ ...edit, cover_image_url: e.target.value })}
          />
        </label>
        <label className="text-sm">
          Gumroad link (buy button; download link for the free chapter)
          <input
            className={input}
            value={edit.buy_url ?? ""}
            onChange={(e) => setEdit({ ...edit, buy_url: e.target.value })}
          />
        </label>
        <label className="text-sm">
          Cover image links (one per line — first one is the main cover)
          <textarea
            rows={3}
            className={input}
            value={edit.gallery_urls.join("\n")}
            onChange={(e) =>
              setEdit({
                ...edit,
                gallery_urls: e.target.value
                  .split("\n")
                  .map((x) => x.trim())
                  .filter(Boolean),
              })
            }
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm">
            File size (e.g. 83.1 MB)
            <input
              className={input}
              value={edit.file_size_label ?? ""}
              onChange={(e) => setEdit({ ...edit, file_size_label: e.target.value })}
            />
          </label>
          <label className="text-sm">
            Length (e.g. 90 minutes)
            <input
              className={input}
              value={edit.length_label ?? ""}
              onChange={(e) => setEdit({ ...edit, length_label: e.target.value })}
            />
          </label>
        </div>
        <label className="text-sm">
          Description
          <textarea
            rows={8}
            className={input}
            value={edit.description}
            onChange={(e) => setEdit({ ...edit, description: e.target.value })}
          />
        </label>
        <label className="text-sm">
          Display order
          <input
            type="number"
            className={input}
            value={edit.position}
            onChange={(e) => setEdit({ ...edit, position: Number(e.target.value) })}
          />
        </label>
        <div className="flex flex-wrap gap-4 text-sm">
          {(["is_published", "is_featured"] as const).map((k) => (
            <label key={k} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={edit[k]}
                onChange={(e) => setEdit({ ...edit, [k]: e.target.checked })}
              />
              {{ is_published: "Show on site", is_featured: "Featured on home page" }[k]}
            </label>
          ))}
        </div>
        <div className="grid gap-3 rounded-md bg-secondary p-4 text-sm sm:grid-cols-2">
          <div>
            <div className="font-semibold">Book PDF</div>
            <div className="mt-1 text-muted-foreground">
              {edit.file_path ? `Current: ${edit.file_path.split("/").pop()}` : "No file yet"}
              {edit.preview_path ? " · preview ready" : ""}
            </div>
            <input
              type="file"
              accept="application/pdf,.epub"
              className="mt-2 max-w-full"
              onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], "file")}
            />
          </div>
          <div>
            <div className="font-semibold">Audiobook (MP3)</div>
            <div className="mt-1 text-muted-foreground">
              {edit.audio_path ? `Current: ${edit.audio_path.split("/").pop()}` : "No audio yet"}
            </div>
            <input
              type="file"
              accept="audio/*"
              className="mt-2 max-w-full"
              onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], "audio")}
            />
          </div>
          <p className="text-xs text-muted-foreground sm:col-span-2">
            Uploading a PDF also creates the free preview from its first pages (Settings → preview
            pages).
          </p>
        </div>
        <div className="flex gap-3">
          <button className="btn-gold">Save</button>
          <button
            type="button"
            onClick={() => setEdit(null)}
            className="rounded-md border border-border px-4"
          >
            Cancel
          </button>
        </div>
        {msg && <p className="text-sm">{msg}</p>}
      </form>
    );

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{data.length} products</h2>
        <button
          className="btn-gold"
          onClick={() => {
            setMsg(null);
            setEdit(blank);
          }}
        >
          Add product
        </button>
      </div>
      {msg && <p className="mt-3 text-sm">{msg}</p>}
      <div className="mt-6 divide-y divide-border rounded-md border border-border bg-card">
        {data.map((p) => (
          <div key={p.id} className="flex items-center gap-4 p-3">
            {p.cover_image_url && (
              <img src={p.cover_image_url} alt="" className="h-12 w-12 rounded object-cover" />
            )}
            <div className="flex-1">
              <div className="font-semibold">{p.title}</div>
              <div className="text-xs text-muted-foreground">
                {formatLabel[p.type]} · {money(p.price_cents)} · {tierLabel[p.access_tier]} ·{" "}
                {p.is_published ? "Live" : "Hidden"}
                {p.file_path ? " · PDF" : " · No PDF"}
                {p.audio_path ? " · Audio" : ""}
                {p.preview_path ? " · Preview" : ""}
              </div>
            </div>
            <button
              className="text-sm underline"
              onClick={() => {
                setMsg(null);
                setEdit(p);
              }}
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Access() {
  const { data: products = [] } = useProducts();
  const qc = useQueryClient();
  const [email, setEmail] = useState("");
  const [productId, setProductId] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const { data: grants = [] } = useQuery({
    queryKey: ["admin-grants"],
    queryFn: async () =>
      (
        await supabase
          .from("entitlements")
          .select("id,email,user_id,source,granted_at,revoked_at,product:products(title)")
          .order("granted_at", { ascending: false })
          .limit(200)
      ).data ?? [],
  });

  async function grant(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const clean = email.trim().toLowerCase();
    const { data: prof } = await supabase
      .from("profiles")
      .select("id")
      .ilike("email", clean)
      .maybeSingle();
    const { error } = await supabase
      .from("entitlements")
      .insert({ email: clean, user_id: prof?.id ?? null, product_id: productId, source: "admin" });
    setMsg(
      error
        ? error.code === "23505"
          ? "They already have it."
          : error.message
        : prof
          ? "Access granted."
          : "Access granted. It will appear when they sign up with this email.",
    );
    qc.invalidateQueries({ queryKey: ["admin-grants"] });
  }

  async function setRevoked(id: string, revoked: boolean) {
    await supabase
      .from("entitlements")
      .update({ revoked_at: revoked ? new Date().toISOString() : null })
      .eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-grants"] });
  }

  return (
    <div className="grid gap-10 md:grid-cols-2">
      <form onSubmit={grant} className="space-y-3">
        <h2 className="text-2xl font-semibold">Give someone a book or course</h2>
        <p className="text-sm text-muted-foreground">
          Gumroad purchases are added automatically. Use this for gifts, or when someone paid with a
          different email. No account is needed yet.
        </p>
        <input
          required
          type="email"
          placeholder="Email"
          className={input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <select
          required
          className={input}
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        >
          <option value="">Choose a product…</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
        <button className="btn-gold">Give access</button>
        {msg && <p className="text-sm">{msg}</p>}
      </form>
      <div>
        <h2 className="text-2xl font-semibold">Recent access</h2>
        <ul className="mt-4 divide-y divide-border text-sm">
          {grants.map((g) => (
            <li key={g.id} className="flex items-center justify-between gap-3 py-2">
              <span className={g.revoked_at ? "text-muted-foreground line-through" : ""}>
                {g.email ?? "—"} · {(g.product as { title: string } | null)?.title} · {g.source}
                {g.user_id ? "" : " · no account yet"}
              </span>
              <button
                className="shrink-0 underline"
                onClick={() => setRevoked(g.id, !g.revoked_at)}
              >
                {g.revoked_at ? "Restore" : "Remove"}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Courses() {
  const { data: products = [] } = useProducts();
  const courses = products.filter((p) => p.type === "course");
  const [courseId, setCourseId] = useState("");
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-course", courseId],
    enabled: !!courseId,
    queryFn: async () => {
      const { data: modules } = await supabase
        .from("modules")
        .select("*")
        .eq("course_id", courseId)
        .order("position");
      const ids = (modules ?? []).map((m) => m.id);
      const { data: lessons } = ids.length
        ? await supabase.from("lessons").select("*").in("module_id", ids).order("position")
        : { data: [] };
      return { modules: modules ?? [], lessons: lessons ?? [] };
    },
  });
  const refresh = () => qc.invalidateQueries({ queryKey: ["admin-course", courseId] });
  const [modTitle, setModTitle] = useState("");
  const [lesson, setLesson] = useState({
    module_id: "",
    title: "",
    type: "video" as "video" | "audio" | "text",
    content_url: "",
    body: "",
    duration_minutes: "",
    is_preview: false,
  });

  if (!courses.length)
    return (
      <p className="text-sm text-muted-foreground">
        No courses yet. Go to Products, add a product and set its type to "Course".
      </p>
    );
  return (
    <div className="space-y-8">
      <select
        className={input + " max-w-md"}
        value={courseId}
        onChange={(e) => setCourseId(e.target.value)}
      >
        <option value="">Choose a course…</option>
        {courses.map((c) => (
          <option key={c.id} value={c.id}>
            {c.title}
          </option>
        ))}
      </select>
      {courseId && data && (
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            {data.modules.map((m) => (
              <div key={m.id} className="mb-5 rounded-md border border-border bg-card p-4">
                <div className="flex justify-between">
                  <div className="font-semibold">{m.title}</div>
                  <button
                    className="text-xs text-crimson underline"
                    onClick={async () => {
                      await supabase.from("modules").delete().eq("id", m.id);
                      refresh();
                    }}
                  >
                    Delete
                  </button>
                </div>
                <ul className="mt-2 text-sm">
                  {data.lessons
                    .filter((l) => l.module_id === m.id)
                    .map((l) => (
                      <li key={l.id} className="flex justify-between py-1">
                        <span>
                          {l.title}{" "}
                          <span className="text-muted-foreground">
                            ({l.type}
                            {l.is_preview ? ", preview" : ""})
                          </span>
                        </span>
                        <button
                          className="text-xs text-crimson underline"
                          onClick={async () => {
                            await supabase.from("lessons").delete().eq("id", l.id);
                            refresh();
                          }}
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
            <form
              className="flex gap-2"
              onSubmit={async (e) => {
                e.preventDefault();
                await supabase
                  .from("modules")
                  .insert({ course_id: courseId, title: modTitle, position: data.modules.length });
                setModTitle("");
                refresh();
              }}
            >
              <input
                required
                placeholder="New module title"
                className={input}
                value={modTitle}
                onChange={(e) => setModTitle(e.target.value)}
              />
              <button className="btn-gold">Add</button>
            </form>
          </div>
          <form
            className="space-y-3"
            onSubmit={async (e) => {
              e.preventDefault();
              await supabase.from("lessons").insert({
                ...lesson,
                duration_minutes: lesson.duration_minutes ? Number(lesson.duration_minutes) : null,
                content_url: lesson.content_url || null,
                body: lesson.body || null,
                position: data.lessons.filter((l) => l.module_id === lesson.module_id).length,
              });
              setLesson({ ...lesson, title: "", content_url: "", body: "", duration_minutes: "" });
              refresh();
            }}
          >
            <h3 className="text-xl font-semibold">Add a lesson</h3>
            <select
              required
              className={input}
              value={lesson.module_id}
              onChange={(e) => setLesson({ ...lesson, module_id: e.target.value })}
            >
              <option value="">Module…</option>
              {data.modules.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
            <input
              required
              placeholder="Lesson title"
              className={input}
              value={lesson.title}
              onChange={(e) => setLesson({ ...lesson, title: e.target.value })}
            />
            <select
              className={input}
              value={lesson.type}
              onChange={(e) => setLesson({ ...lesson, type: e.target.value as "video" })}
            >
              <option value="video">Video</option>
              <option value="audio">Audio</option>
              <option value="text">Text</option>
            </select>
            <input
              placeholder="Video or audio link"
              className={input}
              value={lesson.content_url}
              onChange={(e) => setLesson({ ...lesson, content_url: e.target.value })}
            />
            <textarea
              rows={4}
              placeholder="Lesson notes"
              className={input}
              value={lesson.body}
              onChange={(e) => setLesson({ ...lesson, body: e.target.value })}
            />
            <input
              type="number"
              min="0"
              placeholder="Minutes"
              className={input}
              value={lesson.duration_minutes}
              onChange={(e) => setLesson({ ...lesson, duration_minutes: e.target.value })}
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={lesson.is_preview}
                onChange={(e) => setLesson({ ...lesson, is_preview: e.target.checked })}
              />
              Free preview
            </label>
            <button className="btn-gold">Add lesson</button>
          </form>
        </div>
      )}
    </div>
  );
}

function Reviews() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () =>
      (await supabase.from("testimonials").select("*").order("created_at", { ascending: false }))
        .data ?? [],
  });
  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin-reviews"] });
    qc.invalidateQueries({ queryKey: ["testimonials"] });
  };
  if (!data.length)
    return (
      <p className="text-sm text-muted-foreground">
        No reviews yet. Signed-in students can leave one from their library.
      </p>
    );
  return (
    <ul className="divide-y divide-border rounded-md border border-border bg-card">
      {data.map((t) => (
        <li key={t.id} className="flex gap-4 p-4">
          <div className="flex-1">
            <p className="italic">“{t.quote}”</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t.name}
              {t.location ? `, ${t.location}` : ""} · {t.rating}★ ·{" "}
              {t.is_published ? "Live" : "Waiting for approval"}
            </p>
          </div>
          <button
            className="text-sm underline"
            onClick={async () => {
              await supabase
                .from("testimonials")
                .update({ is_published: !t.is_published })
                .eq("id", t.id);
              refresh();
            }}
          >
            {t.is_published ? "Hide" : "Approve"}
          </button>
          <button
            className="text-sm text-crimson underline"
            onClick={async () => {
              await supabase.from("testimonials").delete().eq("id", t.id);
              refresh();
            }}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}

function Blog() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: async () =>
      (await supabase.from("blog_posts").select("*").order("created_at", { ascending: false }))
        .data ?? [],
  });
  const empty = {
    id: "",
    slug: "",
    title: "",
    excerpt: "",
    body: "",
    cover_image_url: "",
    is_published: false,
  };
  const [p, setP] = useState(empty);
  const [msg, setMsg] = useState<string | null>(null);
  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin-posts"] });
    qc.invalidateQueries({ queryKey: ["posts"] });
  };
  async function save(e: React.FormEvent) {
    e.preventDefault();
    const { id, ...rest } = p;
    const row = {
      ...rest,
      slug: (rest.slug || rest.title)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
      cover_image_url: rest.cover_image_url || null,
      published_at: rest.is_published ? new Date().toISOString() : null,
    };
    const { error } = id
      ? await supabase.from("blog_posts").update(row).eq("id", id)
      : await supabase.from("blog_posts").insert(row);
    setMsg(error ? error.message : "Saved.");
    if (!error) {
      setP(empty);
      refresh();
    }
  }
  return (
    <div className="grid gap-10 md:grid-cols-2">
      <form onSubmit={save} className="space-y-3">
        <h2 className="text-2xl font-semibold">{p.id ? "Edit post" : "New post"}</h2>
        <input
          required
          placeholder="Title"
          className={input}
          value={p.title}
          onChange={(e) => setP({ ...p, title: e.target.value })}
        />
        <input
          placeholder="Short summary"
          className={input}
          value={p.excerpt}
          onChange={(e) => setP({ ...p, excerpt: e.target.value })}
        />
        <input
          placeholder="Cover image link (optional)"
          className={input}
          value={p.cover_image_url ?? ""}
          onChange={(e) => setP({ ...p, cover_image_url: e.target.value })}
        />
        <textarea
          required
          rows={12}
          placeholder="Write your article…"
          className={input}
          value={p.body}
          onChange={(e) => setP({ ...p, body: e.target.value })}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={p.is_published}
            onChange={(e) => setP({ ...p, is_published: e.target.checked })}
          />
          Published
        </label>
        <div className="flex gap-3">
          <button className="btn-gold">Save</button>
          {p.id && (
            <button
              type="button"
              className="rounded-md border border-border px-4"
              onClick={() => setP(empty)}
            >
              Cancel
            </button>
          )}
        </div>
        {msg && <p className="text-sm">{msg}</p>}
      </form>
      <ul className="divide-y divide-border">
        {data.map((x) => (
          <li key={x.id} className="flex justify-between gap-3 py-3 text-sm">
            <span>
              {x.title}{" "}
              <span className="text-muted-foreground">· {x.is_published ? "Live" : "Draft"}</span>
            </span>
            <span className="flex gap-3">
              <button
                className="underline"
                onClick={() =>
                  setP({
                    id: x.id,
                    slug: x.slug,
                    title: x.title,
                    excerpt: x.excerpt,
                    body: x.body,
                    cover_image_url: x.cover_image_url ?? "",
                    is_published: x.is_published,
                  })
                }
              >
                Edit
              </button>
              <button
                className="text-crimson underline"
                onClick={async () => {
                  await supabase.from("blog_posts").delete().eq("id", x.id);
                  refresh();
                }}
              >
                Delete
              </button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Kit connection: check the key, look an email up on Kit, or send one email to Kit now.
function KitCheck() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [lines, setLines] = useState<string[]>([]);

  async function run(fn: () => Promise<string[]>) {
    setBusy(true);
    try {
      setLines(await fn());
    } catch (e) {
      setLines([`Error: ${e instanceof Error ? e.message : String(e)}`]);
    }
    setBusy(false);
  }

  const check = () =>
    run(async () => {
      const r = await checkKit({ data: { email } });
      if (!r.configured) return ["✗ KIT_API_KEY is not set on the server (Vercel)."];
      if (r.error) return [`✗ Kit refused the key: ${r.error}`];
      const out = [`✓ Connected to Kit account “${r.account ?? ""}”.`];
      if (r.email)
        out.push(
          r.subscriber
            ? `${r.email} is on Kit, state: ${r.subscriber.state} (added ${new Date(r.subscriber.created_at).toLocaleString()}).`
            : `${r.email} is not on Kit.`,
        );
      return out;
    });
  const send = () => run(async () => [`Kit: ${(await sendToKit({ data: { email } })).result}`]);

  return (
    <div className="rounded-md border border-border bg-card p-5 text-sm">
      <h2 className="text-2xl font-semibold">Kit</h2>
      <p className="mt-2 text-muted-foreground">
        Sign-ups are sent to Kit as they come in. Check the connection, or look up an email.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          className={input}
          type="email"
          placeholder="Email to look up (optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="btn-gold" disabled={busy} onClick={check}>
          {busy ? "Checking…" : "Check Kit"}
        </button>
        <button className="btn-ghost" disabled={busy || !email} onClick={send}>
          Send to Kit now
        </button>
      </div>
      {lines.length > 0 && (
        <ul className="mt-4 space-y-1">
          {lines.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Leads() {
  const { data = [] } = useQuery({
    queryKey: ["admin-leads"],
    queryFn: async () =>
      (await supabase.from("leads").select("*").order("created_at", { ascending: false })).data ??
      [],
  });
  function exportCsv() {
    const csv =
      "email,source,date\n" + data.map((l) => `${l.email},${l.source},${l.created_at}`).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "gswau-email-list.csv";
    a.click();
  }
  return (
    <div>
      <KitCheck />
      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{data.length} sign-ups</h2>
        {data.length > 0 && (
          <button className="btn-gold" onClick={exportCsv}>
            Download list
          </button>
        )}
      </div>
      <ul className="mt-6 divide-y divide-border text-sm">
        {data.map((l) => (
          <li key={l.id} className="flex justify-between py-2">
            <span>{l.email}</span>
            <span className="text-muted-foreground">
              {new Date(l.created_at).toLocaleDateString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Members() {
  const qc = useQueryClient();
  const [email, setEmail] = useState("");
  const [until, setUntil] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const { data = [] } = useQuery({
    queryKey: ["admin-members"],
    queryFn: async () =>
      (
        await supabase
          .from("memberships")
          .select("id,email,user_id,plan,status,source,current_period_end,updated_at")
          .order("updated_at", { ascending: false })
      ).data ?? [],
  });
  const active = data.filter((m) => m.status !== "ended").length;

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const clean = email.trim().toLowerCase();
    const { data: prof } = await supabase
      .from("profiles")
      .select("id")
      .ilike("email", clean)
      .maybeSingle();
    const { error } = await supabase.from("memberships").insert({
      email: clean,
      user_id: prof?.id ?? null,
      plan: "manual",
      source: "admin",
      status: "active",
      current_period_end: until ? new Date(until).toISOString() : null,
    });
    setMsg(
      error
        ? error.code === "23505"
          ? "They already have a complimentary membership."
          : error.message
        : "Member added.",
    );
    setEmail("");
    qc.invalidateQueries({ queryKey: ["admin-members"] });
  }

  async function setStatus(id: string, status: "active" | "ended") {
    await supabase
      .from("memberships")
      .update({ status, ended_at: status === "ended" ? new Date().toISOString() : null })
      .eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-members"] });
  }

  return (
    <div className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
      <form onSubmit={add} className="space-y-3">
        <h2 className="text-2xl font-semibold">Add a complimentary member</h2>
        <p className="text-sm text-muted-foreground">
          Paying members are added automatically from Gumroad. Use this for gifts and partners.
        </p>
        <input
          required
          type="email"
          placeholder="Email"
          className={input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className="block text-sm">
          Until (leave empty for no end date)
          <input
            type="date"
            className={input}
            value={until}
            onChange={(e) => setUntil(e.target.value)}
          />
        </label>
        <button className="btn-gold">Add member</button>
        {msg && <p className="text-sm">{msg}</p>}
      </form>
      <div>
        <h2 className="text-2xl font-semibold">
          {active} active · {data.length} total
        </h2>
        <ul className="mt-4 divide-y divide-border text-sm">
          {data.map((m) => (
            <li key={m.id} className="flex items-center justify-between gap-3 py-2">
              <span>
                {m.email} · {m.plan} · <strong>{m.status}</strong> · {m.source}
                {m.current_period_end
                  ? ` · until ${new Date(m.current_period_end).toLocaleDateString()}`
                  : ""}
                {m.user_id ? "" : " · no account yet"}
              </span>
              {m.source === "admin" && (
                <button
                  className="shrink-0 underline"
                  onClick={() => setStatus(m.id, m.status === "ended" ? "active" : "ended")}
                >
                  {m.status === "ended" ? "Reactivate" : "End"}
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function GumroadAdmin() {
  const qc = useQueryClient();
  const [busy, setBusy] = useState<string | null>(null);
  const [result, setResult] = useState<Record<string, string | number> | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const { data: status } = useQuery({
    queryKey: ["gumroad-status"],
    queryFn: () => gumroadSetupStatus(),
  });
  const { data: events = [] } = useQuery({
    queryKey: ["gumroad-events"],
    queryFn: async () =>
      (
        await supabase
          .from("gumroad_events")
          .select("id,resource,email,permalink,outcome,error,is_test,received_at")
          .order("received_at", { ascending: false })
          .limit(50)
      ).data ?? [],
  });

  async function run(name: string, fn: () => Promise<Record<string, string | number>>) {
    setBusy(name);
    setErr(null);
    setResult(null);
    try {
      setResult(await fn());
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    }
    setBusy(null);
    qc.invalidateQueries({ queryKey: ["gumroad-events"] });
  }

  const ready = status?.accessToken && status.webhookSecret && status.serviceRole;
  return (
    <div className="space-y-8">
      <div className="rounded-md border border-border bg-card p-5 text-sm">
        <h2 className="text-2xl font-semibold">Server setup</h2>
        <ul className="mt-3 space-y-1">
          <li>{status?.accessToken ? "✓" : "✗"} GUMROAD_ACCESS_TOKEN</li>
          <li>{status?.webhookSecret ? "✓" : "✗"} GUMROAD_WEBHOOK_SECRET</li>
          <li>{status?.serviceRole ? "✓" : "✗"} SUPABASE_SERVICE_ROLE_KEY</li>
        </ul>
        {!ready && (
          <p className="mt-3 text-muted-foreground">
            These are set on the hosting server (never in the code). The buttons below need all
            three.
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            className="btn-gold"
            disabled={!ready || !!busy}
            onClick={() => run("connect", () => connectGumroad())}
          >
            {busy === "connect" ? "Connecting…" : "Connect Gumroad notifications"}
          </button>
          <button
            className="btn-ghost"
            disabled={!ready || !!busy}
            onClick={() => run("import", () => importGumroadBuyers())}
          >
            {busy === "import" ? "Importing…" : "Import past buyers"}
          </button>
        </div>
        {result && (
          <ul className="mt-4 space-y-1">
            {Object.entries(result).map(([k, v]) => (
              <li key={k}>
                {k}: {v}
              </li>
            ))}
          </ul>
        )}
        {err && <p className="mt-3 text-crimson">{err}</p>}
      </div>
      <div>
        <h2 className="text-2xl font-semibold">Recent Gumroad notifications</h2>
        <ul className="mt-4 divide-y divide-border text-sm">
          {events.length === 0 && <li className="py-2 text-muted-foreground">None yet.</li>}
          {events.map((e) => (
            <li key={e.id} className="py-2">
              {new Date(e.received_at).toLocaleString()} · {e.resource}
              {e.is_test ? " (test)" : ""} · {e.email ?? "—"} · {e.permalink ?? ""} ·{" "}
              <strong className={e.error ? "text-crimson" : ""}>{e.outcome ?? "processing"}</strong>
              {e.error ? ` — ${e.error}` : ""}
              {!e.is_test && (e.error || /\bno\b|^ignored|^failed/.test(e.outcome ?? "")) && (
                <button
                  className="ml-3 underline disabled:opacity-50"
                  disabled={!ready || !!busy}
                  onClick={() =>
                    run(`replay-${e.id}`, () => replayGumroadNotification({ data: { id: e.id } }))
                  }
                >
                  {busy === `replay-${e.id}` ? "Replaying…" : "Replay"}
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const settingFields = [
  { key: "membership_monthly_url", label: "Monthly membership checkout link (Gumroad)" },
  { key: "membership_annual_url", label: "Annual membership checkout link (Gumroad)" },
  {
    key: "membership_permalinks",
    label:
      "Membership product on Gumroad: short link(s) or product ID(s), comma-separated (e.g. membership). The product ID is added automatically after the first sale.",
  },
  { key: "preview_pages", label: "Free preview length (pages)" },
  {
    key: "kit_form_id",
    label:
      "Kit form ID (optional): newsletter sign-ups are also added to this Kit form. The number in the form's address on Kit.",
  },
] as const;

function SettingsAdmin() {
  const qc = useQueryClient();
  const [values, setValues] = useState<Record<string, string> | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const { data } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const rows = (await supabase.from("site_settings").select("key,value")).data ?? [];
      return Object.fromEntries(rows.map((r) => [r.key, r.value]));
    },
  });
  const v = values ?? data ?? {};

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const rows = settingFields.map((f) => ({ key: f.key, value: (v[f.key] ?? "").trim() }));
    const { error } = await supabase.from("site_settings").upsert(rows);
    setMsg(error ? error.message : "Saved.");
    qc.invalidateQueries({ queryKey: ["admin-settings"] });
    qc.invalidateQueries({ queryKey: ["settings"] });
  }

  return (
    <form onSubmit={save} className="grid max-w-2xl gap-4">
      <h2 className="text-2xl font-semibold">Settings</h2>
      {settingFields.map((f) => (
        <label key={f.key} className="text-sm">
          {f.label}
          <input
            className={input}
            value={v[f.key] ?? ""}
            onChange={(e) => setValues({ ...v, [f.key]: e.target.value })}
          />
        </label>
      ))}
      <button className="btn-gold w-fit">Save settings</button>
      {msg && <p className="text-sm">{msg}</p>}
    </form>
  );
}

function AnalyticsAdmin() {
  const { data = [] } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const since = new Date(Date.now() - 30 * 864e5).toISOString();
      const rows =
        (
          await supabase
            .from("analytics_events")
            .select("name")
            .gte("created_at", since)
            .limit(10000)
        ).data ?? [];
      const counts = new Map<string, number>();
      rows.forEach((r) => counts.set(r.name, (counts.get(r.name) ?? 0) + 1));
      return [...counts.entries()].sort((a, b) => b[1] - a[1]);
    },
  });
  return (
    <div>
      <h2 className="text-2xl font-semibold">Last 30 days</h2>
      {data.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No events yet.</p>
      ) : (
        <table className="mt-4 text-sm">
          <tbody>
            {data.map(([name, n]) => (
              <tr key={name} className="border-b border-border">
                <td className="py-2 pr-10">{name.replace(/_/g, " ")}</td>
                <td className="py-2 text-right font-semibold">{n}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function PodcastAdmin() {
  const qc = useQueryClient();
  const empty = {
    id: "",
    slug: "",
    title: "",
    description: "",
    audio_url: "",
    cover_image_url: "",
    duration_label: "",
    is_published: false,
  };
  const [p, setP] = useState(empty);
  const [msg, setMsg] = useState<string | null>(null);
  const { data = [] } = useQuery({
    queryKey: ["admin-episodes"],
    queryFn: async () =>
      (
        await supabase
          .from("podcast_episodes")
          .select("*")
          .order("created_at", { ascending: false })
      ).data ?? [],
  });

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const { id, ...rest } = p;
    const row = {
      ...rest,
      slug: rest.slug
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, "-"),
      cover_image_url: rest.cover_image_url || null,
      duration_label: rest.duration_label || null,
      published_at: rest.is_published ? new Date().toISOString() : null,
    };
    const { error } = id
      ? await supabase.from("podcast_episodes").update(row).eq("id", id)
      : await supabase.from("podcast_episodes").insert(row);
    setMsg(error ? error.message : "Saved.");
    if (!error) {
      setP(empty);
      qc.invalidateQueries({ queryKey: ["admin-episodes"] });
      qc.invalidateQueries({ queryKey: ["episodes"] });
    }
  }

  return (
    <div className="grid gap-10 md:grid-cols-2">
      <form onSubmit={save} className="space-y-3">
        <h2 className="text-2xl font-semibold">{p.id ? "Edit episode" : "New episode"}</h2>
        <input
          required
          placeholder="Episode title"
          className={input}
          value={p.title}
          onChange={(e) => setP({ ...p, title: e.target.value })}
        />
        <input
          required
          placeholder="Web address name (e.g. episode-1)"
          className={input}
          value={p.slug}
          onChange={(e) => setP({ ...p, slug: e.target.value })}
        />
        <input
          required
          placeholder="Spotify episode link, or an audio file link (MP3)"
          className={input}
          value={p.audio_url}
          onChange={(e) => setP({ ...p, audio_url: e.target.value })}
        />
        <input
          placeholder="Cover image link (optional)"
          className={input}
          value={p.cover_image_url}
          onChange={(e) => setP({ ...p, cover_image_url: e.target.value })}
        />
        <input
          placeholder="Length (e.g. 32 min)"
          className={input}
          value={p.duration_label}
          onChange={(e) => setP({ ...p, duration_label: e.target.value })}
        />
        <textarea
          rows={5}
          placeholder="Description"
          className={input}
          value={p.description}
          onChange={(e) => setP({ ...p, description: e.target.value })}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={p.is_published}
            onChange={(e) => setP({ ...p, is_published: e.target.checked })}
          />
          Published
        </label>
        <button className="btn-gold">Save episode</button>
        {msg && <p className="text-sm">{msg}</p>}
      </form>
      <div>
        <h2 className="text-2xl font-semibold">{data.length} episodes</h2>
        <ul className="mt-4 divide-y divide-border text-sm">
          {data.map((x) => (
            <li key={x.id} className="flex items-center justify-between py-2">
              <span>
                {x.title} {x.is_published ? "" : "(draft)"}
              </span>
              <span className="flex gap-3">
                <button
                  className="underline"
                  onClick={() =>
                    setP({
                      id: x.id,
                      slug: x.slug,
                      title: x.title,
                      description: x.description,
                      audio_url: x.audio_url,
                      cover_image_url: x.cover_image_url ?? "",
                      duration_label: x.duration_label ?? "",
                      is_published: x.is_published,
                    })
                  }
                >
                  Edit
                </button>
                <button
                  className="underline"
                  onClick={async () => {
                    await supabase.from("podcast_episodes").delete().eq("id", x.id);
                    qc.invalidateQueries({ queryKey: ["admin-episodes"] });
                    qc.invalidateQueries({ queryKey: ["episodes"] });
                  }}
                >
                  Delete
                </button>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
