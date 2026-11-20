import { i as TSS_SERVER_FUNCTION } from "./server-5IeYenoQ.mjs";
// node_modules/.nitro/vite/services/ssr/assets/createServerRpc-CAF9qx9o.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
export { createServerRpc as t };
