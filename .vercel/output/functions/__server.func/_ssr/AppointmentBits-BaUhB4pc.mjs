import { t as Button } from "./button-BScraxvU.mjs";
import { a as fmtTime, n as STATUS_META, t as NEXT_STATUS } from "./appointments-BcksnCrJ.mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
// node_modules/.nitro/vite/services/ssr/assets/AppointmentBits-BaUhB4pc.js
var import_jsx_runtime = require_jsx_runtime();
var APPOINTMENT_SELECT = "id, starts_at, ends_at, status, source, notes, dentist_id, service_id, patients(full_name, phone), services(code, name_en, name_ar)";
function StatusPill({ status }) {
	const meta = STATUS_META[status];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${meta.cls}`,
		children: meta.label
	});
}
function AppointmentItem({ a, onStatus, onEdit, compact }) {
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
					!compact && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
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
					}),
					onEdit && ![
						"completed",
						"cancelled",
						"no_show"
					].includes(a.status) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						onClick: () => onEdit(a),
						children: "Edit"
					})
				]
			})
		]
	});
}
export { AppointmentItem as n, StatusPill as r, APPOINTMENT_SELECT as t };
