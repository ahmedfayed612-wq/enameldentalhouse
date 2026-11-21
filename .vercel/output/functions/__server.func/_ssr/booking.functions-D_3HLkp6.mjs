import { t as createServerRpc } from "./createServerRpc-IUYF-nQR.mjs";
import { r as createServerFn } from "./server-BLPv3tDv.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
// node_modules/.nitro/vite/services/ssr/assets/booking.functions-D_3HLkp6.js
var url = process.env.VITE_SUPABASE_URL;
var anonKey = process.env.VITE_SUPABASE_ANON_KEY;
function db() {
	if (!url || !anonKey) return null;
	return createClient(url, anonKey, { auth: { persistSession: false } });
}
var getDaySlots_createServerFn_handler = createServerRpc({
	id: "408726e0dd7c98a1e18cb0cdd020db0594fced5aa6113e008b2d1e8ce2a912ed",
	name: "getDaySlots",
	filename: "src/lib/booking.functions.ts"
}, (opts) => getDaySlots.__executeServer(opts));
var getDaySlots = createServerFn({ method: "GET" }).validator((input) => input).handler(getDaySlots_createServerFn_handler, async ({ data }) => {
	const client = db();
	if (!client) return {
		ok: false,
		slots: [],
		error: "unconfigured"
	};
	if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date)) return {
		ok: false,
		slots: [],
		error: "bad_date"
	};
	const { data: rows, error } = await client.rpc("get_day_slots", { p_date: data.date });
	if (error) {
		console.error("get_day_slots failed", error);
		return {
			ok: false,
			slots: [],
			error: "fetch_failed"
		};
	}
	return {
		ok: true,
		slots: (rows ?? []).map((r) => String(r.slot ?? "").slice(0, 5)).filter(Boolean)
	};
});
var submitBooking_createServerFn_handler = createServerRpc({
	id: "4ced895525f4d44d99fd1ed940c1ff3677d98cc2334551a579fa5fe047b84d7d",
	name: "submitBooking",
	filename: "src/lib/booking.functions.ts"
}, (opts) => submitBooking.__executeServer(opts));
var submitBooking = createServerFn({ method: "POST" }).validator((input) => input).handler(submitBooking_createServerFn_handler, async ({ data }) => {
	const client = db();
	if (!client) return {
		ok: false,
		error: "unconfigured"
	};
	const { data: res, error } = await client.rpc("book_appointment", {
		p_name: data.name,
		p_phone: data.phone,
		p_service_code: data.service,
		p_date: data.date,
		p_time: data.time,
		p_notes: data.notes ?? null
	});
	if (error) {
		console.error("book_appointment failed", error);
		return {
			ok: false,
			error: "server_error"
		};
	}
	const r = res;
	if (!r?.ok) return {
		ok: false,
		error: r?.error ?? "unknown"
	};
	return {
		ok: true,
		appointmentId: r.appointment_id
	};
});
export { getDaySlots_createServerFn_handler, submitBooking_createServerFn_handler };
