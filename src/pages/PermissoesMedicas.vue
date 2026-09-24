<script setup lang="ts">
import { ref } from "vue"
import NavBar from "@/components/NavBar.vue"
import BaseInput from "@/components/bases/BaseInput.vue"
import { type Exam } from "@/models/examModel"
import { getExams } from "@/services/examService"
import { useAuthStore } from "@/stores/authStore"
import UserPhoto from "@/components/UserPhoto.vue"
import BaseButton from "@/components/bases/BaseButton.vue"

const VisuPermissao = ref(false)

const authStore = useAuthStore()

const exames = ref<Exam[]>([])

authStore.onReady(async (user) => {
	exames.value = await getExams(user.id)
})

function toggleVisuperm() {
	VisuPermissao.value = !VisuPermissao.value
}


</script>

<template>
	<div class="flex h-screen">
		<NavBar />

		<main class="w-full h-full overflow-clip px-6 py-8">
			<header class="mb-16 flex flex-col gap-8">
				<h1 class="text-4xl text-textLight font-bold text-center lg:text-start">
					Meus Exames
				</h1>

				<BaseInput
					placeholder="Pesquisar"
					icon="search"
					class="place-self-center w-full md:w-120"
				/>
				<article class="w-full flex justify-center">
					<section class="relative flex w-[40%] min-h-11 items-center border border-textlight text-sm text-textlight rounded-[15px] text-textLight">
						<span class="material-symbols-rounded pointer-events-none absolute left-3">
							shield
						</span>
						<div class="w-full text-center">
							<p>
								Controle quais profissionais da saúde podem acessar seu histórico.
							</p>
						</div>
					</section>
				</article>
			</header>

			<article class="flex flex-col items-center">
				<div class="grid grid-cols-2 w-[75%] border border-textLight rounded-lg px-8 py-2 items-center">
					<section class="flex">
						<UserPhoto />

						<div class="flex flex-col items-center ml-6">
							<p class="text-xl text-textLight mt-2">
								Cláudia Silva
							</p>
							<div class="grid grid-cols-2 mt-1">
								<section class="flex flex-col text-accent items-center">
									<span class="material-symbols-rounded pointer-events-none text-base!">
										chat
									</span>
									<p class="text-[10px]">
										Mensagens
									</p>
								</section>
								<section class="flex flex-col text-accent items-center">
									<span class="material-symbols-rounded pointer-events-none text-base!">
										mail
									</span>
									<p class="text-[10px]">
										E-mail
									</p>
								</section>
							</div>
						</div>

					</section>

					<section class="grid grid-cols-11 gap-2 mr-4 relative">
						<BaseButton class="col-span-5">
							<p class="text-base text-textLight">
								Consultas
							</p>
						</BaseButton>

						<BaseButton class="col-span-5">
							<p class="text-base text-textLight">
								Prontuario
							</p>
						</BaseButton>

						<div class="flex justify-center items-center">
							<button type="button" @click="toggleVisuperm()" class="absolute right cursor-pointer ml-10">
								<span class="material-symbols-rounded text-textLight text-4xl!">
									{{VisuPermissao ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}
								</span>
							</button>
						</div>

					</section>
				</div>
			</article>
		</main>
	</div>
</template>
