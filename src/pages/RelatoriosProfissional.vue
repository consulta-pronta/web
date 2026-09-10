<script setup lang="ts">
import { ref } from "vue"
import NavBar from "@/components/NavBar.vue"
import BaseInput from "@/components/bases/BaseInput.vue"
import { useAuthStore } from "@/stores/authStore"
import { getAllSymptoms, type Symptom } from "@/services/symptomService"
import SymptomExtended from "@/components/SymptomExtended.vue"
import UserCard from "@/components/cards/UserCard.vue"
import UserPhoto from "@/components/UserPhoto.vue"

const authStore = useAuthStore()

const currentUser = ref(false)

const symptoms = ref<Symptom[]>([])
const currentSymptom = ref<Symptom | null>(null)

// Dados do usuário logado, exibidos no cartão do topo
interface LoggedUser {
	name: string
	cpf: string
	photoUrl?: string
}

const user = ref<LoggedUser | null>(null)

function toggleCurrentUser() {
	currentUser.value = !currentUser.value
}


const updateSymptoms = async (id: string) => {
	symptoms.value = await getAllSymptoms(id)
}

const viewSymptom = (symptom: Symptom | null) => {
	currentSymptom.value = symptom
}

authStore.onReady(async (data) => {
	user.value = {
		name: data.name,
		cpf: data.cpf,
		photoUrl: data.photoUrl,
	}
	updateSymptoms(data.id)
})
</script>

<template class="justify-end">
	<main class="flex h-screen overflow-hidden">
		<NavBar />

		<article class="flex-1 min-w-0 h-screen overflow-hidden">
			<div class="bg-background w-full h-full flex flex-col min-h-0 px-6 py-8">

				<p class="text-3xl md:text-4xl text-textLight font-bold h-20.25 text-center lg:text-left">Relatórios</p>

				<div class="grid items-center justify-center">

					<!--Barra de pesquisa-->
					<BaseInput
						placeholder="Pesquisar"
						icon="search"
						theme="light"
						class="w-full md:w-2xl"
					></BaseInput>
				</div>

				<!-- Content -->
				<section
					class="max-h-full overflow-hidden flex gap-8 px-6 py-20 scrollbar-track-transparent scrollbar-thumb-accent"
				>
					<!-- List -->
					<ul
						class="w-full lg:w-max max-h-full overflow-hidden flex flex-col gap-2 overflow-y-auto"
						:class="[!currentSymptom ? '' : 'hidden lg:flex']"
					>


						<button type="button" @click="toggleCurrentUser()" class="flex rounded-md p-3 bg-textLight text-primaryDark">
							<UserPhoto />

							<section class="flex flex-col">
								<p class="font-bold oneliner">
									Cláudio
								</p>

								<p class="italic oneliner">
									cpf: 133243
								</p>
							</section>

							<!-- <p class="py-1 px-2 bg-accent w-fit rounded-md">
								<span class="material-symbols-rounded text-sm!">
									location_on
								</span>
								{{ symptom?.place ?? "Local" }}
							</p> -->
						</button>


					</ul>

					<!-- Details -->
					<section class="grow h-full flex flex-col items-start" v-show="currentUser">
						<button type="button" class="cursor-pointer text-textLight" @click="viewSymptom(null)">
							<span class="material-symbols-rounded text-3xl!">
								arrow_back
							</span>
						</button>

						<article class="bg-surface text-textDark p-3 rounded-xl">
							<details class="relative">
								<summary class="list-none cursor-help">
									<h2 class="text-xl font-bold">titulo</h2>
								</summary>

								<section class="text-sm italic text-right">
									<p>ID: 1223234</p>
									<p>Registrado em: costas</p>
								</section>
							</details>

							<p class="flex items-center text mt-1">
								<span class="material-symbols-rounded text-base!"> calendar_month </span>
								data
							</p>

							<hr class="mx-8 my-2" />
							<p class="italic">lorem ipsum</p>
							<p>Local: tung</p>
							<p>Intensidade: 6,7/10</p>
						</article>
					</section>
				</section>
			</div>
		</article>
	</main>
</template>

<style scoped>
.oneliner {
	@apply whitespace-nowrap overflow-hidden text-ellipsis;
}
</style>
