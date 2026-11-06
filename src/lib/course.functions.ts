import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// Course files live in the private bucket under <product id>/course/. Browsers can't open them
// directly: the server checks the visitor's access (membership, as for the audiobooks) and then
// hands out links that run out after an hour.
const LINK_SECONDS = 60 * 60;

async function sign(paths: string[]) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin.storage
    .from("product-files")
    .createSignedUrls(paths, LINK_SECONDS);
  if (error || !data) throw new Error("Could not prepare the course files");
  return data.map((d) => {
    if (!d.signedUrl) throw new Error("Could not prepare the course files");
    return d.signedUrl;
  });
}

// The lesson row itself is protected by row-level security, so a visitor without access gets nothing.
export const getLessonFiles = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ lessonId: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const { data: lesson } = await context.supabase
      .from("lessons")
      .select("content_url")
      .eq("id", data.lessonId)
      .maybeSingle();
    if (!lesson?.content_url) throw new Error("No access to this lesson");
    const folder = lesson.content_url.slice(0, lesson.content_url.lastIndexOf("/"));
    const [video, captions, script, action] = await sign([
      lesson.content_url,
      `${folder}/captions.vtt`,
      `${folder}/script.pdf`,
      `${folder}/action.pdf`,
    ]);
    return { video, captions, script, action };
  });

const courseInput = z.object({ productId: z.string().uuid() });

// Each module's worksheet and quiz, and the course's final quiz.
export const getCourseFiles = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => courseInput.parse(d))
  .handler(async ({ context, data }) => {
    const { data: ok } = await context.supabase.rpc("has_access", { _product: data.productId });
    if (!ok) throw new Error("No access to this course");
    const { data: modules } = await context.supabase
      .from("modules")
      .select("id,position")
      .eq("course_id", data.productId);
    const base = `${data.productId}/course`;
    const list = modules ?? [];
    const urls = await sign([
      `${base}/final-quiz.pdf`,
      ...list.flatMap((m) => [
        `${base}/m${m.position}/worksheet.pdf`,
        `${base}/m${m.position}/quiz.pdf`,
      ]),
    ]);
    return {
      finalQuiz: urls[0],
      modules: Object.fromEntries(
        list.map((m, i) => [m.id, { worksheet: urls[1 + i * 2], quiz: urls[2 + i * 2] }]),
      ),
    };
  });

// The certificate artwork, only once every lesson is marked complete.
export const getCertificate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => courseInput.parse(d))
  .handler(async ({ context, data }) => {
    const { data: ok } = await context.supabase.rpc("has_access", { _product: data.productId });
    if (!ok) throw new Error("No access to this course");
    const [{ data: lessons }, { data: progress }, { data: profile }] = await Promise.all([
      context.supabase
        .from("lessons")
        .select("id,modules!inner(course_id)")
        .eq("modules.course_id", data.productId),
      context.supabase
        .from("lesson_progress")
        .select("lesson_id,completed_at")
        .eq("user_id", context.userId),
      context.supabase.from("profiles").select("full_name").eq("id", context.userId).maybeSingle(),
    ]);
    const finished = new Map((progress ?? []).map((p) => [p.lesson_id, p.completed_at]));
    const dates = (lessons ?? []).map((l) => finished.get(l.id));
    if (!dates.length || dates.some((d) => !d)) throw new Error("Finish every lesson first");
    const [image] = await sign([`${data.productId}/course/certificate.png`]);
    return {
      image: image!,
      name: profile?.full_name ?? "",
      completedAt: (dates as string[]).sort().at(-1)!,
    };
  });
