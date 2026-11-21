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
import { _ as Receipt, h as Search, v as Plus } from "../_libs/lucide-react.mjs";
import { t as toast } from "../_libs/sonner.mjs";
// node_modules/.nitro/vite/services/ssr/assets/billing-DTRnHUgW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var inputCls = "w-full min-h-11 rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";
var STATUS_CLS = {
	draft: "bg-muted text-muted-foreground",
	sent: "bg-secondary text-deep",
	partial: "bg-amber-100 text-amber-800",
	paid: "bg-mint text-deep",
	void: "bg-destructive/10 text-destructive line-through"
};
var METHOD_LABELS = {
	cash: "Cash",
	card: "Card",
	wallet: "Wallet",
	insurance: "Insurance",
	other: "Other"
};
function fmtMoney(n) {
	return `EGP ${Number(n).toLocaleString("en-EG", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	})}`;
}
function BillingPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireAuth, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BillingInner, {}) }) });
}
function BillingInner() {
	const { state } = useAdminAuth();
	const role = state.status === "signed_in" ? state.profile?.role ?? null : null;
	const canManage = role === "owner" || role === "accountant";
	const actorId = state.status === "signed_in" ? state.session.user.id : null;
	const [invoices, setInvoices] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [q, setQ] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [createOpen, setCreateOpen] = (0, import_react.useState)(false);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [items, setItems] = (0, import_react.useState)([]);
	const [payments, setPayments] = (0, import_react.useState)([]);
	const [payOpen, setPayOpen] = (0, import_react.useState)(false);
	const load = (0, import_react.useCallback)(async () => {
		if (!supabase) return;
		setLoading(true);
		let query = supabase.from("invoices").select("id, patient_id, invoice_no, status, subtotal, discount, total, amount_paid, issued_at, due_date, patients(full_name, phone)").order("issued_at", { ascending: false }).limit(300);
		if (statusFilter !== "all") query = query.eq("status", statusFilter);
		const { data, error } = await query;
		setLoading(false);
		if (error) {
			toast.error("Failed to load invoices");
			return;
		}
		let list = data ?? [];
		if (q.trim()) {
			const term = q.trim().toLowerCase();
			list = list.filter((i) => `${i.patients?.full_name ?? ""} ${i.patients?.phone ?? ""} ${i.invoice_no}`.toLowerCase().includes(term));
		}
		setInvoices(list);
	}, [q, statusFilter]);
	(0, import_react.useEffect)(() => {
		const t = setTimeout(load, q ? 300 : 0);
		return () => clearTimeout(t);
	}, [load, q]);
	const loadDetail = (0, import_react.useCallback)(async (inv) => {
		if (!supabase) return;
		const [itemsRes, paysRes] = await Promise.all([supabase.from("invoice_items").select("id, description, qty, unit_price, line_total").eq("invoice_id", inv.id), supabase.from("payments").select("id, amount, method, paid_at, reference").eq("invoice_id", inv.id).order("paid_at", { ascending: false })]);
		setItems(itemsRes.data ?? []);
		setPayments(paysRes.data ?? []);
	}, []);
	(0, import_react.useEffect)(() => {
		if (selected) loadDetail(selected);
		else {
			setItems([]);
			setPayments([]);
		}
	}, [selected, loadDetail]);
	const totals = (0, import_react.useMemo)(() => {
		const paid = invoices.filter((i) => i.status !== "void").reduce((s, i) => s + Number(i.total), 0);
		const collected = invoices.filter((i) => i.status !== "void").reduce((s, i) => s + Number(i.amount_paid), 0);
		return {
			billed: paid,
			collected,
			outstanding: paid - collected
		};
	}, [invoices]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold tracking-tight text-foreground",
					children: "Billing"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Invoices, payments and receipts."
				})] }), canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setCreateOpen(true),
					className: "bg-deep text-deep-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "me-1 h-4 w-4" }), " New invoice"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid gap-4 sm:grid-cols-3",
				children: [
					{
						label: "Billed",
						value: fmtMoney(totals.billed)
					},
					{
						label: "Collected",
						value: fmtMoney(totals.collected)
					},
					{
						label: "Outstanding",
						value: fmtMoney(totals.outstanding)
					}
				].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-soft p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium text-muted-foreground",
						children: s.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xl font-semibold text-foreground",
						children: s.value
					})]
				}, s.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Search patient or invoice #…",
						className: "w-64 ps-9"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: statusFilter,
					onValueChange: setStatusFilter,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "w-36",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Status" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: "all",
						children: "All statuses"
					}), [
						"draft",
						"sent",
						"partial",
						"paid",
						"void"
					].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: s,
						children: s[0].toUpperCase() + s.slice(1)
					}, s))] })]
				})]
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
				}) : invoices.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-4 py-10 text-center text-sm text-muted-foreground",
					children: "No invoices yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-border",
					children: invoices.map((inv) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setSelected(inv),
						className: "flex w-full flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 text-start transition-colors hover:bg-secondary/50",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-deep",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm font-medium text-foreground",
									children: [
										"#",
										String(inv.invoice_no).padStart(4, "0"),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-normal text-muted-foreground",
											children: ["· ", inv.patients?.full_name ?? "Unknown"]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									dir: "ltr",
									children: [new Date(inv.issued_at).toLocaleDateString("en-GB"), inv.due_date ? ` · due ${inv.due_date}` : ""]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_CLS[inv.status]}`,
								children: inv.status
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-end",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold text-foreground",
									children: fmtMoney(inv.total)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: ["paid ", fmtMoney(inv.amount_paid)]
								})]
							})
						]
					}) }, inv.id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!selected,
				onOpenChange: (v) => !v && setSelected(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-h-[90vh] overflow-y-auto sm:max-w-lg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: ["Invoice #", selected ? String(selected.invoice_no).padStart(4, "0") : ""] }) }), selected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium text-foreground",
									children: selected.patients?.full_name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									dir: "ltr",
									children: selected.patients?.phone
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_CLS[selected.status]}`,
									children: selected.status
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "divide-y divide-border rounded-xl border border-border",
								children: [
									items.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-center justify-between px-3 py-2 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-foreground",
											children: [
												it.description,
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-xs text-muted-foreground",
													children: ["×", it.qty]
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium text-foreground",
											children: fmtMoney(it.line_total)
										})]
									}, it.id)),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex justify-between px-3 py-2 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Subtotal"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fmtMoney(selected.subtotal) })]
									}),
									Number(selected.discount) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex justify-between px-3 py-2 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Discount"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["-", fmtMoney(selected.discount)] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex justify-between px-3 py-2 text-sm font-semibold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fmtMoney(selected.total) })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex justify-between px-3 py-2 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Paid"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fmtMoney(selected.amount_paid) })]
									})
								]
							}),
							payments.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mb-2 text-sm font-semibold text-foreground",
								children: "Payments"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-1.5",
								children: payments.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center justify-between rounded-xl border border-border px-3 py-2 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-foreground",
										children: [METHOD_LABELS[p.method] ?? p.method, p.reference ? ` · ${p.reference}` : ""]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-foreground",
										children: fmtMoney(p.amount)
									})]
								}, p.id))
							})] }),
							canManage && selected.status !== "void" && selected.status !== "paid" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => setPayOpen(true),
								className: "w-full bg-deep text-deep-foreground",
								children: "Record payment"
							}),
							canManage && selected.status !== "void" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								className: "w-full text-destructive hover:bg-destructive/10",
								onClick: async () => {
									if (!supabase || !window.confirm("Void this invoice?")) return;
									const { error } = await supabase.from("invoices").update({
										status: "void",
										updated_at: (/* @__PURE__ */ new Date()).toISOString()
									}).eq("id", selected.id);
									if (error) {
										toast.error("Could not void invoice");
										return;
									}
									toast.success("Invoice voided");
									setSelected(null);
									load();
								},
								children: "Void invoice"
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreateInvoiceDialog, {
				open: createOpen,
				onOpenChange: setCreateOpen,
				actorId,
				onCreated: () => {
					setCreateOpen(false);
					load();
				}
			}),
			selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordPaymentDialog, {
				invoice: selected,
				actorId,
				open: payOpen,
				onOpenChange: setPayOpen,
				onSaved: () => {
					setPayOpen(false);
					loadDetail(selected);
					load();
				}
			})
		]
	});
}
function CreateInvoiceDialog({ open, onOpenChange, actorId, onCreated }) {
	const [patients, setPatients] = (0, import_react.useState)([]);
	const [services, setServices] = (0, import_react.useState)([]);
	const [patientQuery, setPatientQuery] = (0, import_react.useState)("");
	const [patientResults, setPatientResults] = (0, import_react.useState)([]);
	const [patient, setPatient] = (0, import_react.useState)(null);
	const [lines, setLines] = (0, import_react.useState)([{
		description: "",
		qty: 1,
		unit_price: 0
	}]);
	const [discount, setDiscount] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!open || !supabase) return;
		supabase.from("patients").select("id, full_name, phone").order("created_at", { ascending: false }).limit(500).then(({ data }) => setPatients(data ?? []));
		supabase.from("services").select("id, name_en, name_ar, price").eq("active", true).order("sort_order").then(({ data }) => setServices(data ?? []));
	}, [open]);
	(0, import_react.useEffect)(() => {
		if (!open) {
			setPatient(null);
			setPatientQuery("");
			setPatientResults([]);
			setLines([{
				description: "",
				qty: 1,
				unit_price: 0
			}]);
			setDiscount("");
			setError(null);
		}
	}, [open]);
	(0, import_react.useEffect)(() => {
		if (!patientQuery.trim() || patient || !supabase) {
			setPatientResults([]);
			return;
		}
		const q = patientQuery.trim();
		const sb = supabase;
		const t = setTimeout(async () => {
			const { data } = await sb.from("patients").select("id, full_name, phone").or(`full_name.ilike.%${q}%,phone.ilike.%${q}%`).limit(8);
			setPatientResults(data ?? []);
		}, 250);
		return () => clearTimeout(t);
	}, [patientQuery, patient]);
	const subtotal = (0, import_react.useMemo)(() => lines.reduce((s, l) => s + (Number(l.qty) || 0) * (Number(l.unit_price) || 0), 0), [lines]);
	const total = Math.max(0, subtotal - (Number(discount) || 0));
	function setLine(i, patch) {
		setLines((ls) => ls.map((l, j) => j === i ? {
			...l,
			...patch
		} : l));
	}
	function pickService(i, serviceId) {
		const s = services.find((x) => x.id === serviceId);
		if (s) setLine(i, {
			description: s.name_ar ?? s.name_en,
			unit_price: Number(s.price ?? 0)
		});
	}
	async function submit() {
		if (!supabase || !patient) {
			setError("Select a patient.");
			return;
		}
		const valid = lines.filter((l) => l.description.trim() && l.unit_price > 0);
		if (valid.length === 0) {
			setError("Add at least one line item with a price.");
			return;
		}
		setSaving(true);
		const { data: inv, error: iErr } = await supabase.from("invoices").insert({
			patient_id: patient.id,
			status: "sent",
			subtotal,
			discount: Number(discount) || 0,
			total,
			created_by: actorId
		}).select("id").single();
		if (iErr || !inv) {
			setSaving(false);
			setError("Could not create invoice.");
			return;
		}
		const { error: itErr } = await supabase.from("invoice_items").insert(valid.map((l) => ({
			invoice_id: inv.id,
			description: l.description.trim(),
			qty: l.qty || 1,
			unit_price: l.unit_price
		})));
		setSaving(false);
		if (itErr) {
			setError("Invoice created but line items failed — edit it in the database.");
			return;
		}
		toast.success("Invoice created");
		onCreated();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[90vh] overflow-y-auto sm:max-w-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "New invoice" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "mb-1 block text-xs",
						children: "Patient"
					}), patient ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-xl border border-border bg-muted/40 px-3 py-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-foreground",
							children: patient.full_name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							dir: "ltr",
							children: patient.phone
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => setPatient(null),
							children: "Change"
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: patientQuery,
								onChange: (e) => setPatientQuery(e.target.value),
								placeholder: "Search by name or phone…",
								className: `${inputCls} ps-9`,
								list: "billing-patients"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("datalist", {
								id: "billing-patients",
								children: patients.slice(0, 100).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: p.full_name }, p.id))
							}),
							patientResults.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-border bg-card shadow-elevated",
								children: patientResults.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "flex w-full items-center justify-between px-3 py-2 text-start text-sm hover:bg-muted",
									onClick: () => {
										setPatient(p);
										setPatientResults([]);
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-foreground",
										children: p.full_name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										dir: "ltr",
										children: p.phone
									})]
								}) }, p.id))
							})
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "block text-xs",
								children: "Items"
							}),
							lines.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-[1fr_64px_96px_32px] items-end gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [i === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mb-1 block text-[10px] text-muted-foreground",
										children: "Description / service"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: l.description,
										onChange: (e) => setLine(i, { description: e.target.value }),
										className: inputCls,
										placeholder: "e.g. Teeth whitening"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [i === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mb-1 block text-[10px] text-muted-foreground",
										children: "Qty"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										min: 1,
										value: l.qty,
										onChange: (e) => setLine(i, { qty: Number(e.target.value) }),
										className: inputCls
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [i === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mb-1 block text-[10px] text-muted-foreground",
										children: "Price (EGP)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										min: 0,
										value: l.unit_price,
										onChange: (e) => setLine(i, { unit_price: Number(e.target.value) }),
										className: inputCls
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										disabled: lines.length === 1,
										onClick: () => setLines((ls) => ls.filter((_, j) => j !== i)),
										children: "×"
									})
								]
							}, i)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => setLines((ls) => [...ls, {
										description: "",
										qty: 1,
										unit_price: 0
									}]),
									children: "+ Add line"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									onValueChange: (v) => {
										const empty = lines.findIndex((l) => !l.description.trim());
										pickService(empty >= 0 ? empty : lines.length - 1, v);
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "h-8 w-48 text-xs",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Pick from services…" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: services.filter((s) => s.price != null).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
										value: s.id,
										children: [
											s.name_ar ?? s.name_en,
											" — ",
											fmtMoney(s.price)
										]
									}, s.id)) })]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "mb-1 block text-xs",
							children: "Discount (EGP)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 0,
							value: discount,
							onChange: (e) => setDiscount(e.target.value),
							className: inputCls
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-end justify-between rounded-xl bg-muted/50 px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: "Total"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-lg font-semibold text-foreground",
								children: fmtMoney(total)
							})]
						})]
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-xl bg-destructive/10 p-3 text-xs text-destructive",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: submit,
						disabled: saving,
						className: "w-full bg-deep text-deep-foreground",
						children: saving ? "Saving…" : "Create invoice"
					})
				]
			})]
		})
	});
}
function RecordPaymentDialog({ invoice, actorId, open, onOpenChange, onSaved }) {
	const [amount, setAmount] = (0, import_react.useState)("");
	const [method, setMethod] = (0, import_react.useState)("cash");
	const [reference, setReference] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const remaining = Math.max(0, Number(invoice.total) - Number(invoice.amount_paid));
	(0, import_react.useEffect)(() => {
		if (open) {
			setAmount(String(remaining));
			setMethod("cash");
			setReference("");
			setError(null);
		}
	}, [open, remaining]);
	async function submit() {
		if (!supabase) return;
		const amt = Number(amount);
		if (!amt || amt <= 0) {
			setError("Enter a valid amount.");
			return;
		}
		setSaving(true);
		const { error: pErr } = await supabase.from("payments").insert({
			invoice_id: invoice.id,
			patient_id: invoice.patient_id,
			amount: amt,
			method,
			reference: reference.trim() || null,
			received_by: actorId
		});
		setSaving(false);
		if (pErr) {
			setError("Could not record payment.");
			return;
		}
		toast.success("Payment recorded");
		onSaved();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Record payment" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: ["Remaining: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-foreground",
							children: fmtMoney(remaining)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "mb-1 block text-xs",
						children: "Amount (EGP)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						min: 0,
						value: amount,
						onChange: (e) => setAmount(e.target.value),
						className: inputCls
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "mb-1 block text-xs",
						children: "Method"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: method,
						onValueChange: setMethod,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: inputCls,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: Object.entries(METHOD_LABELS).map(([v, l]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: v,
							children: l
						}, v)) })]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "mb-1 block text-xs",
						children: "Reference (optional)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: reference,
						onChange: (e) => setReference(e.target.value),
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
						children: saving ? "Saving…" : "Record payment"
					})
				]
			})]
		})
	});
}
export { BillingPage as component };
