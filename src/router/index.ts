import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
            path: '/CadastroWeb',
            name: 'cadastroWeb',
            component: () => import('../CadastroWeb.vue')
        },
		{
            path: '/CadastroWebCRM',
            name: 'cadastroCRM',
            component: () => import('../CadastroWebCRM.vue')
        },
        {
            path: '/Login',
            name: 'login',
            component: () => import('../Login.vue')
        }
	],
})

export default router
