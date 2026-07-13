//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-t5xYbcJQ.js
var manifest = {
	"923a5261ae4ef344d627d5738bf40c7cf9d0d2df09dff176b88978a9a856c370": {
		functionName: "translateText_createServerFn_handler",
		importer: () => import("./_ssr/translate.functions-qOETrsq-.mjs")
	},
	"c9223e788378c4da8b3382ca5a7173aff91e27f045625ad9151d854469abed7a": {
		functionName: "rephraseText_createServerFn_handler",
		importer: () => import("./_ssr/translate.functions-qOETrsq-.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
