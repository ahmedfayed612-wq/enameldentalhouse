import { i as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./supabase-CeBPyXVR.mjs";
import { n as RequireAuth, t as AdminShell } from "./RequireAuth-D5wdH0uK.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { F as CalendarDays, i as Users, r as Wallet } from "../_libs/lucide-react.mjs";
// node_modules/.nitro/vite/services/ssr/assets/admin-uvqMkPbX.js
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
		patients: null
	});
	(0, import_react.useEffect)(() => {
		if (!supabase) return;
		const startOfToday = /* @__PURE__ */ new Date();
		startOfToday.setHours(0, 0, 0, 0);
		const endOfToday = new Date(startOfToday);
		endOfToday.setDate(endOfToday.getDate() + 1);
		Promise.all([supabase.from("appointments").select("id", {
			count: "exact",
			head: true
		}).gte("starts_at", startOfToday.toISOString()).lt("starts_at", endOfToday.toISOString()), supabase.from("patients").select("id", {
			count: "exact",
			head: true
		})]).then(([a, p]) => {
			setCounts({
				today: a.count ?? 0,
				patients: p.count ?? 0
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
				className: "mt-6 grid gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Appointments today",
						value: counts.today === null ? "—" : String(counts.today),
						icon: CalendarDays
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Patients",
						value: counts.patients === null ? "—" : String(counts.patients),
						icon: Users
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Collected today",
						value: "—",
						icon: Wallet
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-soft mt-6 p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-base font-semibold text-foreground",
					children: "Coming next"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Appointment calendar, patient CRM and billing modules are built in the next phases. The database foundation (patients, appointments, staff roles) is already in place."
				})]
			})
		]
	}) }) });
}
export { AdminOverview as component };
