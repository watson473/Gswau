import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Set a new password — GSWAU" }, { name: "description", content: "Choose a new GSWAU password." }, { property: "og:title", content: "Reset password — GSWAU" }, { property: "og:description", content: "Choose a new password." }, { name: "robots", content: "noindex" }] }),
  component: Reset,
});

function Reset() {
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const navigate = useNavigate();
  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <h1 className="text-4xl font-semibold">Set a new password</h1>
      <form className="mt-8 space-y-3" onSubmit={async (e) => {
        e.preventDefault();
        const { error } = await supabase.auth.updateUser({ password: pw });
        if (error) setMsg(error.message); else navigate({ to: "/account" });
      }}>
        <input required type="password" minLength={8} value={pw} onChange={(e) => setPw(e.target.value)} placeholder="New password" className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm" />
        <button className="btn-gold w-full">Save password</button>
      </form>
      {msg && <p className="mt-4 text-sm">{msg}</p>}
    </div>
  );
}
