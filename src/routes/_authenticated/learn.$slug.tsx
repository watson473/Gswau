import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getCertificate, getCourseFiles, getLessonFiles } from "@/lib/course.functions";

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

// Signed links last an hour; ask for fresh ones a little before that.
const LINK_STALE = 50 * 60 * 1000;

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
        .select("id,title")
        .eq("slug", slug)
        .maybeSingle();
      if (!course) return null;
      const [{ data: access }, { data: modules }, { data: outline }, { data: progress }] =
        await Promise.all([
          supabase.rpc("has_access", { _product: course.id }),
          supabase
            .from("modules")
            .select("id,title,position")
            .eq("course_id", course.id)
            .order("position"),
          supabase.rpc("course_outline", { _course: course.id }),
          supabase.from("lesson_progress").select("lesson_id").eq("user_id", u.user!.id),
        ]);
      // Row-level security only returns lessons this visitor may watch.
      const { data: lessons } = await supabase
        .from("lessons")
        .select("id,module_id,title,body,position,modules!inner(course_id)")
        .eq("modules.course_id", course.id)
        .order("position");
      return {
        course,
        access: !!access,
        modules: modules ?? [],
        outline: outline ?? [],
        lessons: lessons ?? [],
        done: new Set((progress ?? []).map((p) => p.lesson_id)),
        uid: u.user!.id,
      };
    },
  });
  const courseId = data?.course.id;
  const { data: courseFiles } = useQuery({
    queryKey: ["course-files", courseId],
    enabled: !!courseId && !!data?.access,
    staleTime: LINK_STALE,
    queryFn: () => getCourseFiles({ data: { productId: courseId! } }),
  });

  const lessons = data?.lessons ?? [];
  const done = data?.done ?? new Set<string>();
  const lesson =
    lessons.find((l) => l.id === current) ?? lessons.find((l) => !done.has(l.id)) ?? lessons[0];
  const { data: files, refetch: refetchFiles } = useQuery({
    queryKey: ["lesson-files", lesson?.id],
    enabled: !!lesson,
    staleTime: LINK_STALE,
    queryFn: () => getLessonFiles({ data: { lessonId: lesson!.id } }),
  });

  if (isLoading)
    return <p className="mx-auto max-w-6xl px-5 py-16 text-muted-foreground">Loading…</p>;
  if (!data) return <p className="mx-auto max-w-6xl px-5 py-16">Course not found.</p>;
  const { course, access, modules, outline, uid } = data;
  const finished = lessons.filter((l) => done.has(l.id)).length;
  const pct = lessons.length ? Math.round((finished / lessons.length) * 100) : 0;
  const next = lesson && lessons[lessons.findIndex((l) => l.id === lesson.id) + 1];
  const moduleFiles = lesson && courseFiles?.modules[lesson.module_id];
  const bookSlug = slug.replace(/-course$/, "");

  const refresh = () => qc.invalidateQueries({ queryKey: ["learn", slug] });
  async function setDone(id: string, value: boolean) {
    if (!value)
      await supabase.from("lesson_progress").delete().eq("lesson_id", id).eq("user_id", uid);
    else
      await supabase
        .from("lesson_progress")
        .upsert({ lesson_id: id, user_id: uid }, { ignoreDuplicates: true });
    await refresh();
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-[1fr_300px]">
      <div className="min-w-0">
        <Link to="/library/$slug" params={{ slug }} className="text-sm underline">
          ← {course.title}
        </Link>
        {!access ? (
          <div className="mt-8 rounded-md bg-secondary p-6">
            <h1 className="text-3xl font-semibold">{course.title} is included with membership</h1>
            <p className="mt-3 text-muted-foreground">
              Join to watch every lesson and get the worksheets, quizzes and certificate.
            </p>
            <Link to="/pricing" className="btn-gold mt-5">
              See membership
            </Link>
          </div>
        ) : !lesson ? (
          <p className="mt-8 text-muted-foreground">Lessons are being added — check back soon.</p>
        ) : (
          <div className="mt-6">
            <h1 className="text-4xl font-semibold">{lesson.title}</h1>
            <div className="mt-6">
              {files ? (
                <video
                  key={lesson.id}
                  src={files.video}
                  controls
                  controlsList="nodownload"
                  playsInline
                  crossOrigin="anonymous"
                  onEnded={() => !done.has(lesson.id) && setDone(lesson.id, true)}
                  onError={() => refetchFiles()}
                  className="aspect-video w-full rounded-md bg-navy-deep"
                >
                  <track kind="captions" src={files.captions} srcLang="en" label="English" />
                </video>
              ) : (
                <div className="aspect-video w-full rounded-md bg-navy-deep" />
              )}
              {lesson.body && (
                <div className="mt-6 rounded-md border border-gold/50 bg-card p-5">
                  <div className="eyebrow text-muted-foreground">Your action step</div>
                  <p className="mt-2 text-lg leading-relaxed">{lesson.body}</p>
                  {files && (
                    <a
                      href={files.action}
                      target="_blank"
                      rel="noopener"
                      className="mt-3 inline-block text-sm underline"
                    >
                      Open the action step sheet
                    </a>
                  )}
                </div>
              )}
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={async () => {
                  const nowDone = !done.has(lesson.id);
                  await setDone(lesson.id, nowDone);
                  if (nowDone && next) setCurrent(next.id);
                }}
                className="btn-gold"
              >
                {done.has(lesson.id) ? "Mark as not done" : next ? "Complete and next" : "Complete"}
              </button>
              {files && (
                <a href={files.script} target="_blank" rel="noopener" className="btn-ghost">
                  Read the script
                </a>
              )}
            </div>
            {moduleFiles && (
              <div className="mt-8 rounded-md border border-border bg-card p-5">
                <div className="eyebrow text-muted-foreground">This module</div>
                <div className="mt-3 flex flex-wrap gap-3">
                  <a
                    href={moduleFiles.worksheet}
                    target="_blank"
                    rel="noopener"
                    className="btn-ghost"
                  >
                    Worksheet
                  </a>
                  <a href={moduleFiles.quiz} target="_blank" rel="noopener" className="btn-ghost">
                    Module quiz
                  </a>
                </div>
              </div>
            )}
            {pct === 100 && <Certificate productId={course.id} title={course.title} />}
          </div>
        )}
      </div>
      <aside className="rounded-md border border-border bg-card p-5 md:self-start">
        {access && (
          <>
            <div className="eyebrow text-muted-foreground">
              Progress · {finished} of {lessons.length} · {pct}%
            </div>
            <div className="mt-2 h-2 rounded-full bg-secondary">
              <div className="h-2 rounded-full bg-gold" style={{ width: `${pct}%` }} />
            </div>
          </>
        )}
        {modules.map((m, i) => (
          <div key={m.id} className="mt-5 first:mt-0 [&:not(:first-child)]:mt-5">
            <div className="eyebrow text-muted-foreground">Module {i + 1}</div>
            <div className="font-display text-lg font-semibold">{m.title}</div>
            <ul className="mt-2 space-y-1 text-sm">
              {outline
                .filter((l) => l.module_id === m.id)
                .map((l) => (
                  <li key={l.lesson_id}>
                    {access ? (
                      <button
                        onClick={() => setCurrent(l.lesson_id)}
                        className={`text-left ${lesson?.id === l.lesson_id ? "font-semibold text-primary" : ""}`}
                      >
                        {done.has(l.lesson_id) ? "✓ " : "○ "}
                        {l.title}
                      </button>
                    ) : (
                      <span className="text-muted-foreground">{l.title}</span>
                    )}
                  </li>
                ))}
            </ul>
          </div>
        ))}
        {access && (
          <div className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
            {courseFiles && (
              <a
                href={courseFiles.finalQuiz}
                target="_blank"
                rel="noopener"
                className="block underline"
              >
                Final quiz
              </a>
            )}
            <Link
              to="/library/$slug"
              params={{ slug: bookSlug }}
              search={{ read: 1 }}
              className="block underline"
            >
              Bonus: read the full book
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}

// The certificate artwork with the student's name and the date written onto it, as a PNG.
function Certificate({ productId, title }: { productId: string; title: string }) {
  const { data } = useQuery({
    queryKey: ["certificate", productId],
    staleTime: LINK_STALE,
    queryFn: () => getCertificate({ data: { productId } }),
  });
  const [typed, setTyped] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  if (!data) return null;
  const name = typed ?? data.name;

  async function download() {
    setFailed(false);
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = data!.image;
      await img.decode();
      await document.fonts.load('600 96px "Cormorant Garamond"');
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      ctx.textAlign = "center";
      ctx.fillStyle = "#ffffff";
      ctx.font = '600 96px "Cormorant Garamond", Georgia, serif';
      ctx.fillText(name.trim(), canvas.width / 2, canvas.height * 0.484, canvas.width * 0.52);
      ctx.font = '44px "Cormorant Garamond", Georgia, serif';
      ctx.fillText(
        new Date(data!.completedAt).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        canvas.width * 0.754,
        canvas.height * 0.803,
      );
      const link = document.createElement("a");
      link.download = `${title} - Certificate.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      setFailed(true);
    }
  }

  return (
    <div className="mt-8 rounded-md border border-gold bg-card p-6">
      <div className="eyebrow text-muted-foreground">Course complete</div>
      <h2 className="mt-1 text-3xl font-semibold">Your certificate</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Type your name the way you want it to appear.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <input
          value={name}
          onChange={(e) => setTyped(e.target.value)}
          maxLength={60}
          aria-label="Your name"
          placeholder="Your name"
          className="min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-2"
        />
        <button onClick={download} disabled={!name.trim()} className="btn-gold">
          Download certificate
        </button>
      </div>
      {failed && (
        <p className="mt-3 text-sm text-crimson">
          Couldn't make the certificate. Please try again.
        </p>
      )}
    </div>
  );
}
