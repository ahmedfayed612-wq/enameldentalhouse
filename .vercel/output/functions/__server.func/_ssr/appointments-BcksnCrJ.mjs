// node_modules/.nitro/vite/services/ssr/assets/appointments-BcksnCrJ.js
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
export { fmtTime as a, cairoParts as i, STATUS_META as n, todayYmd as o, addDaysYmd as r, NEXT_STATUS as t };
