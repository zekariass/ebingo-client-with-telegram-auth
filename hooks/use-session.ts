"use client";

import { supabaseBrowser } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export function useSession() {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = supabaseBrowser();

  useEffect(() => {
    let isMounted = true;

    // Fetch initial session safely
    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;

      const verifiedSession = data.session;
      setSession(verifiedSession);
      setUser(verifiedSession?.user ?? null);
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!isMounted) return;
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    return () => {
      isMounted = false;
      subscription.subscription.unsubscribe();
    };
  }, [supabase]);

  // Use this session only for UI state.
  // For server-side or backend calls, always send session.access_token to your APIs
  // and verify it using supabase.auth.getUser() on the server.
  return { session, user, loading };
}
