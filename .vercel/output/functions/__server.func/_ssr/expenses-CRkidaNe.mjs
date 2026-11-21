import { i as __toESM } from "../_runtime.mjs";
import { i as useAdminAuth } from "./auth-B_bEywvQ.mjs";
import { n as supabase } from "./supabase-CeBPyXVR.mjs";
import { n as RequireAuth, t as AdminShell } from "./RequireAuth-BHe8WxJC.mjs";
import { t as Button } from "./button-BScraxvU.mjs";
import { i as DialogTitle, n as DialogContent, r as DialogHeader, t as Dialog } from "./dialog-OC-C3eRP.mjs";
import { n as Label, t as Input } from "./label-DEg0xxET.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-BWuq2-rH.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { s as Trash2, v as Plus } from "../_libs/lucide-react.mjs";
import { t as toast } from "../_libs/sonner.mjs";
// node_modules/.nitro/vite/services/ssr/assets/expenses-CRkidaNe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CATEGORIES = {
	supplies: "Supplies",
	lab: "Lab",
	rent: "Rent",
	utilities: "Utilities",
	salaries: "Salaries",
	equipment: "Equipment",
	marketing: "Marketing",
	other: "Other"
};
var inputCls = "w-full min-h-11 rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";
function fmtMoney(n) {
	return `EGP ${Number(n).toLocaleString("en-EG", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	})}`;
}
function ExpensesPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireAuth, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpensesInner, {}) }) });
}
function ExpensesInner() {
	const { state } = useAdminAuth();
	const role = state.status === "signed_in" ? state.profile?.role ?? null : null;
	const canManage = role === "owner" || role === "accountant";
	const actorId = state.status === "signed_in" ? state.session.user.id : null;
	const [rows, setRows] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [month, setMonth] = (0, import_react.useState)(() => (/* @__PURE__ */ new Date()).toISOString().slice(0, 7));
	const [createOpen, setCreateOpen] = (0, import_react.useState)(false);
	const load = (0, import_react.useCallback)(async () => {
		if (!supabase) return;
		setLoading(true);
		const { data, error } = await supabase.from("expenses").select("id, category, description, amount, spent_at, supplier").gte("spent_at", `${month}-01`).lt("spent_at", `${month}-32`).order("spent_at", { ascending: false });
		setLoading(false);
		if (error) {
			toast.error("Failed to load expenses");
			return;
		}
		setRows(data ?? []);
	}, [month]);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	const total = (0, import_react.useMemo)(() => rows.reduce((s, r) => s + Number(r.amount), 0), [rows]);
	const byCategory = (0, import_react.useMemo)(() => {
		const m = /* @__PURE__ */ new Map();
		for (const r of rows) m.set(r.category, (m.get(r.category) ?? 0) + Number(r.amount));
		return [...m.entries()].sort((a, b) => b[1] - a[1]);
	}, [rows]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold tracking-tight text-foreground",
					children: "Expenses"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: [
						(/* @__PURE__ */ new Date(`${month}-15T12:00:00Z`)).toLocaleDateString("en-GB", {
							month: "long",
							year: "numeric"
						}),
						" · ",
						fmtMoney(total),
						" total"
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "month",
						value: month,
						onChange: (e) => setMonth(e.target.value),
						className: "w-40"
					}), canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => setCreateOpen(true),
						className: "bg-deep text-deep-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "me-1 h-4 w-4" }), " Add expense"]
					})]
				})]
			}),
			byCategory.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: byCategory.map(([cat, amt]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "rounded-full bg-secondary px-3 py-1 text-xs font-medium text-deep",
					children: [
						CATEGORIES[cat] ?? cat,
						": ",
						fmtMoney(amt)
					]
				}, cat))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card-soft mt-4 overflow-hidden",
				children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2 p-4",
					children: [
						0,
						1,
						2,
						3
					].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-12 animate-pulse rounded-xl bg-muted" }, i))
				}) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-4 py-10 text-center text-sm text-muted-foreground",
					children: "No expenses this month."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-border",
					children: rows.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-4 px-4 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-medium text-foreground",
									children: e.description
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										CATEGORIES[e.category] ?? e.category,
										e.supplier ? ` · ${e.supplier}` : "",
										" ·",
										" ",
										(/* @__PURE__ */ new Date(`${e.spent_at}T12:00:00Z`)).toLocaleDateString("en-GB")
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-semibold text-foreground",
								children: fmtMoney(e.amount)
							}),
							canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "text-destructive hover:bg-destructive/10",
								onClick: async () => {
									if (!supabase || !window.confirm("Delete this expense?")) return;
									const { error } = await supabase.from("expenses").delete().eq("id", e.id);
									if (error) {
										toast.error("Delete failed");
										return;
									}
									load();
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
							})
						]
					}, e.id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreateExpenseDialog, {
				open: createOpen,
				onOpenChange: setCreateOpen,
				actorId,
				defaultDate: month,
				onCreated: () => {
					setCreateOpen(false);
					load();
				}
			})
		]
	});
}
function CreateExpenseDialog({ open, onOpenChange, actorId, defaultDate, onCreated }) {
	const [category, setCategory] = (0, import_react.useState)("supplies");
	const [description, setDescription] = (0, import_react.useState)("");
	const [amount, setAmount] = (0, import_react.useState)("");
	const [spentAt, setSpentAt] = (0, import_react.useState)(`${defaultDate}-15`);
	const [supplier, setSupplier] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (open) {
			setSpentAt(`${defaultDate}-15`);
			setError(null);
		}
	}, [open, defaultDate]);
	async function submit() {
		if (!supabase) return;
		const amt = Number(amount);
		if (!description.trim() || !amt || amt <= 0) {
			setError("Enter a description and a valid amount.");
			return;
		}
		setSaving(true);
		const { error: eErr } = await supabase.from("expenses").insert({
			category,
			description: description.trim(),
			amount: amt,
			spent_at: spentAt || null,
			supplier: supplier.trim() || null,
			created_by: actorId
		});
		setSaving(false);
		if (eErr) {
			setError("Could not save expense.");
			return;
		}
		toast.success("Expense added");
		onCreated();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add expense" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "mb-1 block text-xs",
						children: "Category"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: category,
						onValueChange: setCategory,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: inputCls,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: Object.entries(CATEGORIES).map(([v, l]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: v,
							children: l
						}, v)) })]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "mb-1 block text-xs",
						children: "Description"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: description,
						onChange: (e) => setDescription(e.target.value),
						className: inputCls,
						placeholder: "e.g. Gloves & masks restock"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "mb-1 block text-xs",
							children: "Amount (EGP)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 0,
							value: amount,
							onChange: (e) => setAmount(e.target.value),
							className: inputCls
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "mb-1 block text-xs",
							children: "Date"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: spentAt,
							onChange: (e) => setSpentAt(e.target.value),
							className: inputCls
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "mb-1 block text-xs",
						children: "Supplier (optional)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: supplier,
						onChange: (e) => setSupplier(e.target.value),
						className: inputCls
					})] }),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-xl bg-destructive/10 p-3 text-xs text-destructive",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: submit,
						disabled: saving,
						className: "w-full bg-deep text-deep-foreground",
						children: saving ? "Saving…" : "Add expense"
					})
				]
			})]
		})
	});
}
export { ExpensesPage as component };
