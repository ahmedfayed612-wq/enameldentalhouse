import { useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAdminAuth } from "@/lib/admin/auth";
import { isSupabaseConfigured } from "@/lib/supabase";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  component: LoginPage,
});

const inputCls =
  "w-full min-h-12 rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

function LoginPage() {
  const { signIn } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signIn(email.trim(), password);
    setLoading(false);
    if (error) {
      setError(error);
      return;
    }
    navigate({ to: "/admin" });
  }

  return (
    <div className="grid min-h-screen place-items-center bg-muted/40 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary text-deep">
            <Sparkles className="h-7 w-7" />
          </span>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
            Enamel Admin
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to the clinic dashboard</p>
        </div>

        <div className="card-soft p-6">
          {!isSupabaseConfigured ? (
            <p className="rounded-xl border border-dashed border-border bg-background/60 p-4 text-center text-sm text-muted-foreground">
              Backend not configured yet. Set <code>VITE_SUPABASE_URL</code> and{" "}
              <code>VITE_SUPABASE_ANON_KEY</code> to enable sign-in.
            </p>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-foreground">Email</span>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputCls}
                  dir="ltr"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-foreground">Password</span>
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputCls}
                  dir="ltr"
                />
              </label>
              {error && <p className="text-xs text-destructive">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="min-h-12 w-full rounded-xl bg-deep px-6 py-3.5 text-sm font-semibold text-deep-foreground transition-opacity hover:opacity-95 disabled:opacity-60"
              >
                {loading ? "Signing in…" : "Sign in"}
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center">
          <a href="/" className="text-sm font-medium text-primary hover:underline">
            ← Back to website
          </a>
        </p>
      </div>
    </div>
  );
}
