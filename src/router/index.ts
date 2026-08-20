import { createRouter, createWebHistory } from "vue-router"

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/Cadastro",
			name: "cadastro",
			component: () => import("../pages/CadastroUsuario.vue"),
		},
		{
			path: "/CadastroCRM",
			name: "cadastroCRM",
			component: () => import("../pages/CadastroCRM.vue"),
		},
		{
			path: "/Login",
			name: "login",
			component: () => import("../pages/LoginUsuario.vue"),
		},
		{
			path: "/Dashboard",
			name: "dashboard",
			component: () => import("../pages/DashboardUsuario.vue"),
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
		}
	],
})

export default router
