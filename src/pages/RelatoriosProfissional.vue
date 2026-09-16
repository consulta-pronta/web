<script setup lang="ts">
import { ref } from "vue"
import NavBar from "@/components/NavBar.vue"
import BaseInput from "@/components/bases/BaseInput.vue"
import { useAuthStore } from "@/stores/authStore"
import { getAllSymptoms, type Symptom } from "@/services/symptomService"
import UserPhoto from "@/components/UserPhoto.vue"
import BaseButton from "@/components/bases/BaseButton.vue"

const authStore = useAuthStore()

const currentUser = ref(false)
const VisuRelatorio = ref(false)

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

function toggleVisu() {
	VisuRelatorio.value = !VisuRelatorio.value
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
						placeholder="Buscar por nome, ID ou CPF"
						icon="search"
						theme="dark"
						class="w-full md:w-2xl"
					></BaseInput>
				</div>

				<!-- Content -->
				<section
					class="w-full max-h-full overflow-hidden flex gap-8 px-6 py-20 scrollbar-track-transparent scrollbar-thumb-accent"
				>
					<!-- List -->
					<ul
						class="w-full lg:w-96 max-h-full overflow-hidden flex flex-col gap-2 overflow-y-auto"
						:class="[!currentSymptom ? '' : 'hidden lg:flex']"
					>
						<article class="flex text-textLight items-center">
							<span class="material-symbols-rounded text-3xl!">
								person
							</span>
							<p class="text-2xl pl-2">
								Pacientes
							</p>
						</article>
						<button
							type="button"
							@click="toggleCurrentUser()"
							class="w-full flex rounded-md p-3 bg-textLight text-primaryDark items-center"
						>
							<UserPhoto />

							<section class="flex flex-col w-full text-start pl-6">
								<p class="font-bold text-2xl oneliner">
									Cláudio
								</p>

								<p class="oneliner text-base">
									CPF: 133243
								</p>
							</section>
						</button>
					</ul>

					<!-- Details -->
					<section class="flex-1 w-full h-full bg-surface rounded-[20px]" v-show="currentUser">
						<article class="flex w-full justify-center relative">
							<button type="button" class="cursor-pointer text-primaryDark absolute left-3" @click="toggleCurrentUser()">
								<span class="material-symbols-rounded text-4xl! pl-3 pt-2">
									arrow_back
								</span>
							</button>
							<section class="flex text-primaryDark items-center my-2">
								<UserPhoto />

								<span class="flex flex-col w-full text-start pl-6">
									<p class="font-bold text-2xl oneliner">
										Cláudio
									</p>

									<p class="oneliner text-base">
										CPF: 133243
									</p>
								</span>

							</section>

						</article>
						<hr class="mx-4" />
						<article class=" text-textDark p-3 px-26">
							<section class="grid grid-cols-3 gap-3 border border-primaryDark rounded-xl p-2 px-4">
								<article class="flex w-full text-primaryDark items-center justify-center">
									<span class="material-symbols-rounded text-2xl!">
										description
									</span>
									<p class="text-base font-bold pl-2">
										Dor Constante
									</p>
								</article>

								<article class="w-full flex items-center justify-center">
									<p class="oneliner text-sm ">
										18/06/2024 a
									</p>

									<p class="oneliner text-sm">
										26/06/2024
									</p>
								</article>

								<article class="flex justify-center">
									<BaseButton
										theme="primaryDark"
										mode="outline"
										type="button"
										class="rounded-4xl! border!"
										@click="toggleVisu"
									>
										Visualizar
									</BaseButton>
								</article>

							</section>
						</article>
					</section>
				</section>

				<section v-if="VisuRelatorio === true" class="dialog">
					<form class="bg-background w-[95%] md:w-[70%] lg:w-[55%] h-[95%] rounded-[25px] px-10 py-6">
						<article class=" overflow-y-auto flex flex-col border border-textLight w-full h-full relative rounded-2xl scrollbar-hide">
							<!--Seta de Retorno-->
							<button type="button" @click="toggleVisu" class="flex justify-start sticky top-0 left z-50 self-start cursor-pointer bg-background w-full">
								<span class="material-symbols-rounded text-[30px]! w-fit text-textLight m-3 cursor-pointer">
									arrow_back
								</span>
							</button>

							<!--Textos-->
							<p class="text-textLight text-2xl font-bold mx-4">
								Dor Constante
							</p>
							<p class="text-textLight text-base font-light italic mx-4">
								Relatório: ID51966
							</p>
							<span class="flex">
								<p class="text-textLight text-base font-bold mx-4">
									Período:
								</p>
								<p class="text-textLight text-base font-normal mx-0.5">
									10 de abr 2026 a 18 abr 2026
								</p>
							</span>
							<span class="flex">
								<p class="text-textLight text-base font-bold mx-4">
									Duração:
								</p>
								<p class="text-textLight text-base font-normal mx-0.5">
									8 dias (20 dias)
								</p>
							</span>

							<!--Paciente-->
							<section class="flex just mx-3 mt-3">
								<UserPhoto/>
								<article class="flex flex-col justify-center mx-4">
									<p class="text-textLight text-base font-bold">
										Cláudio Silva
									</p>
									<p class="text-textLight text-xs">
										claudiosilva213@email.com
									</p>
									<p class="text-textLight text-xs">
										(27) 99722-3725
									</p>
								</article>
							</section>

							<!--Informações-->
							<p class="text-textLight text-xl font-bold mx-4 mt-2">
								Resumo Geral
							</p>
							<section class="grid grid-cols-2 gap-2 mx-4 mt-1 w-[95%] h-[18%] text-background">
								<div class="bg-surface rounded-xl flex flex-col p-2.5">
									<p class="text-sm font-medium">
										Sintoma mais comum:
									</p>
									<p class="text-xl font-bold">
										Dor nas costas
									</p>
									<p class="text-sm font-medium">
										2 semanas
									</p>
									<div class="flex bg-error rounded-3xl text-surface mt-1 w-[55%] md:w-[60%] lg:w-[45%] h-[30%] md:h-[35%] lg:h-[45%] items-center">
										<span class="material-symbols-rounded text-xs! mx-1.5">
											warning
										</span>
										<p class="text-xs p-2 md:p-1 lg:p-0.5">
											Prioridade Alta
										</p>
									</div>
								</div>

								<div class="flex flex-col bg-surface text-background rounded-xl p-2.5">
									<span class="flex">
										<p class="text-base font-bold mx-4">
											10/04:
										</p>
										<p class="text-error text-base font-normal mx-0.5">
											8 de intensidade
										</p>
									</span>
									<span class="flex">
										<p class="text-base font-bold mx-4">
											12/04:
										</p>
										<p class="text-sucess text-base font-normal mx-0.5">
											4 de intensidade
										</p>
									</span>
									<span class="flex">
										<p class="text-base font-bold mx-4">
											14/04:
										</p>
										<p class="text-warning text-base font-normal mx-0.5">
											5 de intensidade
										</p>
									</span>
								</div>
							</section>

							<!--Cronologia-->
							<p class="text-textLight text-xl font-bold mx-4 mt-10 md:mt-12 lg:mt-8">
								Cronologia do Sintoma
							</p>

							<section class="flex flex-col p-4 max-h-full">

								<div class="flex">
									<article class="flex flex-col justify-center items-center w-[10%]">
										<div class="flex justify-center items-center">
											<span class="material-symbols-rounded bg-primaryLight text-background rounded-full">
												vital_signs
											</span>
										</div>
										<hr class="flex-1 w-px bg-primaryLight border-0">
									</article>
									<article class="flex flex-col w-[90%] h-[90%] bg-surface text-background rounded-lg p-3">
										<p class="text-lg font-bold">
											Dor nas costas ao levantar peso
										</p>
										<p class="text-sm font-medium">
											(16 abr. 2026)
										</p>
										<p class="text-sm font-medium">
											- Intensidade 6/10; "Começa a doer um pouco despois de eu levantar, mas para de doer em pouco tempo."
										</p>
									</article>
								</div>

								<div class="flex">
									<article class="flex flex-col justify-center items-center w-[10%]">
										<div class="flex justify-center items-center">
											<span class="material-symbols-rounded bg-primaryLight text-background rounded-full">
												vital_signs
											</span>
										</div>
										<hr class="flex-1 w-px bg-primaryLight border-0">
									</article>
									<article class="flex flex-col w-[90%] h-[90%] bg-surface text-background rounded-lg p-3">
										<p class="text-lg font-bold">
											Dor nas costas ao levantar peso
										</p>
										<p class="text-sm font-medium">
											(16 abr. 2026)
										</p>
										<p class="text-sm font-medium">
											- Intensidade 6/10; "Começa a doer um pouco despois de eu levantar, mas para de doer em pouco tempo."
										</p>
									</article>
								</div>

								<div class="flex">
									<article class="flex flex-col justify-center items-center w-[10%]">
										<div class="flex justify-center items-center">
											<span class="material-symbols-rounded bg-primaryLight text-background rounded-full">
												vital_signs
											</span>
										</div>
										<hr class="flex-1 w-px bg-primaryLight border-0">
									</article>
									<article class="flex flex-col w-[90%] h-[90%] bg-surface text-background rounded-lg p-3">
										<p class="text-lg font-bold">
											Dor nas costas ao levantar peso
										</p>
										<p class="text-sm font-medium">
											(16 abr. 2026)
										</p>
										<p class="text-sm font-medium">
											- Intensidade 6/10; "Começa a doer um pouco despois de eu levantar, mas para de doer em pouco tempo."
										</p>
									</article>
								</div>

								<!--Visão geral-->
								<p class="text-textLight text-xl font-bold mx-4 mt-2">
									Visão Geral
								</p>

								<article class="flex justify-center w-full">
									<table class="w-[95%] border-separate border-spacing-0.5">
										<thead class="gap-0.5 text-background font-semibold">
											<tr>
												<th class="bg-surface">Sintoma</th>
												<th class="bg-surface">Duração</th>
												<th class="bg-surface">Ocorrência</th>
											</tr>
										</thead>
										<tbody class="gap-0.5 text-background">
											<tr>
												<th class="bg-textLight">Dor nas Costas</th>
												<th class="bg-textLight">20 dias</th>
												<th class="bg-textLight">9 Ocorrências</th>
											</tr>
											<tr>
												<th class="bg-textLight">Estômago Ardendo</th>
												<th class="bg-textLight">4 dias</th>
												<th class="bg-textLight">3 Ocorrências</th>
											</tr>
										</tbody>
									</table>
								</article>
							</section>
						</article>
					</form>
				</section>
			</div>

		</article>
	</main>
</template>

<style scoped>
.oneliner {
	@apply whitespace-nowrap overflow-hidden text-ellipsis;
}
@reference "@/assets/main.css";

.dialog {
	@apply
		absolute inset-0 w-full h-full
		bg-black/80
		flex justify-center place-items-center
		z-50
}
</style>
