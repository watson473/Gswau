import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/learn/$slug")({
  head: () => ({
    meta: [
      { title: "Course — GSWAU" },
      { name: "description", content: "Your GSWAU course." },
      { property: "og:title", content: "Course — GSWAU" },
      { property: "og:description", content: "Your GSWAU course." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Learn,
});

function Learn() {
  const { slug } = Route.useParams();
  const qc = useQueryClient();
  const [current, setCurrent] = useState<string | null>(null);
  const { data, isLoading } = useQuery({
    queryKey: ["learn", slug],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      const { data: course } = await supabase
        .from("products")
        .select("id,title,buy_url")
        .eq("slug", slug)
        .maybeSingle();
      if (!course) return null;
      const [{ data: access }, { data: modules }, { data: lessons }, { data: progress }] =
        await Promise.all([
          supabase.rpc("has_access", { _product: course.id }),
          supabase
            .from("modules")
            .select("id,title,position")
            .eq("course_id", course.id)
            .order("position"),
          supabase
            .from("lessons")
            .select(
              "id,module_id,title,type,content_url,body,duration_minutes,position,modules!inner(course_id)",
            )
            .eq("modules.course_id", course.id)
            .order("position"),
          supabase.from("lesson_progress").select("lesson_id").eq("user_id", u.user!.id),
        ]);
      return {
        course,
        access: !!access,
        modules: modules ?? [],
        lessons: lessons ?? [],
        done: new Set((progress ?? []).map((p) => p.lesson_id)),
        uid: u.user!.id,
      };
    },
  });

  if (isLoading)
    return <p className="mx-auto max-w-6xl px-5 py-16 text-muted-foreground">Loading…</p>;
  if (!data) return <p className="mx-auto max-w-6xl px-5 py-16">Course not found.</p>;
  const { course, access, modules, lessons, done, uid } = data;
  const lesson = lessons.find((l) => l.id === current) ?? lessons[0];
  const pct = lessons.length
    ? Math.round((lessons.filter((l) => done.has(l.id)).length / lessons.length) * 100)
    : 0;

  async function toggle(id: string) {
    if (done.has(id))
      await supabase.from("lesson_progress").delete().eq("lesson_id", id).eq("user_id", uid);
    else await supabase.from("lesson_progress").insert({ lesson_id: id, user_id: uid });
    qc.invalidateQueries({ queryKey: ["learn", slug] });
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-[1fr_300px]">
      <div>
        <Link to="/library/$slug" params={{ slug }} className="text-sm underline">
          ← {course.title}
        </Link>
        {!lesson ? (
          <p className="mt-8 text-muted-foreground">Lessons are being added — check back soon.</p>
        ) : (
          <div className="mt-6">
            <h1 className="text-4xl font-semibold">{lesson.title}</h1>
            <div className="mt-6">
              {lesson.type === "video" && lesson.content_url && (
                <video
                  key={lesson.id}
                  src={lesson.content_url}
                  controls
                  className="aspect-video w-full rounded-md bg-navy-deep"
                />
              )}
              {lesson.type === "audio" && lesson.content_url && (
                <audio key={lesson.id} src={lesson.content_url} controls className="w-full" />
              )}
              {lesson.body && (
                <div className="mt-6 whitespace-pre-line leading-relaxed">{lesson.body}</div>
              )}
            </div>
            <button onClick={() => toggle(lesson.id)} className="btn-gold mt-8">
              {done.has(lesson.id) ? "Mark as not done" : "Mark complete"}
            </button>
          </div>
        )}
        {!access && (
          <div className="mt-8 rounded-md bg-secondary p-6">
            <p className="font-semibold">You're viewing the free preview lessons.</p>
            {course.buy_url && (
              <a
                href={course.buy_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold mt-4"
              >
                Buy the full course
              </a>
            )}
          </div>
        )}
      </div>
      <aside className="rounded-md border border-border bg-card p-5">
        <div className="eyebrow text-muted-foreground">Progress · {pct}%</div>
        <div className="mt-2 h-2 rounded-full bg-secondary">
          <div className="h-2 rounded-full bg-gold" style={{ width: `${pct}%` }} />
        </div>
        {modules.map((m) => (
          <div key={m.id} className="mt-5">
            <div className="font-display text-lg font-semibold">{m.title}</div>
            <ul className="mt-2 space-y-1 text-sm">
              {lessons
                .filter((l) => l.module_id === m.id)
                .map((l) => (
                  <li key={l.id}>
                    <button
                      onClick={() => setCurrent(l.id)}
                      className={`text-left ${lesson?.id === l.id ? "font-semibold text-primary" : ""}`}
                    >
                      {done.has(l.id) ? "✓ " : "○ "}
                      {l.title}
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </aside>
    </div>
  );
}
