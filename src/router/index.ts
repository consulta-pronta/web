import { createRouter, createWebHistory } from "vue-router"

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "root",
			component: () => import("@/pages/LandingPage.vue")
		},
		{
			path: "/cadastro",
			name: "cadastro",
			component: () => import("@/pages/CadastroUsuario.vue"),
		},
		{
			path: "/login",
			name: "login",
			component: () => import("@/pages/LoginUsuario.vue"),
		},
		{
			path: "/dashboard",
			name: "dashboard",
			component: () => import("@/pages/DashboardUsuario.vue"),
		},
		{
			path: "/HistoricoUsuario",
			name: "Historico",
			component: () => import("../pages/HistoricoUsuario.vue"),
		},
		{
			path: "/ExamesUsuario",
			name: "Exame",
			component: () => import("../pages/ExamesUsuario.vue"),
			path: "/historico-sintomas",
			name: "historico-sintomas",
			alias: ["/historico", "/sintomas"],
			component: () => import("@/pages/HistoricoUsuario.vue"),
		}
	],
})

export default router
