import { createRouter, createWebHistory } from "vue-router"

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/CadastroUsuario",
			name: "cadastroUsuario",
			component: () => import("../pages/CadastroUsuario.vue"),
		},
		{
			path: "/CadastroCRM",
			name: "cadastroCRM",
			component: () => import("../pages/CadastroCRM.vue"),
		},
		{
			path: "/LoginUsuario",
			name: "loginUsuario",
			component: () => import("../pages/LoginUsuario.vue"),
		},
	],
})

export default router
