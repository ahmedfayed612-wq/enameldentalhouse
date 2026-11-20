import { i as __toESM } from "../_runtime.mjs";
import { a as useAdminRole, i as useAdminAuth, r as ROLE_LABELS, t as ADMIN_ROLES } from "./auth-B_bEywvQ.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { D as ClipboardList, F as CalendarDays, b as LogOut, d as Settings, i as Users, k as CircleAlert, p as Receipt, r as Wallet, t as X, v as Menu, x as LayoutDashboard } from "../_libs/lucide-react.mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
// node_modules/.nitro/vite/services/ssr/assets/RequireAuth-D5wdH0uK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var NAV = [
	{
		to: "/admin",
		label: "Overview",
		icon: LayoutDashboard,
		soon: false
	},
	{
		to: "/admin/appointments",
		label: "Appointments",
		icon: CalendarDays,
		soon: false
	},
	{
		to: "/admin/patients",
		label: "Patients",
		icon: Users,
		soon: true
	},
	{
		to: "/admin/billing",
		label: "Billing",
		icon: Receipt,
		soon: true
	},
	{
		to: "/admin/expenses",
		label: "Expenses",
		icon: Wallet,
		soon: true
	},
	{
		to: "/admin/reports",
		label: "Reports",
		icon: ClipboardList,
		soon: true
	},
	{
		to: "/admin/settings",
		label: "Settings",
		icon: Settings,
		soon: true
	}
];
function AdminShell({ children }) {
	const { state, signOut } = useAdminAuth();
	const role = useAdminRole();
	const navigate = useNavigate();
	const [open, setOpen] = (0, import_react.useState)(false);
	const profile = state.status === "signed_in" ? state.profile : null;
	async function handleSignOut() {
		await signOut();
		navigate({ to: "/admin/login" });
	}
	const sidebar = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 border-b border-border px-5 py-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-10 w-10 place-items-center rounded-2xl bg-primary text-deep",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-sm font-semibold text-foreground",
						children: "Enamel Admin"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-xs text-muted-foreground",
						children: "Dental House"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex-1 space-y-1 overflow-y-auto px-3 py-4",
				children: NAV.map(({ to, label, icon: Icon, soon }) => soon ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground/60",
					title: "Coming in a later phase",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4.5 w-4.5" }),
						label,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ms-auto rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
							children: "soon"
						})
					]
				}, label) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to,
					onClick: () => setOpen(false),
					className: cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors", "text-muted-foreground hover:bg-secondary hover:text-deep", "data-[status=active]:bg-primary-soft data-[status=active]:text-deep"),
					activeProps: { "data-status": "active" },
					activeOptions: { exact: to === "/admin" },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4.5 w-4.5" }), label]
				}, label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-border p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl bg-muted/60 px-3 py-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-sm font-medium text-foreground",
						children: profile?.full_name ?? "Staff"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: role ? ROLE_LABELS[role] : ""
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: handleSignOut,
					className: "mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4.5 w-4.5" }), "Sign out"]
				})]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen bg-muted/40",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "fixed inset-y-0 start-0 z-30 hidden w-64 border-e border-border bg-card lg:block",
				children: sidebar
			}),
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-40 lg:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 bg-foreground/30",
					onClick: () => setOpen(false)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "absolute inset-y-0 start-0 w-72 border-e border-border bg-card shadow-elevated",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setOpen(false),
						className: "absolute end-3 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-muted",
						"aria-label": "Close menu",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					}), sidebar]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col lg:ms-64",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-card/90 px-4 backdrop-blur lg:px-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setOpen(true),
							className: "rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden",
							"aria-label": "Open menu",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold text-foreground",
							children: "Enamel Dental House"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ms-auto rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-deep",
							children: "Admin"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1 p-4 lg:p-8",
					children
				})]
			})
		]
	});
}
function RequireAuth({ children }) {
	const { state } = useAdminAuth();
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		if (state.status === "signed_out" || state.status === "unconfigured") navigate({ to: "/admin/login" });
	}, [state.status, navigate]);
	if (state.status === "loading") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center bg-muted/40",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-10 animate-pulse rounded-full bg-primary/30" })
	});
	if (state.status !== "signed_in") return null;
	const role = state.profile?.role;
	if (!state.profile?.active || !role || !ADMIN_ROLES.includes(role)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center bg-muted/40 px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "card-soft max-w-sm p-6 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "mx-auto h-8 w-8 text-destructive" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 text-lg font-semibold text-foreground",
					children: "Access denied"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Your account does not have admin access. Contact the clinic owner."
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
export { RequireAuth as n, cn as r, AdminShell as t };
