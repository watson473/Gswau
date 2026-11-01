import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { getMfaState } from "@/lib/mfa";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/auth", search: { redirect: location.pathname } });
    if (location.pathname === "/mfa") return;
    const mfa = await getMfaState();
    // Two-step sign-in is on but this session hasn't entered a code yet.
    if (mfa.needsCode) throw redirect({ to: "/mfa", search: { redirect: location.pathname } });
    // Admins must turn on two-step sign-in before they can open Admin.
    if (mfa.isAdmin && mfa.factors.length === 0 && location.pathname.startsWith("/admin"))
      throw redirect({ to: "/account", search: { mfa: "required" } });
  },
  component: () => <Outlet />,
});
