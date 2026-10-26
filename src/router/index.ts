import type { UserType } from "@/utils"
import { auth } from "@/database/firebase"
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
			component: () => import("@/pages/auth/SignUpPage.vue"),
			meta: {
				roles: [],
			},
		},
		{
			path: "/login",
			name: "login",
			component: () => import("@/pages/auth/LoginPage.vue"),
			meta: {
				roles: [],
			},
		},
		{
			path: "/recuperar-senha",
			name: "recuperar-senha",
			component: () => import("@/pages/auth/PasswordRecoveryPage.vue"),
			meta: {
				roles: [],
			},
		},
		{
			path: "/dashboard",
			name: "dashboard",
			component: () => import("@/pages/DashboardPage.vue"),
			meta: {
				roles: ["patient", "professional", "admin"],
			},
		},
		{
			path: "/exames",
			name: "exames",
			component: () => import("@/pages/ExamsPage.vue"),
			meta: {
				roles: ["patient", "professional"],
			},
		},
		{
			path: "/historico-sintomas/:id?",
			name: "historico-sintomas",
			alias: ["/historico", "/sintomas"],
			component: () => import("@/pages/SymptomHistoryPage.vue"),
			meta: {
				roles: ["patient"],
			},
		},
		{
			path: "/relatorios",
			name: "relatorios",
			component: () => import("@/pages/ReportsPage.vue"),
			meta: {
				roles: ["patient", "professional"],
			},
		},
		{
			path: "/permissoes-medicas",
			name: "medical-permissions",
			alias: ["/permissoes"],
			component: () => import("@/pages/MedicalPermissionsPage.vue"),
			meta: {
				roles: ["patient"],
			},
		},
		{
			path: "/pacientes/:id?",
			name: "pacientes",
			component: () => import("@/pages/ProfessionalPatientsPage.vue"),
			meta: {
				roles: ["professional"],
			},
		},
		{
			path: "/:catchAll(.*)",
			name: "not-found",
			component: () => import("@/pages/NotFoundPage.vue"),
		},
		{
			path: "/relatoriosPro",
			name: "relatoriosPro",
			component: () => import("@/pages/RelatoriosProfissional.vue"),
			meta: {
				roles: ["professional"],
			},
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

	const isAuthenticated = user !== null
	const needsAuth = roles.length !== 0

	if (needsAuth && !isAuthenticated) {
		return "/login"
	} else if (!needsAuth && isAuthenticated) {
		return "/dashboard"
	}

	if (needsAuth) {
		let userType: UserType | undefined
		await authStore.onReady((data) => {
			userType = data.user_type
		})
		if (!userType || !roles.includes(userType)) {
			return "/dashboard"
		}
	}

	return
})

export default router
