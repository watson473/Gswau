import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/account/review")({
  head: () => ({ meta: [{ title: "Leave a review — GSWAU" }, { name: "description", content: "Share your experience with GSWAU." }, { property: "og:title", content: "Leave a review — GSWAU" }, { property: "og:description", content: "Share your experience." }, { name: "robots", content: "noindex" }] }),
  component: Review,
});

function Review() {
  const [form, setForm] = useState({ name: "", location: "", quote: "", rating: 5 });
  const [state, setState] = useState<"idle" | "done" | "error">("idle");
  if (state === "done") return <div className="mx-auto max-w-xl px-5 py-16"><h1 className="text-4xl font-semibold">Thank you!</h1><p className="mt-3">Your review will appear on the site once it's approved.</p><Link to="/account" className="btn-gold mt-6">Back to my library</Link></div>;
  return (
    <div className="mx-auto max-w-xl px-5 py-16">
      <h1 className="text-4xl font-semibold">Leave a review</h1>
      <form className="mt-8 space-y-3" onSubmit={async (e) => {
        e.preventDefault();
        const { data: u } = await supabase.auth.getUser();
        const { error } = await supabase.from("testimonials").insert({ ...form, location: form.location || null, user_id: u.user!.id });
        setState(error ? "error" : "done");
      }}>
        <input required maxLength={80} placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm" />
        <input maxLength={80} placeholder="City (optional)" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm" />
        <textarea required maxLength={600} rows={5} placeholder="What changed for you?" value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm" />
        <select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm">
          {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}
        </select>
        <button className="btn-gold w-full">Submit review</button>
        {state === "error" && <p className="text-sm text-crimson">Couldn't send — please try again.</p>}
      </form>
    </div>
  );
}
