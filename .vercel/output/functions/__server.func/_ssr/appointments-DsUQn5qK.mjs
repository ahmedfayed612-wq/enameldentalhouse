import { i as __toESM } from "../_runtime.mjs";
import { i as useAdminAuth } from "./auth-B_bEywvQ.mjs";
import { n as supabase } from "./supabase-CeBPyXVR.mjs";
import { n as RequireAuth, r as cn, t as AdminShell } from "./RequireAuth-D5wdH0uK.mjs";
import { n as getDaySlots } from "./booking.functions-BdB0CgT2.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { i as Slot, s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { A as ChevronUp, M as ChevronLeft, N as ChevronDown, P as Check, f as Search, j as ChevronRight, m as Plus, t as X } from "../_libs/lucide-react.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { t as Label$1 } from "../_libs/radix-ui__react-label.mjs";
import { a as SelectItemIndicator, c as SelectPortal, d as SelectSeparator$1, f as SelectTrigger$1, i as SelectItem$1, l as SelectScrollDownButton$1, m as SelectViewport, n as SelectContent$1, o as SelectItemText, p as SelectValue$1, r as SelectIcon, s as SelectLabel$1, t as Select$1, u as SelectScrollUpButton$1 } from "../_libs/@radix-ui/react-select+[...].mjs";
import { t as toast } from "../_libs/sonner.mjs";
// node_modules/.nitro/vite/services/ssr/assets/appointments-DsUQn5qK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Forward transitions allowed from each status (plus cancelled/no_show handled separately). */
var NEXT_STATUS = {
	booked: "confirmed",
	confirmed: "arrived",
	arrived: "waiting",
	waiting: "in_treatment",
	in_treatment: "completed"
};
var STATUS_META = {
	booked: {
		label: "Booked",
		cls: "bg-secondary text-deep"
	},
	confirmed: {
		label: "Confirmed",
		cls: "bg-primary-soft text-deep"
	},
	arrived: {
		label: "Arrived",
		cls: "bg-primary/20 text-deep"
	},
	waiting: {
		label: "Waiting",
		cls: "bg-amber-100 text-amber-800"
	},
	in_treatment: {
		label: "In treatment",
		cls: "bg-deep text-deep-foreground"
	},
	completed: {
		label: "Completed",
		cls: "bg-mint text-deep"
	},
	cancelled: {
		label: "Cancelled",
		cls: "bg-muted text-muted-foreground line-through"
	},
	no_show: {
		label: "No-show",
		cls: "bg-destructive/10 text-destructive"
	}
};
var TZ = "Africa/Cairo";
function cairoParts(iso) {
	const d = new Date(iso);
	const parts = new Intl.DateTimeFormat("en-CA", {
		timeZone: TZ,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
		weekday: "short"
	}).formatToParts(d);
	const get = (t) => parts.find((p) => p.type === t)?.value ?? "";
	return {
		ymd: `${get("year")}-${get("month")}-${get("day")}`,
		time: `${get("hour") === "24" ? "00" : get("hour")}:${get("minute")}`,
		weekday: get("weekday")
	};
}
function fmtTime(iso) {
	return cairoParts(iso).time;
}
function addDaysYmd(ymdStr, days) {
	const d = /* @__PURE__ */ new Date(`${ymdStr}T12:00:00Z`);
	d.setUTCDate(d.getUTCDate() + days);
	return d.toISOString().slice(0, 10);
}
function todayYmd() {
	return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(/* @__PURE__ */ new Date());
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label$1, {
	ref,
	className: cn(labelVariants(), className),
	...props
}));
Label.displayName = Label$1.displayName;
var Select = Select$1;
var SelectValue = SelectValue$1;
var SelectTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
	ref,
	className: cn("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 opacity-50" })
	})]
}));
SelectTrigger.displayName = SelectTrigger$1.displayName;
var SelectScrollUpButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4" })
}));
SelectScrollUpButton.displayName = SelectScrollUpButton$1.displayName;
var SelectScrollDownButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" })
}));
SelectScrollDownButton.displayName = SelectScrollDownButton$1.displayName;
var SelectContent = import_react.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent$1, {
	ref,
	className: cn("relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
	position,
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, {
			className: cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton, {})
	]
}) }));
SelectContent.displayName = SelectContent$1.displayName;
var SelectLabel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectLabel$1, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", className),
	...props
}));
SelectLabel.displayName = SelectLabel$1.displayName;
var SelectItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
	ref,
	className: cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, { children })]
}));
SelectItem.displayName = SelectItem$1.displayName;
var SelectSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectSeparator$1, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
SelectSeparator.displayName = SelectSeparator$1.displayName;
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
var inputCls = "w-full min-h-11 rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";
function StatusPill({ status }) {
	const meta = STATUS_META[status];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${meta.cls}`,
		children: meta.label
	});
}
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
	const [dentistId, setDentistId] = (0, import_react.useState)(null);
	const days = (0, import_react.useMemo)(() => view === "day" ? [cursor] : Array.from({ length: 7 }, (_, i) => addDaysYmd(cursor, i)), [view, cursor]);
	const load = (0, import_react.useCallback)(async () => {
		if (!supabase) return;
		setLoading(true);
		const from = addDaysYmd(days[0], -2);
		const to = addDaysYmd(days[days.length - 1], 3);
		const { data, error } = await supabase.from("appointments").select("id, starts_at, ends_at, status, source, notes, patients(full_name, phone), services(code, name_en, name_ar)").gte("starts_at", `${from}T00:00:00Z`).lt("starts_at", `${to}T00:00:00Z`).order("starts_at");
		setLoading(false);
		if (error) {
			toast.error("Failed to load appointments");
			return;
		}
		const wanted = new Set(days);
		setRows((data ?? []).filter((r) => wanted.has(cairoParts(r.starts_at).ymd)));
	}, [days]);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	(0, import_react.useEffect)(() => {
		if (!supabase || dentistId) return;
		supabase.from("dentists").select("id").eq("active", true).order("created_at").limit(1).maybeSingle().then(({ data }) => setDentistId(data?.id ?? null));
	}, [dentistId]);
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
	function shift(daysCount) {
		setCursor((c) => addDaysYmd(c, daysCount));
	}
	const byDay = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const d of days) map.set(d, []);
		for (const r of rows) {
			const key = cairoParts(r.starts_at).ymd;
			map.get(key)?.push(r);
		}
		for (const list of map.values()) list.sort((a, b) => a.starts_at.localeCompare(b.starts_at));
		return map;
	}, [rows, days]);
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
					children: view === "day" ? cursor : `${days[0]} → ${days[6]}`
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex rounded-xl border border-border bg-card p-1",
							children: ["day", "week"].map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									setView(v);
									if (v === "week" && cursor !== todayYmd()) setCursor(cursor);
								},
								className: `rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors ${view === v ? "bg-deep text-deep-foreground" : "text-muted-foreground hover:bg-muted"}`,
								children: v
							}, v))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "icon",
							onClick: () => shift(view === "day" ? -1 : -7),
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
							onClick: () => shift(view === "day" ? 1 : 7),
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
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 space-y-3",
				children: [
					0,
					1,
					2,
					3
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-16 animate-pulse rounded-2xl bg-muted" }, i))
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
								onStatus: setStatus
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
			})
		]
	});
}
function AppointmentItem({ a, onStatus }) {
	const next = NEXT_STATUS[a.status];
	const canNoShow = a.status === "arrived" || a.status === "waiting";
	const canCancel = ![
		"completed",
		"cancelled",
		"no_show"
	].includes(a.status);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "w-14 shrink-0 text-sm font-semibold tabular-nums text-foreground",
				dir: "ltr",
				children: fmtTime(a.starts_at)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-sm font-medium text-foreground",
						children: a.patients?.full_name ?? "Unknown patient"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "truncate text-xs text-muted-foreground",
						children: [
							a.services ? a.services.name_ar ?? a.services.name_en : "Service",
							a.patients?.phone ? ` · ${a.patients.phone}` : "",
							a.source === "web" && " · web"
						]
					}),
					a.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 truncate text-xs italic text-muted-foreground",
						children: a.notes
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: a.status }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5",
				children: [
					next && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "secondary",
						onClick: () => onStatus(a, next),
						children: ["→ ", STATUS_META[next].label]
					}),
					canNoShow && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => onStatus(a, "no_show"),
						children: "No-show"
					}),
					canCancel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						className: "text-destructive hover:bg-destructive/10",
						onClick: () => {
							if (window.confirm("Cancel this appointment?")) onStatus(a, "cancelled");
						},
						children: "Cancel"
					})
				]
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
		services.find((s) => s.id === serviceId);
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
