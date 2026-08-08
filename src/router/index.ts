import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
            path: '/cadastroWebPaciente',
            name: 'cadastroPaciente',
            component: () => import('../CadastroWebPaciente.vue')
        },
        {
            path: '/cadastroWebProfissional',
            name: 'cadastroProfissional',
            component: () => import('../CadastroWebProfissional.vue')
        }
	],
})

export default router
