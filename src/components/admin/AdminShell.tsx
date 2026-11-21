import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  CalendarDays,
  ClipboardList,
  Hourglass,
  LayoutDashboard,
  LogOut,
  Menu,
  Receipt,
  Settings,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { useAdminAuth, useAdminRole } from "@/lib/admin/auth";
import { ROLE_LABELS } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, soon: false },
  { to: "/admin/waiting-room", label: "Waiting Room", icon: Hourglass, soon: false },
  { to: "/admin/appointments", label: "Appointments", icon: CalendarDays, soon: false },
  { to: "/admin/patients", label: "Patients", icon: Users, soon: false },
  { to: "/admin/billing", label: "Billing", icon: Receipt, soon: false },
  { to: "/admin/expenses", label: "Expenses", icon: Wallet, soon: false },
  { to: "/admin/reports", label: "Reports", icon: ClipboardList, soon: false },
  { to: "/admin/settings", label: "Settings", icon: Settings, soon: false },
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const { state, signOut } = useAdminAuth();
  const role = useAdminRole();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const profile = state.status === "signed_in" ? state.profile : null;

  async function handleSignOut() {
    await signOut();
    navigate({ to: "/admin/login" });
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-border px-5 py-5">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-deep">
          <LayoutDashboard className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">Enamel Admin</p>
          <p className="truncate text-xs text-muted-foreground">Dental House</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV.map(({ to, label, icon: Icon, soon }) =>
          soon ? (
            <span
              key={label}
              className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground/60"
              title="Coming in a later phase"
            >
              <Icon className="h-4.5 w-4.5" />
              {label}
              <span className="ms-auto rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                soon
              </span>
            </span>
          ) : (
            <Link
              key={label}
              to={to}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                "text-muted-foreground hover:bg-secondary hover:text-deep",
                "data-[status=active]:bg-primary-soft data-[status=active]:text-deep",
              )}
              activeProps={{ "data-status": "active" }}
              activeOptions={{ exact: to === "/admin" }}
            >
              <Icon className="h-4.5 w-4.5" />
              {label}
            </Link>
          ),
        )}
      </nav>

      <div className="border-t border-border p-3">
        <div className="rounded-xl bg-muted/60 px-3 py-2.5">
          <p className="truncate text-sm font-medium text-foreground">
            {profile?.full_name ?? "Staff"}
          </p>
          <p className="text-xs text-muted-foreground">{role ? ROLE_LABELS[role] : ""}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive"
        >
          <LogOut className="h-4.5 w-4.5" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 start-0 z-30 hidden w-64 border-e border-border bg-card lg:block">
        {sidebar}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-foreground/30" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 start-0 w-72 border-e border-border bg-card shadow-elevated">
            <button
              onClick={() => setOpen(false)}
              className="absolute end-3 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col lg:ms-64">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-card/90 px-4 backdrop-blur lg:px-8">
          <button
            onClick={() => setOpen(true)}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <p className="text-sm font-semibold text-foreground">Enamel Dental House</p>
          <span className="ms-auto rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-deep">
            Admin
          </span>
        </header>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
