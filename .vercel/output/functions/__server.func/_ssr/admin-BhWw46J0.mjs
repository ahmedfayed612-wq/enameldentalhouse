import { i as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./supabase-CeBPyXVR.mjs";
import { n as RequireAuth, t as AdminShell } from "./RequireAuth-BHe8WxJC.mjs";
import { o as todayYmd } from "./appointments-BcksnCrJ.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { B as CalendarDays, D as Hourglass, _ as Receipt, i as Users, r as Wallet } from "../_libs/lucide-react.mjs";
// node_modules/.nitro/vite/services/ssr/assets/admin-BhWw46J0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StatCard({ label, value, icon: Icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "card-soft p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium text-muted-foreground",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-deep",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4.5 w-4.5" })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-3xl font-semibold tracking-tight text-foreground",
			children: value
		})]
	});
}
function AdminOverview() {
	const [counts, setCounts] = (0, import_react.useState)({
		today: null,
		patients: null,
		waiting: null,
		collectedToday: null
	});
	(0, import_react.useEffect)(() => {
		if (!supabase) return;
		const today = todayYmd();
		Promise.all([
			supabase.from("appointments").select("id", {
				count: "exact",
				head: true
			}).gte("starts_at", `${today}T00:00:00+02:00`).lt("starts_at", `${today}T23:59:59+03:00`),
			supabase.from("patients").select("id", {
				count: "exact",
				head: true
			}),
			supabase.from("appointments").select("id", {
				count: "exact",
				head: true
			}).in("status", [
				"arrived",
				"waiting",
				"in_treatment"
			]).gte("starts_at", `${today}T00:00:00+02:00`).lt("starts_at", `${today}T23:59:59+03:00`),
			supabase.from("payments").select("amount").gte("paid_at", `${today}T00:00:00+02:00`).lt("paid_at", `${today}T23:59:59+03:00`)
		]).then(([a, p, w, pay]) => {
			const collected = pay.data?.reduce((s, r) => s + Number(r.amount), 0);
			setCounts({
				today: a.count ?? 0,
				patients: p.count ?? 0,
				waiting: w.count ?? 0,
				collectedToday: collected ?? 0
			});
		});
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireAuth, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold tracking-tight text-foreground",
				children: "Overview"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Today's operations at a glance."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Appointments today",
						value: counts.today === null ? "—" : String(counts.today),
						icon: CalendarDays
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "In the clinic now",
						value: counts.waiting === null ? "—" : String(counts.waiting),
						icon: Hourglass
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Patients",
						value: counts.patients === null ? "—" : String(counts.patients),
						icon: Users
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Collected today",
						value: counts.collectedToday === null ? "—" : `EGP ${counts.collectedToday.toLocaleString("en-EG", { maximumFractionDigits: 0 })}`,
						icon: Wallet
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 grid gap-4 sm:grid-cols-3",
				children: [
					{
						to: "/admin/waiting-room",
						label: "Waiting room",
						desc: "Live patient flow board",
						icon: Hourglass
					},
					{
						to: "/admin/appointments",
						label: "Appointments",
						desc: "Day, week and month calendar",
						icon: CalendarDays
					},
					{
						to: "/admin/billing",
						label: "Billing",
						desc: "Invoices and payments",
						icon: Receipt
					}
				].map(({ to, label, desc, icon: Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to,
					className: "card-soft group flex items-center gap-4 p-5 transition-shadow hover:shadow-elevated",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-11 w-11 place-items-center rounded-2xl bg-primary-soft text-deep transition-colors group-hover:bg-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold text-foreground",
						children: label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: desc
					})] })]
				}, to))
			})
		]
	}) }) });
}
export { AdminOverview as component };
