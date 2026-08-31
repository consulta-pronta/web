import type { UserType } from "@/components/ToggleUser.vue"
import { auth } from "@/config/firebase"
import { useAuthStore } from "@/stores/authStore"
import { createRouter, createWebHistory } from "vue-router"

/*
meta.roles values explained:
	- undefined: doesn't need auth
	- null: must not be authenticated
	- UserType[]: must be authenticated as one of the values of the list
*/
const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "root",
			component: () => import("@/pages/LandingPage.vue"),
		},
		{
			path: "/cadastro",
			name: "cadastro",
			component: () => import("@/pages/authentication/CadastroUsuario.vue"),
			meta: {
				roles: [],
			},
		},
		{
			path: "/login",
			name: "login",
			component: () => import("@/pages/authentication/LoginUsuario.vue"),
			meta: {
				roles: [],
			},
		},
		{
			path: "/recuperar-senha",
			name: "recuperar-senha",
			component: () => import("@/pages/authentication/RecuperarSenha.vue"),
			meta: {
				roles: [],
			},
		},
		{
			path: "/dashboard",
			name: "dashboard",
			component: () => import("@/pages/DashboardUsuario.vue"),
			meta: {
				roles: ["paciente", "profissional"],
			},
		},
		{
			path: "/exames",
			name: "exames",
			component: () => import("../pages/ExamesUsuario.vue"),
			meta: {
				roles: ["paciente"],
			},
		},
		{
			path: "/historico-sintomas",
			name: "historico-sintomas",
			alias: ["/historico", "/sintomas"],
			component: () => import("@/pages/HistoricoUsuario.vue"),
			meta: {
				roles: ["paciente"],
			},
		},
		{
			path: "/:catchAll(.*)",
			name: "not-found",
			component: () => import("@/pages/NotFound.vue"),
		},
	],
})

router.beforeEach(async (to) => {
	const roles = to.meta.roles as undefined | UserType[]
	if (roles === undefined) {
		return
	}

	await auth.authStateReady()
	const user = auth.currentUser

	const authStore = useAuthStore()
	authStore.setUser(user)

	const needsAuth = roles.length !== 0
	const isAuthenticated = user !== null

	if (needsAuth && !isAuthenticated) {
		return "/login"
	} else if (!needsAuth && isAuthenticated) {
		return "/dashboard"
	} else {
		return
	}
})

export default router
