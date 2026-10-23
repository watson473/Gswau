import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubscriber, setIsSubscriber] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async (u: User | null) => {
      if (!active) return;
      setUser(u);
      if (u) {
        const [{ data: admin }, { data: subscriber }] = await Promise.all([
          supabase.rpc("has_role", { _user_id: u.id, _role: "admin" }),
          supabase.rpc("has_subscription", { _user: u.id }),
        ]);
        if (active) {
          setIsAdmin(!!admin);
          setIsSubscriber(!!subscriber);
        }
      } else {
        setIsAdmin(false);
        setIsSubscriber(false);
      }
      if (active) setReady(true);
    };
    supabase.auth.getUser().then(({ data }) => load(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED")
        load(session?.user ?? null);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user, isAdmin, isSubscriber, ready };
}
