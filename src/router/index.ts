import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
            path: '/CadastroWebPaciente',
            name: 'cadastroPaciente',
            component: () => import('../CadastroWebPaciente.vue')
        },
        {
            path: '/CadastroWebProfissional',
            name: 'cadastroProfissional',
            component: () => import('../CadastroWebProfissional.vue')
        }
	],
})

export default router
