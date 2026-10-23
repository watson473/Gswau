import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatLabel, money } from "@/lib/catalog";

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
  "Subscribers",
  "Access",
  "Courses",
  "Reviews",
  "Podcast",
  "Blog",
  "Email list",
] as const;
type Tab = (typeof tabs)[number];
const input = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm";

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
        {tab === "Subscribers" && <Subscribers />}
        {tab === "Access" && <Access />}
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
    const { id, created_at, updated_at, ...rest } = edit;
    const row = {
      ...rest,
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

  async function upload(file: File) {
    if (!edit?.id) return setMsg("Save the product first, then upload its file.");
    const path = `${edit.id}/${file.name.replace(/[^\w.-]+/g, "_")}`;
    const { error } = await supabase.storage
      .from("product-files")
      .upload(path, file, { upsert: true });
    if (error) return setMsg(error.message);
    await supabase.from("products").update({ file_path: path }).eq("id", edit.id);
    setEdit({ ...edit, file_path: path });
    setMsg("File uploaded.");
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
    is_lead_magnet: false,
    is_published: true,
    is_featured: false,
    buy_url: "",
    file_path: null,
    file_size_label: "",
    length_label: "",
    gallery_urls: [] as string[],
    included_with_subscription: false,
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
          Free download link (free items only)
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
          {(["is_published", "is_featured", "is_free", "included_with_subscription"] as const).map(
            (k) => (
              <label key={k} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={edit[k]}
                  onChange={(e) => setEdit({ ...edit, [k]: e.target.checked })}
                />
                {
                  {
                    is_published: "Show on site",
                    is_featured: "Flagship",
                    is_free: "Free",
                    included_with_subscription: "Included with subscription",
                  }[k]
                }
              </label>
            ),
          )}
        </div>
        <div className="rounded-md bg-secondary p-4 text-sm">
          <div className="font-semibold">Download file (PDF, ePub, MP3…)</div>
          <div className="mt-1 text-muted-foreground">
            {edit.file_path ? `Current: ${edit.file_path.split("/").pop()}` : "No file yet"}
          </div>
          <input
            type="file"
            className="mt-2"
            onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
          />
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
                {formatLabel[p.type]} · {money(p.price_cents)} ·{" "}
                {p.is_published ? "Live" : "Hidden"}
                {p.file_path ? " · File ready" : " · No file"}
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
    queryFn: async () => {
      const { data } = await supabase
        .from("entitlements")
        .select("id,user_id,granted_at,product:products(title)")
        .order("granted_at", { ascending: false })
        .limit(100);
      const ids = [...new Set((data ?? []).map((g) => g.user_id))];
      const { data: profs } = ids.length
        ? await supabase.from("profiles").select("id,email").in("id", ids)
        : { data: [] };
      const map = new Map((profs ?? []).map((p) => [p.id, p.email]));
      return (data ?? []).map((g) => ({ ...g, email: map.get(g.user_id) }));
    },
  });

  async function grant(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const { data: prof } = await supabase
      .from("profiles")
      .select("id")
      .ilike("email", email.trim())
      .maybeSingle();
    if (!prof)
      return setMsg(
        "No account with that email yet. Ask the buyer to create an account first, using the email they paid with.",
      );
    const { error } = await supabase
      .from("entitlements")
      .insert({ user_id: prof.id, product_id: productId });
    setMsg(
      error
        ? error.code === "23505"
          ? "They already have it."
          : error.message
        : "Access granted.",
    );
    qc.invalidateQueries({ queryKey: ["admin-grants"] });
  }

  return (
    <div className="grid gap-10 md:grid-cols-2">
      <form onSubmit={grant} className="space-y-3">
        <h2 className="text-2xl font-semibold">Give a buyer access</h2>
        <p className="text-sm text-muted-foreground">
          Enter someone's email to unlock a single book, course or bundle in their account.
        </p>
        <input
          required
          type="email"
          placeholder="buyer@email.com"
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
          {products
            .filter((p) => !p.is_free)
            .map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
        </select>
        <button className="btn-gold">Grant access</button>
        {msg && <p className="text-sm">{msg}</p>}
      </form>
      <div>
        <h2 className="text-2xl font-semibold">Recent access</h2>
        <ul className="mt-4 divide-y divide-border text-sm">
          {grants.map((g) => (
            <li key={g.id} className="flex justify-between gap-3 py-2">
              <span>
                {g.email ?? "—"} · {(g.product as { title: string } | null)?.title}
              </span>
              <button
                className="text-crimson underline"
                onClick={async () => {
                  await supabase.from("entitlements").delete().eq("id", g.id);
                  qc.invalidateQueries({ queryKey: ["admin-grants"] });
                }}
              >
                Remove
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
      <div className="flex items-center justify-between">
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

function Subscribers() {
  const qc = useQueryClient();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const { data = [] } = useQuery({
    queryKey: ["admin-subscribers"],
    queryFn: async () => {
      const { data: subs } = await supabase
        .from("subscriptions")
        .select("user_id,status,started_at,current_period_end")
        .order("started_at", { ascending: false });
      const ids = (subs ?? []).map((x) => x.user_id);
      const { data: profs } = ids.length
        ? await supabase.from("profiles").select("id,email").in("id", ids)
        : { data: [] };
      const map = new Map((profs ?? []).map((p) => [p.id, p.email]));
      return (subs ?? []).map((x) => ({ ...x, email: map.get(x.user_id) }));
    },
  });

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const { data: prof } = await supabase
      .from("profiles")
      .select("id")
      .ilike("email", email.trim())
      .maybeSingle();
    if (!prof) return setMsg("No account with that email yet. They need to sign up first.");
    const { error } = await supabase
      .from("subscriptions")
      .upsert({ user_id: prof.id, status: "active", current_period_end: null });
    setMsg(error ? error.message : "Subscriber added.");
    setEmail("");
    qc.invalidateQueries({ queryKey: ["admin-subscribers"] });
  }

  async function setStatus(user_id: string, status: "active" | "canceled") {
    await supabase.from("subscriptions").update({ status }).eq("user_id", user_id);
    qc.invalidateQueries({ queryKey: ["admin-subscribers"] });
  }

  return (
    <div className="grid gap-10 md:grid-cols-2">
      <form onSubmit={add} className="space-y-3">
        <h2 className="text-2xl font-semibold">Add a subscriber</h2>
        <p className="text-sm text-muted-foreground">
          Subscribers can read every product marked "Included with subscription". They need an
          account first.
        </p>
        <input
          required
          type="email"
          placeholder="Subscriber email"
          className={input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="btn-gold">Add subscriber</button>
        {msg && <p className="text-sm">{msg}</p>}
      </form>
      <div>
        <h2 className="text-2xl font-semibold">{data.length} subscribers</h2>
        <ul className="mt-4 divide-y divide-border text-sm">
          {data.map((x) => (
            <li key={x.user_id} className="flex items-center justify-between py-2">
              <span>
                {x.email ?? "—"} · {x.status}
              </span>
              <button
                className="underline"
                onClick={() => setStatus(x.user_id, x.status === "active" ? "canceled" : "active")}
              >
                {x.status === "active" ? "Cancel" : "Reactivate"}
              </button>
            </li>
          ))}
        </ul>
      </div>
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
          placeholder="Audio file link (MP3)"
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
