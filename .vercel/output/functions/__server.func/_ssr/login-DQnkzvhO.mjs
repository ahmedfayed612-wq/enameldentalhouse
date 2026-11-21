import { i as __toESM } from "../_runtime.mjs";
import { i as useAdminAuth } from "./auth-B_bEywvQ.mjs";
import { t as isSupabaseConfigured } from "./supabase-CeBPyXVR.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { u as Sparkles } from "../_libs/lucide-react.mjs";
// node_modules/.nitro/vite/services/ssr/assets/login-DQnkzvhO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var inputCls = "w-full min-h-12 rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";
function LoginPage() {
	const { signIn } = useAdminAuth();
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	async function onSubmit(e) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		const { error } = await signIn(email.trim(), password);
		setLoading(false);
		if (error) {
			setError(error);
			return;
		}
		navigate({ to: "/admin" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center bg-muted/40 px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary text-deep",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-7 w-7" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-4 text-2xl font-semibold tracking-tight text-foreground",
							children: "Enamel Admin"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "Sign in to the clinic dashboard"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "card-soft p-6",
					children: !isSupabaseConfigured ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "rounded-xl border border-dashed border-border bg-background/60 p-4 text-center text-sm text-muted-foreground",
						children: [
							"Backend not configured yet. Set ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "VITE_SUPABASE_URL" }),
							" and",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "VITE_SUPABASE_ANON_KEY" }),
							" to enable sign-in."
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-1.5 block text-sm font-medium text-foreground",
									children: "Email"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "email",
									required: true,
									autoComplete: "email",
									value: email,
									onChange: (e) => setEmail(e.target.value),
									className: inputCls,
									dir: "ltr"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-1.5 block text-sm font-medium text-foreground",
									children: "Password"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "password",
									required: true,
									autoComplete: "current-password",
									value: password,
									onChange: (e) => setPassword(e.target.value),
									className: inputCls,
									dir: "ltr"
								})]
							}),
							error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-destructive",
								children: error
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: loading,
								className: "min-h-12 w-full rounded-xl bg-deep px-6 py-3.5 text-sm font-semibold text-deep-foreground transition-opacity hover:opacity-95 disabled:opacity-60",
								children: loading ? "Signing in…" : "Sign in"
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "text-sm font-medium text-primary hover:underline",
						children: "← Back to website"
					})
				})
			]
		})
	});
}
export { LoginPage as component };
