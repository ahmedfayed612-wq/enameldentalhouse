import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./server-5IeYenoQ.mjs";
// node_modules/.nitro/vite/services/ssr/assets/booking.functions-BdB0CgT2.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
/** Public: available "HH:MM" clinic-local slots for a YYYY-MM-DD date. */
var getDaySlots = createServerFn({ method: "GET" }).validator((input) => input).handler(createSsrRpc("408726e0dd7c98a1e18cb0cdd020db0594fced5aa6113e008b2d1e8ce2a912ed"));
/** Public: create a web booking. All validation/conflict checks are in the DB function. */
var submitBooking = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("4ced895525f4d44d99fd1ed940c1ff3677d98cc2334551a579fa5fe047b84d7d"));
export { getDaySlots as n, submitBooking as r, createSsrRpc as t };
