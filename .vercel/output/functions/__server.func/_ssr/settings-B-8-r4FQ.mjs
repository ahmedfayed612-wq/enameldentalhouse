import { i as __toESM } from "../_runtime.mjs";
import { i as useAdminAuth, r as ROLE_LABELS } from "./auth-B_bEywvQ.mjs";
import { n as supabase } from "./supabase-CeBPyXVR.mjs";
import { n as RequireAuth, t as AdminShell } from "./RequireAuth-BHe8WxJC.mjs";
import { t as Button } from "./button-BScraxvU.mjs";
import { n as Label, t as Input } from "./label-DEg0xxET.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { g as Save } from "../_libs/lucide-react.mjs";
import { t as toast } from "../_libs/sonner.mjs";
// node_modules/.nitro/vite/services/ssr/assets/settings-B-8-r4FQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var WEEKDAYS = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday"
];
var inputCls = "w-full min-h-11 rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";
function SettingsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireAuth, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsInner, {}) }) });
}
function SettingsInner() {
	const { state } = useAdminAuth();
	const role = state.status === "signed_in" ? state.profile?.role ?? null : null;
	const canEdit = role === "owner";
	const [settings, setSettings] = (0, import_react.useState)(null);
	const [hours, setHours] = (0, import_react.useState)([]);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const load = (0, import_react.useCallback)(async () => {
		if (!supabase) return;
		const [sRes, hRes] = await Promise.all([supabase.from("clinic_settings").select("*").eq("id", 1).maybeSingle(), supabase.from("working_hours").select("id, weekday, is_closed, open_time, close_time").order("weekday")]);
		if (sRes.data) {
			const s = sRes.data;
			setSettings({
				name: s.name,
				name_ar: s.name_ar,
				phone: s.phone,
				whatsapp: s.whatsapp,
				address: s.address,
				maps_url: s.maps_url,
				slot_minutes: s.slot_minutes,
				open_hour: s.open_hour,
				close_hour: s.close_hour
			});
		}
		setHours(hRes.data ?? []);
		setLoading(false);
	}, []);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	async function saveAll() {
		if (!supabase || !settings) return;
		setSaving(true);
		const { error } = await supabase.from("clinic_settings").update({
			name: settings.name,
			name_ar: settings.name_ar || null,
			phone: settings.phone || null,
			whatsapp: settings.whatsapp,
			address: settings.address || null,
			maps_url: settings.maps_url || null,
			slot_minutes: settings.slot_minutes,
			open_hour: settings.open_hour,
			close_hour: settings.close_hour,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", 1);
		if (error) {
			setSaving(false);
			toast.error("Could not save settings");
			return;
		}
		for (const h of hours) {
			const { error: hErr } = await supabase.from("working_hours").update({
				is_closed: h.is_closed,
				open_time: h.is_closed ? null : h.open_time ?? "12:00",
				close_time: h.is_closed ? null : h.close_time ?? "22:00"
			}).eq("id", h.id);
			if (hErr) {
				setSaving(false);
				toast.error("Clinic settings saved, but working hours failed");
				return;
			}
		}
		setSaving(false);
		toast.success("Settings saved");
	}
	if (loading || !settings) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-40 animate-pulse rounded-lg bg-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-6 h-64 animate-pulse rounded-2xl bg-muted" })]
	});
	const set = (k, v) => setSettings((s) => s ? {
		...s,
		[k]: v
	} : s);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold tracking-tight text-foreground",
				children: "Settings"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: ["Clinic profile, booking rules and working hours.", !canEdit && ` (read-only — ${ROLE_LABELS[role ?? "receptionist"]} role)`]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card-soft mt-6 space-y-4 p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-base font-semibold text-foreground",
					children: "Clinic profile"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "mb-1 block text-xs",
							children: "Name (English)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: settings.name,
							onChange: (e) => set("name", e.target.value),
							disabled: !canEdit,
							className: inputCls
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "mb-1 block text-xs",
							children: "Name (Arabic)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: settings.name_ar ?? "",
							onChange: (e) => set("name_ar", e.target.value),
							disabled: !canEdit,
							className: inputCls,
							dir: "rtl"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "mb-1 block text-xs",
							children: "Phone"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: settings.phone ?? "",
							onChange: (e) => set("phone", e.target.value),
							disabled: !canEdit,
							className: inputCls,
							dir: "ltr"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "mb-1 block text-xs",
							children: "WhatsApp (digits with country code)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: settings.whatsapp,
							onChange: (e) => set("whatsapp", e.target.value),
							disabled: !canEdit,
							className: inputCls,
							dir: "ltr"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sm:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "mb-1 block text-xs",
								children: "Address"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: settings.address ?? "",
								onChange: (e) => set("address", e.target.value),
								disabled: !canEdit,
								className: inputCls
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sm:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "mb-1 block text-xs",
								children: "Google Maps URL"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: settings.maps_url ?? "",
								onChange: (e) => set("maps_url", e.target.value),
								disabled: !canEdit,
								className: inputCls,
								dir: "ltr",
								placeholder: "https://maps.google.com/…"
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card-soft mt-6 space-y-4 p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-base font-semibold text-foreground",
						children: "Booking rules"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "mb-1 block text-xs",
								children: "Slot length (minutes)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: 15,
								max: 120,
								value: settings.slot_minutes,
								onChange: (e) => set("slot_minutes", Number(e.target.value)),
								disabled: !canEdit,
								className: inputCls
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "mb-1 block text-xs",
								children: "Opens at (hour)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: 0,
								max: 23,
								value: settings.open_hour,
								onChange: (e) => set("open_hour", Number(e.target.value)),
								disabled: !canEdit,
								className: inputCls
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "mb-1 block text-xs",
								children: "Closes at (hour)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: 1,
								max: 24,
								value: settings.close_hour,
								onChange: (e) => set("close_hour", Number(e.target.value)),
								disabled: !canEdit,
								className: inputCls
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Note: public availability uses per-weekday working hours below; open/close hour is the fallback window."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card-soft mt-6 space-y-3 p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-base font-semibold text-foreground",
					children: "Working hours"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-border",
					children: hours.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-wrap items-center gap-3 py-2.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-24 text-sm font-medium text-foreground",
								children: WEEKDAYS[h.weekday]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 text-sm text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: h.is_closed,
									disabled: !canEdit,
									onChange: (e) => setHours((hs) => hs.map((x) => x.id === h.id ? {
										...x,
										is_closed: e.target.checked
									} : x)),
									className: "h-4 w-4 accent-primary"
								}), "Closed"]
							}),
							!h.is_closed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								dir: "ltr",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "time",
										value: (h.open_time ?? "12:00").slice(0, 5),
										disabled: !canEdit,
										onChange: (e) => setHours((hs) => hs.map((x) => x.id === h.id ? {
											...x,
											open_time: e.target.value
										} : x)),
										className: "w-28"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: "→"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "time",
										value: (h.close_time ?? "22:00").slice(0, 5),
										disabled: !canEdit,
										onChange: (e) => setHours((hs) => hs.map((x) => x.id === h.id ? {
											...x,
											close_time: e.target.value
										} : x)),
										className: "w-28"
									})
								]
							})
						]
					}, h.id))
				})]
			}),
			canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 flex gap-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: saveAll,
					disabled: saving,
					className: "bg-deep text-deep-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "me-1 h-4 w-4" }), saving ? "Saving…" : "Save all"]
				})
			})
		]
	});
}
export { SettingsPage as component };
