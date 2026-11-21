import { i as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./supabase-CeBPyXVR.mjs";
import { n as RequireAuth, t as AdminShell } from "./RequireAuth-BHe8WxJC.mjs";
import { a as fmtTime, n as STATUS_META } from "./appointments-BcksnCrJ.mjs";
import { t as Button } from "./button-BScraxvU.mjs";
import { i as DialogTitle, n as DialogContent, r as DialogHeader, t as Dialog } from "./dialog-OC-C3eRP.mjs";
import { n as Label, t as Input } from "./label-DEg0xxET.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as UserPlus, h as Search } from "../_libs/lucide-react.mjs";
import { t as toast } from "../_libs/sonner.mjs";
// node_modules/.nitro/vite/services/ssr/assets/patients-DVjXh1j-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var inputCls = "w-full min-h-11 rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";
function PatientsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireAuth, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PatientsInner, {}) }) });
}
function PatientsInner() {
	const [patients, setPatients] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [q, setQ] = (0, import_react.useState)("");
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [detail, setDetail] = (0, import_react.useState)([]);
	const [createOpen, setCreateOpen] = (0, import_react.useState)(false);
	const load = (0, import_react.useCallback)(async () => {
		if (!supabase) return;
		setLoading(true);
		let query = supabase.from("patients").select("id, patient_no, full_name, phone, email, created_at").order("created_at", { ascending: false }).limit(300);
		if (q.trim()) {
			const term = q.trim().replace(/[%_]/g, "");
			query = query.or(`full_name.ilike.%${term}%,phone.ilike.%${term}%,email.ilike.%${term}%`);
		}
		const { data, error } = await query;
		setLoading(false);
		if (error) {
			toast.error("Failed to load patients");
			return;
		}
		setPatients(data ?? []);
	}, [q]);
	(0, import_react.useEffect)(() => {
		const t = setTimeout(load, q ? 300 : 0);
		return () => clearTimeout(t);
	}, [load, q]);
	(0, import_react.useEffect)(() => {
		if (!supabase || !selected) {
			setDetail([]);
			return;
		}
		supabase.from("appointments").select("id, starts_at, status, services(name_en, name_ar)").eq("patient_id", selected.id).order("starts_at", { ascending: false }).limit(20).then(({ data }) => setDetail(data ?? []));
	}, [selected]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold tracking-tight text-foreground",
					children: "Patients"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: [patients.length, " records"]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setCreateOpen(true),
					className: "bg-deep text-deep-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "me-1 h-4 w-4" }), " New patient"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mt-4 max-w-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Search name, phone or email…",
					className: "ps-9"
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
						3,
						4
					].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-12 animate-pulse rounded-xl bg-muted" }, i))
				}) : patients.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-4 py-10 text-center text-sm text-muted-foreground",
					children: "No patients found."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-border",
					children: patients.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setSelected(p),
						className: "flex w-full items-center gap-4 px-4 py-3 text-start transition-colors hover:bg-secondary/50",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-soft text-sm font-bold text-deep",
								children: p.full_name.charAt(0)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-medium text-foreground",
									children: p.full_name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "truncate text-xs text-muted-foreground",
									dir: "ltr",
									children: [p.phone ?? "—", p.email ? ` · ${p.email}` : ""]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-muted-foreground",
								children: ["#", String(p.patient_no).padStart(4, "0")]
							})
						]
					}) }, p.id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!selected,
				onOpenChange: (v) => !v && setSelected(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-h-[90vh] overflow-y-auto sm:max-w-lg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: selected?.full_name }) }), selected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Phone"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									dir: "ltr",
									children: selected.phone ?? "—"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Email"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: selected.email ?? "—"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Patient no."
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-medium",
									children: ["#", String(selected.patient_no).padStart(4, "0")]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Registered"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: new Date(selected.created_at).toLocaleDateString("en-GB")
								})] })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-2 text-sm font-semibold text-foreground",
							children: "Recent appointments"
						}), detail.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "No appointments yet."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "divide-y divide-border rounded-xl border border-border",
							children: detail.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between px-3 py-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-foreground",
									children: a.services ? a.services.name_ar ?? a.services.name_en : "Appointment"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-2 text-xs text-muted-foreground",
									children: [fmtTime(a.starts_at), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_META[a.status].cls}`,
										children: STATUS_META[a.status].label
									})]
								})]
							}, a.id))
						})] })]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreatePatientDialog, {
				open: createOpen,
				onOpenChange: setCreateOpen,
				onCreated: () => {
					setCreateOpen(false);
					load();
				}
			})
		]
	});
}
function CreatePatientDialog({ open, onOpenChange, onCreated }) {
	const [name, setName] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!open) {
			setName("");
			setPhone("");
			setEmail("");
			setError(null);
		}
	}, [open]);
	async function submit() {
		if (!supabase) return;
		if (name.trim().length < 2) {
			setError("Enter the patient's full name.");
			return;
		}
		setSaving(true);
		const { error: pErr } = await supabase.from("patients").insert({
			full_name: name.trim(),
			phone: phone.replace(/\s/g, "") || null,
			email: email.trim() || null
		});
		setSaving(false);
		if (pErr) {
			setError("Could not create patient.");
			return;
		}
		toast.success("Patient created");
		onCreated();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "New patient" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "mb-1 block text-xs",
						children: "Full name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: name,
						onChange: (e) => setName(e.target.value),
						className: inputCls
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "mb-1 block text-xs",
						children: "Phone"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: phone,
						onChange: (e) => setPhone(e.target.value),
						className: inputCls,
						dir: "ltr",
						placeholder: "01xxxxxxxxx"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "mb-1 block text-xs",
						children: "Email (optional)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: email,
						onChange: (e) => setEmail(e.target.value),
						className: inputCls,
						dir: "ltr",
						type: "email"
					})] }),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-xl bg-destructive/10 p-3 text-xs text-destructive",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: submit,
						disabled: saving,
						className: "w-full bg-deep text-deep-foreground",
						children: saving ? "Saving…" : "Create patient"
					})
				]
			})]
		})
	});
}
export { PatientsPage as component };
