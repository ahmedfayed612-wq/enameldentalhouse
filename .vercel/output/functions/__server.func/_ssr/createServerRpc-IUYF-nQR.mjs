import { i as TSS_SERVER_FUNCTION } from "./server-BLPv3tDv.mjs";
// node_modules/.nitro/vite/services/ssr/assets/createServerRpc-IUYF-nQR.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
export { createServerRpc as t };
