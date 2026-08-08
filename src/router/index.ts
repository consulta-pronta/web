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
        },
		{
            path: '/CadastroWebProfissionalCRM',
            name: 'cadastroProfissionalCRM',
            component: () => import('../CadastroWebProfissionalCRM.vue')
        }
	],
})

export default router
