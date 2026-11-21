import { i as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./supabase-CeBPyXVR.mjs";
import { n as RequireAuth, t as AdminShell } from "./RequireAuth-BHe8WxJC.mjs";
import { i as cairoParts, n as STATUS_META, o as todayYmd } from "./appointments-BcksnCrJ.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { B as CalendarDays, _ as Receipt, i as Users, o as TrendingUp, r as Wallet } from "../_libs/lucide-react.mjs";
// node_modules/.nitro/vite/services/ssr/assets/reports-CZiBXw-F.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StatCard({ label, value, icon: Icon, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "card-soft p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium text-muted-foreground",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-deep",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4.5 w-4.5" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-3xl font-semibold tracking-tight text-foreground",
				children: value
			}),
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: hint
			})
		]
	});
}
function ReportsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireAuth, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportsInner, {}) }) });
}
function ReportsInner() {
	const [appts, setAppts] = (0, import_react.useState)([]);
	const [invoices, setInvoices] = (0, import_react.useState)([]);
	const [expenses, setExpenses] = (0, import_react.useState)([]);
	const [newPatients, setNewPatients] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		if (!supabase) return;
		const today = todayYmd();
		const monthStart = `${today.slice(0, 7)}-01`;
		const twoWeeksAgo = /* @__PURE__ */ new Date(`${today}T12:00:00Z`);
		twoWeeksAgo.setUTCDate(twoWeeksAgo.getUTCDate() - 14);
		const from = twoWeeksAgo.toISOString().slice(0, 10);
		Promise.all([
			supabase.from("appointments").select("starts_at, status").gte("starts_at", `${from}T00:00:00Z`).lt("starts_at", `${today}T23:59:59Z`),
			supabase.from("invoices").select("total, amount_paid, status, issued_at").gte("issued_at", `${monthStart}T00:00:00Z`),
			supabase.from("expenses").select("amount, spent_at, category").gte("spent_at", monthStart),
			supabase.from("patients").select("id", {
				count: "exact",
				head: true
			}).gte("created_at", `${monthStart}T00:00:00Z`)
		]).then(([a, i, e, p]) => {
			setAppts(a.data ?? []);
			setInvoices(i.data ?? []);
			setExpenses(e.data ?? []);
			setNewPatients(p.count ?? 0);
			setLoading(false);
		});
	}, []);
	const stats = (0, import_react.useMemo)(() => {
		const active = appts.filter((a) => !["cancelled", "no_show"].includes(a.status));
		const completed = appts.filter((a) => a.status === "completed").length;
		const revenue = invoices.filter((i) => i.status !== "void").reduce((s, i) => s + Number(i.amount_paid), 0);
		const billed = invoices.filter((i) => i.status !== "void").reduce((s, i) => s + Number(i.total), 0);
		const spent = expenses.reduce((s, e) => s + Number(e.amount), 0);
		return {
			appts: active.length,
			completed,
			revenue,
			billed,
			spent,
			net: revenue - spent
		};
	}, [
		appts,
		invoices,
		expenses
	]);
	const daily = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const a of appts) {
			const d = cairoParts(a.starts_at).ymd;
			const cur = map.get(d) ?? {
				total: 0,
				done: 0
			};
			if (!["cancelled", "no_show"].includes(a.status)) {
				cur.total++;
				if (a.status === "completed") cur.done++;
			}
			map.set(d, cur);
		}
		return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
	}, [appts]);
	const maxDaily = Math.max(1, ...daily.map(([, v]) => v.total));
	const statusBreakdown = (0, import_react.useMemo)(() => {
		const m = /* @__PURE__ */ new Map();
		for (const a of appts) m.set(a.status, (m.get(a.status) ?? 0) + 1);
		return [...m.entries()].sort((a, b) => b[1] - a[1]);
	}, [appts]);
	const expByCat = (0, import_react.useMemo)(() => {
		const m = /* @__PURE__ */ new Map();
		for (const e of expenses) m.set(e.category, (m.get(e.category) ?? 0) + Number(e.amount));
		return [...m.entries()].sort((a, b) => b[1] - a[1]);
	}, [expenses]);
	const maxExp = Math.max(1, ...expByCat.map(([, v]) => v));
	const fmt = (n) => `EGP ${n.toLocaleString("en-EG", { maximumFractionDigits: 0 })}`;
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-6xl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
			children: [
				0,
				1,
				2,
				3
			].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-28 animate-pulse rounded-2xl bg-muted" }, i))
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold tracking-tight text-foreground",
				children: "Reports"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Last 14 days operations · this month's finances"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Appointments (14d)",
						value: String(stats.appts),
						icon: CalendarDays,
						hint: `${stats.completed} completed`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "New patients (month)",
						value: String(newPatients ?? 0),
						icon: Users
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Revenue collected (month)",
						value: fmt(stats.revenue),
						icon: TrendingUp,
						hint: `of ${fmt(stats.billed)} billed`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Net (revenue − expenses)",
						value: fmt(stats.net),
						icon: Wallet,
						hint: `${fmt(stats.spent)} spent`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 lg:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "card-soft p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-semibold text-foreground",
							children: "Appointments per day"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex h-40 items-end gap-1.5",
							children: [daily.map(([d, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "group flex flex-1 flex-col items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-full rounded-t-md bg-primary/70 transition-colors group-hover:bg-primary",
									style: { height: `${Math.max(4, v.total / maxDaily * 100)}%` },
									title: `${d}: ${v.total} (${v.done} done)`
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[9px] text-muted-foreground",
									children: d.slice(8)
								})]
							}, d)), daily.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "w-full text-center text-sm text-muted-foreground",
								children: "No data yet."
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "card-soft p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-semibold text-foreground",
							children: "Status breakdown"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-4 space-y-2",
							children: [statusBreakdown.map(([s, n]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_META[s].cls}`,
									children: STATUS_META[s].label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-foreground",
									children: n
								})]
							}, s)), statusBreakdown.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "No appointments in range."
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "card-soft p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-semibold text-foreground",
							children: "Expenses by category"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-4 space-y-2.5",
							children: [expByCat.map(([cat, amt]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "capitalize text-foreground",
									children: cat
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-foreground",
									children: fmt(amt)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 h-2 overflow-hidden rounded-full bg-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full bg-deep/70",
									style: { width: `${amt / maxExp * 100}%` }
								})
							})] }, cat)), expByCat.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "me-1 inline h-4 w-4" }), "No expenses recorded this month."]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "card-soft p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-base font-semibold text-foreground",
								children: "Receivables"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-3xl font-semibold tracking-tight text-foreground",
								children: fmt(stats.billed - stats.revenue)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Outstanding balance across this month's invoices."
							})
						]
					})
				]
			})
		]
	});
}
export { ReportsPage as component };
