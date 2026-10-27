import { supabase } from "@/integrations/supabase/client";

// Browser-side events. Purchases and membership changes are recorded by the server from Gumroad.
export type ClientEvent = "signup" | "preview_read" | "podcast_play" | "newsletter_signup";

function anonId() {
  try {
    let id = localStorage.getItem("gswau_anon_id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("gswau_anon_id", id);
    }
    return id;
  } catch {
    return null;
  }
}

export function track(name: ClientEvent, props: Record<string, string | number | boolean> = {}) {
  // Fire and forget: analytics must never break the page.
  void (async () => {
    try {
      const { data } = await supabase.auth.getSession();
      await supabase.from("analytics_events").insert({
        name,
        props,
        anon_id: anonId(),
        user_id: data.session?.user.id ?? null,
      });
    } catch {
      // ignore
    }
  })();
}
