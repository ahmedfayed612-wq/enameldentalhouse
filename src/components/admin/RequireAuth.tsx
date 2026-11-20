import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAdminAuth } from "@/lib/admin/auth";
import { ADMIN_ROLES } from "@/lib/admin/types";
import { AlertCircle } from "lucide-react";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { state } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (state.status === "signed_out" || state.status === "unconfigured") {
      navigate({ to: "/admin/login" });
    }
  }, [state.status, navigate]);

  if (state.status === "loading") {
    return (
      <div className="grid min-h-screen place-items-center bg-muted/40">
        <div className="h-10 w-10 animate-pulse rounded-full bg-primary/30" />
      </div>
    );
  }
  if (state.status !== "signed_in") return null;

  const role = state.profile?.role;
  if (!state.profile?.active || !role || !ADMIN_ROLES.includes(role)) {
    return (
      <div className="grid min-h-screen place-items-center bg-muted/40 px-4">
        <div className="card-soft max-w-sm p-6 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
          <h1 className="mt-3 text-lg font-semibold text-foreground">Access denied</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your account does not have admin access. Contact the clinic owner.
          </p>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
