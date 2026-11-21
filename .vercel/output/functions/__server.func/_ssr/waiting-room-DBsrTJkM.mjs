import { i as __toESM } from "../_runtime.mjs";
import { i as useAdminAuth } from "./auth-B_bEywvQ.mjs";
import { n as supabase } from "./supabase-CeBPyXVR.mjs";
import { n as RequireAuth, t as AdminShell } from "./RequireAuth-BHe8WxJC.mjs";
import { n as AppointmentItem, t as APPOINTMENT_SELECT } from "./AppointmentBits-BaUhB4pc.mjs";
import { i as cairoParts, o as todayYmd } from "./appointments-BcksnCrJ.mjs";
import { t as Button } from "./button-BScraxvU.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as toast } from "../_libs/sonner.mjs";
// node_modules/.nitro/vite/services/ssr/assets/waiting-room-DBsrTJkM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COLUMNS = [
	{
		key: "expected",
		label: "Expected",
		statuses: ["booked", "confirmed"]
	},
	{
		key: "arrived",
		label: "Arrived",
		statuses: ["arrived"]
	},
	{
		key: "waiting",
		label: "Waiting",
		statuses: ["waiting"]
	},
	{
		key: "treatment",
		label: "In treatment",
		statuses: ["in_treatment"]
	},
	{
		key: "done",
		label: "Done today",
		statuses: ["completed", "no_show"]
	}
];
function WaitingRoomPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireAuth, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WaitingRoomInner, {}) }) });
}
function WaitingRoomInner() {
	const { state } = useAdminAuth();
	const actorId = state.status === "signed_in" ? state.session.user.id : null;
	const [rows, setRows] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const today = todayYmd();
	const load = (0, import_react.useCallback)(async () => {
		if (!supabase) return;
		setLoading(true);
		const { data, error } = await supabase.from("appointments").select(APPOINTMENT_SELECT).gte("starts_at", `${today}T00:00:00+02:00`).lt("starts_at", `${today}T23:59:59+03:00`).order("starts_at");
		setLoading(false);
		if (error) {
			toast.error("Failed to load waiting room");
			return;
		}
		const list = (data ?? []).filter((r) => cairoParts(r.starts_at).ymd === today);
		list.sort((a, b) => a.starts_at.localeCompare(b.starts_at));
		setRows(list);
	}, [today]);
	(0, import_react.useEffect)(() => {
		load();
		const t = setInterval(load, 3e4);
		return () => clearInterval(t);
	}, [load]);
	async function setStatus(a, to) {
		if (!supabase || !actorId) return;
		const { error } = await supabase.from("appointments").update({
			status: to,
			...to === "confirmed" ? { confirmed_at: (/* @__PURE__ */ new Date()).toISOString() } : {},
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", a.id);
		if (error) {
			toast.error("Update failed");
			return;
		}
		await supabase.from("appointment_status_log").insert({
			appointment_id: a.id,
			from_status: a.status,
			to_status: to,
			actor: actorId
		});
		load();
	}
	const byStatus = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const c of COLUMNS) map.set(c.key, []);
		for (const r of rows) {
			if (r.status === "cancelled") continue;
			const col = COLUMNS.find((c) => c.statuses.includes(r.status));
			if (col) map.get(col.key)?.push(r);
		}
		return map;
	}, [rows]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold tracking-tight text-foreground",
				children: "Waiting room"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: [
					(/* @__PURE__ */ new Date(`${today}T12:00:00Z`)).toLocaleDateString("en-GB", {
						weekday: "long",
						day: "numeric",
						month: "long"
					}),
					" · ",
					"auto-refreshes every 30s"
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				size: "sm",
				onClick: load,
				children: "Refresh"
			})]
		}), loading && rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-8 grid gap-4 md:grid-cols-3 xl:grid-cols-5",
			children: [
				0,
				1,
				2,
				3,
				4
			].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-48 animate-pulse rounded-2xl bg-muted" }, i))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 grid gap-4 md:grid-cols-3 xl:grid-cols-5",
			children: COLUMNS.map((col) => {
				const list = byStatus.get(col.key) ?? [];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "card-soft flex min-h-40 flex-col overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "flex items-center justify-between border-b border-border bg-muted/40 px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-semibold text-foreground",
							children: col.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-deep",
							children: list.length
						})]
					}), list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-4 py-6 text-center text-xs text-muted-foreground",
						children: "—"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "flex-1 divide-y divide-border",
						children: list.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppointmentItem, {
							a,
							onStatus: setStatus,
							compact: true
						}, a.id))
					})]
				}, col.key);
			})
		})]
	});
}
export { WaitingRoomPage as component };
