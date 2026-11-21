import { i as __toESM } from "../_runtime.mjs";
import { i as useAdminAuth } from "./auth-B_bEywvQ.mjs";
import { n as supabase } from "./supabase-CeBPyXVR.mjs";
import { n as RequireAuth, r as cn, t as AdminShell } from "./RequireAuth-BHe8WxJC.mjs";
import { n as getDaySlots } from "./booking.functions-CHHrnfU2.mjs";
import { i as cairoParts, n as STATUS_META, o as todayYmd, r as addDaysYmd } from "./appointments-BcksnCrJ.mjs";
import { n as AppointmentItem, r as StatusPill, t as APPOINTMENT_SELECT } from "./AppointmentBits-BaUhB4pc.mjs";
import { t as Button } from "./button-BScraxvU.mjs";
import { i as DialogTitle, n as DialogContent, r as DialogHeader, t as Dialog } from "./dialog-OC-C3eRP.mjs";
import { n as Label, t as Input } from "./label-DEg0xxET.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-BWuq2-rH.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { I as ChevronRight, L as ChevronLeft, h as Search, v as Plus } from "../_libs/lucide-react.mjs";
import { t as toast } from "../_libs/sonner.mjs";
// node_modules/.nitro/vite/services/ssr/assets/appointments-BRQVfEVL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
var inputCls = "w-full min-h-11 rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";
function AppointmentsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireAuth, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppointmentsInner, {}) }) });
}
function AppointmentsInner() {
	const { state } = useAdminAuth();
	const actorId = state.status === "signed_in" ? state.session.user.id : null;
	const [view, setView] = (0, import_react.useState)("day");
	const [cursor, setCursor] = (0, import_react.useState)(todayYmd());
	const [rows, setRows] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [createOpen, setCreateOpen] = (0, import_react.useState)(false);
	const [editTarget, setEditTarget] = (0, import_react.useState)(null);
	const [dentistId, setDentistId] = (0, import_react.useState)(null);
	const [dentists, setDentists] = (0, import_react.useState)([]);
	const [filterDentist, setFilterDentist] = (0, import_react.useState)("all");
	const [filterStatus, setFilterStatus] = (0, import_react.useState)("all");
	const [filterService, setFilterService] = (0, import_react.useState)("all");
	const [filterQ, setFilterQ] = (0, import_react.useState)("");
	const [services, setServices] = (0, import_react.useState)([]);
	const days = (0, import_react.useMemo)(() => {
		if (view === "day") return [cursor];
		if (view === "week") return Array.from({ length: 7 }, (_, i) => addDaysYmd(cursor, i));
		return [];
	}, [view, cursor]);
	const monthDays = (0, import_react.useMemo)(() => {
		if (view !== "month") return [];
		const [y, m] = cursor.split("-").map(Number);
		const first = new Date(Date.UTC(y, m - 1, 1));
		const dim = new Date(Date.UTC(y, m, 0)).getUTCDate();
		const startDow = first.getUTCDay();
		const cells = [];
		for (let i = 0; i < startDow; i++) cells.push(null);
		for (let d = 1; d <= dim; d++) cells.push(`${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
		return cells;
	}, [view, cursor]);
	const range = (0, import_react.useMemo)(() => {
		if (view === "day") return {
			from: addDaysYmd(cursor, -1),
			to: addDaysYmd(cursor, 2)
		};
		if (view === "week") return {
			from: addDaysYmd(days[0], -1),
			to: addDaysYmd(days[6], 2)
		};
		const [y, m] = cursor.split("-").map(Number);
		const first = `${y}-${String(m).padStart(2, "0")}-01`;
		const lastD = new Date(Date.UTC(y, m, 0)).getUTCDate();
		return {
			from: addDaysYmd(`${y}-${String(m).padStart(2, "0")}-${String(lastD).padStart(2, "0")}`, -45),
			to: addDaysYmd(first, 45)
		};
	}, [
		view,
		cursor,
		days
	]);
	const load = (0, import_react.useCallback)(async () => {
		if (!supabase) return;
		setLoading(true);
		let q = supabase.from("appointments").select(APPOINTMENT_SELECT).gte("starts_at", `${range.from}T00:00:00Z`).lt("starts_at", `${range.to}T00:00:00Z`).order("starts_at");
		if (filterDentist !== "all") q = q.eq("dentist_id", filterDentist);
		const { data, error } = await q;
		setLoading(false);
		if (error) {
			toast.error("Failed to load appointments");
			return;
		}
		setRows(data ?? []);
	}, [range, filterDentist]);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	(0, import_react.useEffect)(() => {
		if (!supabase) return;
		supabase.from("dentists").select("id, name").eq("active", true).order("created_at").then(({ data }) => {
			const list = data ?? [];
			setDentists(list);
			if (list[0] && !dentistId) setDentistId(list[0].id);
		});
		supabase.from("services").select("id, code, name_en, name_ar").eq("active", true).order("sort_order").then(({ data }) => setServices(data ?? []));
	}, []);
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
	function shift(n) {
		if (view === "month") {
			const [y, m] = cursor.split("-").map(Number);
			const d = new Date(Date.UTC(y, m - 1 + n, 1));
			setCursor(d.toISOString().slice(0, 10));
		} else setCursor((c) => addDaysYmd(c, view === "day" ? n : n * 7));
	}
	const filtered = (0, import_react.useMemo)(() => {
		const q = filterQ.trim().toLowerCase();
		return rows.filter((r) => {
			if (filterStatus !== "all" && r.status !== filterStatus) return false;
			if (filterService !== "all" && r.service_id !== filterService) return false;
			if (q) {
				if (!`${r.patients?.full_name ?? ""} ${r.patients?.phone ?? ""}`.toLowerCase().includes(q)) return false;
			}
			return true;
		});
	}, [
		rows,
		filterStatus,
		filterService,
		filterQ
	]);
	const byDay = (0, import_react.useMemo)(() => {
		const wanted = view === "month" ? monthDays.filter(Boolean) : days;
		const map = /* @__PURE__ */ new Map();
		for (const d of wanted) map.set(d, []);
		for (const r of filtered) {
			const key = cairoParts(r.starts_at).ymd;
			map.get(key)?.push(r);
		}
		for (const list of map.values()) list.sort((a, b) => a.starts_at.localeCompare(b.starts_at));
		return map;
	}, [
		filtered,
		days,
		monthDays,
		view
	]);
	(0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const r of rows) {
			const key = cairoParts(r.starts_at).ymd;
			map.set(key, (map.get(key) ?? 0) + 1);
		}
		return map;
	}, [rows]);
	const subtitle = view === "day" ? cursor : view === "week" ? `${days[0]} → ${days[6]}` : (/* @__PURE__ */ new Date(`${cursor}T12:00:00Z`)).toLocaleDateString("en-GB", {
		month: "long",
		year: "numeric"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold tracking-tight text-foreground",
					children: "Appointments"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: subtitle
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex rounded-xl border border-border bg-card p-1",
							children: [
								"day",
								"week",
								"month"
							].map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setView(v),
								className: `rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors ${view === v ? "bg-deep text-deep-foreground" : "text-muted-foreground hover:bg-muted"}`,
								children: v
							}, v))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "icon",
							onClick: () => shift(-1),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => setCursor(todayYmd()),
							children: "Today"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "icon",
							onClick: () => shift(1),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => setCreateOpen(true),
							className: "bg-deep text-deep-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "me-1 h-4 w-4" }), " New"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: filterQ,
							onChange: (e) => setFilterQ(e.target.value),
							placeholder: "Search patient…",
							className: "w-48 ps-9"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: filterStatus,
						onValueChange: setFilterStatus,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-36",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Status" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "All statuses"
						}), Object.keys(STATUS_META).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: s,
							children: STATUS_META[s].label
						}, s))] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: filterService,
						onValueChange: setFilterService,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-44",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Service" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "All services"
						}), services.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: s.id,
							children: s.name_ar ?? s.name_en
						}, s.id))] })]
					}),
					dentists.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: filterDentist,
						onValueChange: setFilterDentist,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-40",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Dentist" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "All dentists"
						}), dentists.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: d.id,
							children: d.name
						}, d.id))] })]
					})
				]
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 space-y-3",
				children: [
					0,
					1,
					2,
					3
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-16 animate-pulse rounded-2xl bg-muted" }, i))
			}) : view === "month" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-soft mt-6 overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-7 border-b border-border bg-muted/40 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground",
					children: [
						"Sun",
						"Mon",
						"Tue",
						"Wed",
						"Thu",
						"Fri",
						"Sat"
					].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-2 py-2",
						children: d
					}, d))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-7",
					children: monthDays.map((d, i) => {
						if (!d) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "min-h-20 border-b border-e border-border bg-muted/20" }, `e${i}`);
						const list = byDay.get(d) ?? [];
						const isToday = d === todayYmd();
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								setCursor(d);
								setView("day");
							},
							className: `min-h-20 border-b border-e border-border p-1.5 text-start transition-colors hover:bg-secondary/50 ${isToday ? "bg-primary-soft/60" : ""}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `inline-grid h-6 w-6 place-items-center rounded-full text-xs font-semibold ${isToday ? "bg-deep text-deep-foreground" : "text-foreground"}`,
								children: Number(d.slice(8))
							}), list.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mt-1 block truncate text-[10px] font-medium text-muted-foreground",
								children: [
									list.length,
									" appt",
									list.length > 1 ? "s" : ""
								]
							})]
						}, d);
					})
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: view === "week" ? "mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-3" : "mt-6 space-y-6",
				children: days.map((d) => {
					const list = byDay.get(d) ?? [];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "card-soft overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
							className: "flex items-center justify-between border-b border-border bg-muted/40 px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-sm font-semibold text-foreground",
								children: [(/* @__PURE__ */ new Date(`${d}T12:00:00Z`)).toLocaleDateString("en-GB", {
									weekday: "short",
									day: "numeric",
									month: "short"
								}), d === todayYmd() && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ms-2 rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-semibold text-deep",
									children: "today"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-muted-foreground",
								children: [list.length, " booked"]
							})]
						}), list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "px-4 py-6 text-center text-sm text-muted-foreground",
							children: "No appointments"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "divide-y divide-border",
							children: list.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppointmentItem, {
								a,
								onStatus: setStatus,
								onEdit: setEditTarget
							}, a.id))
						})]
					}, d);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreateAppointmentDialog, {
				open: createOpen,
				onOpenChange: setCreateOpen,
				dentistId,
				defaultDate: cursor,
				onCreated: load
			}),
			editTarget && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditAppointmentDialog, {
				appointment: editTarget,
				dentistId,
				onClose: () => setEditTarget(null),
				onSaved: load
			})
		]
	});
}
function CreateAppointmentDialog({ open, onOpenChange, dentistId, defaultDate, onCreated }) {
	const [services, setServices] = (0, import_react.useState)([]);
	const [patientQuery, setPatientQuery] = (0, import_react.useState)("");
	const [patientResults, setPatientResults] = (0, import_react.useState)([]);
	const [patient, setPatient] = (0, import_react.useState)(null);
	const [isNewPatient, setIsNewPatient] = (0, import_react.useState)(true);
	const [newName, setNewName] = (0, import_react.useState)("");
	const [newPhone, setNewPhone] = (0, import_react.useState)("");
	const [serviceId, setServiceId] = (0, import_react.useState)("");
	const [date, setDate] = (0, import_react.useState)(defaultDate);
	const [time, setTime] = (0, import_react.useState)("");
	const [slots, setSlots] = (0, import_react.useState)([]);
	const [slotMinutes, setSlotMinutes] = (0, import_react.useState)(45);
	const [notes, setNotes] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!open || !supabase) return;
		supabase.from("services").select("id, code, name_en, name_ar").eq("active", true).order("sort_order").then(({ data }) => setServices(data ?? []));
		supabase.from("clinic_settings").select("slot_minutes").eq("id", 1).maybeSingle().then(({ data }) => {
			if (data?.slot_minutes) setSlotMinutes(data.slot_minutes);
		});
	}, [open]);
	(0, import_react.useEffect)(() => {
		if (!open) {
			setPatient(null);
			setPatientQuery("");
			setPatientResults([]);
			setNewName("");
			setNewPhone("");
			setServiceId("");
			setDate(defaultDate);
			setTime("");
			setNotes("");
			setError(null);
		}
	}, [open, defaultDate]);
	(0, import_react.useEffect)(() => {
		setTime("");
		if (!date || !open) {
			setSlots([]);
			return;
		}
		getDaySlots({ data: { date } }).then((r) => setSlots(r.ok ? r.slots : []));
	}, [date, open]);
	(0, import_react.useEffect)(() => {
		if (!patientQuery.trim() || patient || !supabase) {
			setPatientResults([]);
			return;
		}
		const q = patientQuery.trim();
		const sb = supabase;
		const timer = setTimeout(async () => {
			const { data } = await sb.from("patients").select("id, full_name, phone").or(`full_name.ilike.%${q}%,phone.ilike.%${q}%`).limit(8);
			setPatientResults(data ?? []);
		}, 250);
		return () => clearTimeout(timer);
	}, [patientQuery, patient]);
	async function submit() {
		if (!supabase) return;
		setError(null);
		setSaving(true);
		let patientId = patient?.id ?? null;
		if (isNewPatient || !patientId) {
			if (newName.trim().length < 2) {
				setError("Enter the patient's full name.");
				setSaving(false);
				return;
			}
			const phone = newPhone.replace(/\s/g, "");
			const { data: existing } = await supabase.from("patients").select("id").eq("phone", phone).maybeSingle();
			if (existing) patientId = existing.id;
			else {
				const { data: created, error: pErr } = await supabase.from("patients").insert({
					full_name: newName.trim(),
					phone: phone || null
				}).select("id").single();
				if (pErr || !created) {
					setError("Could not create patient.");
					setSaving(false);
					return;
				}
				patientId = created.id;
			}
		}
		const slotRes = await getDaySlots({ data: { date } });
		if (!slotRes.ok || !slotRes.slots.includes(time)) {
			setError("That slot is no longer available — pick another time.");
			setSaving(false);
			return;
		}
		const start = cairoToUtc(date, time);
		const end = new Date(start.getTime() + slotMinutes * 6e4).toISOString();
		const { error: aErr } = await supabase.from("appointments").insert({
			patient_id: patientId,
			service_id: serviceId || null,
			dentist_id: dentistId,
			starts_at: start.toISOString(),
			ends_at: end,
			status: "booked",
			source: "admin",
			notes: notes.trim() || null
		});
		setSaving(false);
		if (aErr) {
			setError(aErr.code === "23P01" ? "That time overlaps an existing appointment." : "Could not create appointment.");
			return;
		}
		toast.success("Appointment created");
		onOpenChange(false);
		onCreated();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[90vh] overflow-y-auto sm:max-w-lg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "New appointment" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setIsNewPatient(true),
							className: `rounded-lg px-3 py-1.5 text-xs font-semibold ${isNewPatient ? "bg-deep text-deep-foreground" : "bg-muted text-muted-foreground"}`,
							children: "New patient"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setIsNewPatient(false),
							className: `rounded-lg px-3 py-1.5 text-xs font-semibold ${!isNewPatient ? "bg-deep text-deep-foreground" : "bg-muted text-muted-foreground"}`,
							children: "Existing patient"
						})]
					}), isNewPatient ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "mb-1 block text-xs",
							children: "Full name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: newName,
							onChange: (e) => setNewName(e.target.value),
							className: inputCls
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "mb-1 block text-xs",
							children: "Phone"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: newPhone,
							onChange: (e) => setNewPhone(e.target.value),
							className: inputCls,
							dir: "ltr",
							placeholder: "01xxxxxxxxx"
						})] })]
					}) : patient ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
								className: `${inputCls} ps-9`
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "mb-1 block text-xs",
						children: "Service"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: serviceId,
						onValueChange: setServiceId,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: inputCls,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select service" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: services.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: s.id,
							children: s.name_ar ?? s.name_en
						}, s.id)) })]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "mb-1 block text-xs",
							children: "Date"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: date,
							onChange: (e) => setDate(e.target.value),
							className: inputCls
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "mb-1 block text-xs",
								children: "Time"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: time,
								onValueChange: setTime,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: inputCls,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Available slots" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: slots.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: s,
									children: s
								}, s)) })]
							}),
							date && slots.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "No available slots this day."
							})
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "mb-1 block text-xs",
						children: "Notes (internal)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: notes,
						onChange: (e) => setNotes(e.target.value),
						rows: 2,
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
						children: saving ? "Saving…" : "Create appointment"
					})
				]
			})]
		})
	});
}
/** Edit/reschedule an existing appointment — preserves id, patient, and status history. */
function EditAppointmentDialog({ appointment, dentistId, onClose, onSaved }) {
	const [services, setServices] = (0, import_react.useState)([]);
	const [serviceId, setServiceId] = (0, import_react.useState)(appointment.service_id ?? "");
	const [date, setDate] = (0, import_react.useState)(() => cairoParts(appointment.starts_at).ymd);
	const [time, setTime] = (0, import_react.useState)(() => cairoParts(appointment.starts_at).time);
	const [slots, setSlots] = (0, import_react.useState)([]);
	const [slotMinutes, setSlotMinutes] = (0, import_react.useState)(45);
	const [notes, setNotes] = (0, import_react.useState)(appointment.notes ?? "");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!supabase) return;
		supabase.from("services").select("id, code, name_en, name_ar").eq("active", true).order("sort_order").then(({ data }) => setServices(data ?? []));
		supabase.from("clinic_settings").select("slot_minutes").eq("id", 1).maybeSingle().then(({ data }) => {
			if (data?.slot_minutes) setSlotMinutes(data.slot_minutes);
		});
	}, []);
	(0, import_react.useEffect)(() => {
		if (!date) {
			setSlots([]);
			return;
		}
		getDaySlots({ data: { date } }).then((r) => {
			const list = r.ok ? r.slots : [];
			setSlots(list);
		});
	}, [date]);
	async function submit() {
		if (!supabase) return;
		setError(null);
		setSaving(true);
		const start = cairoToUtc(date, time);
		const end = new Date(start.getTime() + slotMinutes * 6e4).toISOString();
		const { error: aErr } = await supabase.from("appointments").update({
			service_id: serviceId || null,
			starts_at: start.toISOString(),
			ends_at: end,
			notes: notes.trim() || null,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", appointment.id);
		setSaving(false);
		if (aErr) {
			setError(aErr.code === "23P01" ? "That time overlaps an existing appointment." : "Could not update appointment.");
			return;
		}
		toast.success("Appointment updated");
		onClose();
		onSaved();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: true,
		onOpenChange: (v) => !v && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[90vh] overflow-y-auto sm:max-w-lg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Edit appointment" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-muted/40 px-3 py-2.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium text-foreground",
								children: appointment.patients?.full_name ?? "Unknown patient"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								dir: "ltr",
								children: appointment.patients?.phone
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: appointment.status })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "mb-1 block text-xs",
						children: "Service"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: serviceId,
						onValueChange: setServiceId,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: inputCls,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select service" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: services.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: s.id,
							children: s.name_ar ?? s.name_en
						}, s.id)) })]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "mb-1 block text-xs",
							children: "Date"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: date,
							onChange: (e) => setDate(e.target.value),
							className: inputCls
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "mb-1 block text-xs",
							children: "Time"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: time,
							onValueChange: setTime,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: inputCls,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Time" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [!slots.includes(time) && time && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
								value: time,
								children: [time, " (current)"]
							}), slots.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: s,
								children: s
							}, s))] })]
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "mb-1 block text-xs",
						children: "Notes (internal)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: notes,
						onChange: (e) => setNotes(e.target.value),
						rows: 2,
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
						children: saving ? "Saving…" : "Save changes"
					})
				]
			})]
		})
	});
}
/** Convert a clinic-local (Africa/Cairo) date+HH:MM to a UTC Date. */
function cairoToUtc(date, time) {
	const guess = /* @__PURE__ */ new Date(`${date}T${time}:00Z`);
	const cairo = new Intl.DateTimeFormat("en-CA", {
		timeZone: "Africa/Cairo",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false
	}).formatToParts(guess);
	const get = (t) => cairo.find((p) => p.type === t)?.value ?? "0";
	const offsetMs = Date.UTC(+get("year"), +get("month") - 1, +get("day"), +get("hour") % 24, +get("minute"), +get("second")) - guess.getTime();
	return new Date(guess.getTime() - offsetMs);
}
export { AppointmentsPage as component };
