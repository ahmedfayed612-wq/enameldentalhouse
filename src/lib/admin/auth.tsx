import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { Profile, StaffRole } from "./types";
import { ADMIN_ROLES } from "./types";

type AuthState =
  | { status: "loading" }
  | { status: "unconfigured" }
  | { status: "signed_out" }
  | { status: "signed_in"; session: Session; profile: Profile | null };

type Ctx = {
  state: AuthState;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthCtx = createContext<Ctx | null>(null);

async function loadProfile(userId: string): Promise<Profile | null> {
  if (!supabase) return null;
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, role, phone, active")
    .eq("id", userId)
    .maybeSingle();
  return (data as Profile | null) ?? null;
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() =>
    supabase ? { status: "loading" } : { status: "unconfigured" },
  );

  useEffect(() => {
    if (!supabase) return;
    let mounted = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      const session = data.session;
      if (!session) {
        setState({ status: "signed_out" });
        return;
      }
      const profile = await loadProfile(session.user.id);
      if (!mounted) return;
      setState({ status: "signed_in", session, profile });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      if (!session) {
        setState({ status: "signed_out" });
        return;
      }
      const profile = await loadProfile(session.user.id);
      if (!mounted) return;
      setState({ status: "signed_in", session, profile });
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) return { error: "Backend not configured" };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase?.auth.signOut();
    setState({ status: "signed_out" });
  }, []);

  const value = useMemo(() => ({ state, signIn, signOut }), [state, signIn, signOut]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}

export function useAdminRole(): StaffRole | null {
  const { state } = useAdminAuth();
  if (state.status !== "signed_in") return null;
  const role = state.profile?.role;
  return role && ADMIN_ROLES.includes(role) ? role : null;
}
