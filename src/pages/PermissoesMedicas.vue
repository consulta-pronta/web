<script setup lang="ts">
import { ref } from "vue"
import NavBar from "@/components/NavBar.vue"
import BaseInput from "@/components/bases/BaseInput.vue"
import { type Exam } from "@/models/examModel"
import { getExams } from "@/services/examService"
import { useAuthStore } from "@/stores/authStore"
import PermissionCard from "@/components/cards/PermissionCard.vue"

const authStore = useAuthStore()

const exames = ref<Exam[]>([])

const profissionais = [
	{ id: 1, nome: "Cláudia Silva" },
	{ id: 2, nome: "Fernando Silva" },
	{ id: 3, nome: "Fernando Silva" },
	{ id: 3, nome: "Fernando Silva" },
	{ id: 3, nome: "Fernando Silva" },
]

authStore.onReady(async (user) => {
	exames.value = await getExams(user.id)
})
</script>

<template>
	<div class="flex h-screen">
		<NavBar />

		<main class="w-full h-full overflow-hidden px-6 py-8 flex flex-col">
			<header class="mb-4 flex flex-col gap-8">
				<h1 class="text-4xl text-textLight font-bold text-center lg:text-start">
					Meus Exames
				</h1>

				<BaseInput
					placeholder="Pesquisar"
					icon="search"
					class="place-self-center w-full md:w-120"
				/>

				<article class="w-full flex justify-center">
					<section
						class="relative flex w-[85%] md:w-[70%] lg:w-[45%] min-h-11 items-center border border-textLight text-sm text-textLight rounded-[15px]"
					>
						<span class="material-symbols-rounded pointer-events-none absolute left-3">
							shield
						</span>

						<div class="w-full text-center text-sm lg:text-[13px]">
							<p>
								Controle quais profissionais da saúde podem acessar seu histórico.
							</p>
						</div>
					</section>
				</article>
			</header>

			<article class="flex flex-col items-center gap-4 flex-1 min-h-0 overflow-y-auto scrollbar-hide">
				<PermissionCard
					v-for="profissional in profissionais"
					:key="profissional.id"
					:nome="profissional.nome"
				/>
			</article>
		</main>
	</div>
</template>
