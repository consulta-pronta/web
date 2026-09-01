<script setup lang="ts">
import { ref } from 'vue'
import NavBar from '@/components/NavBar.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import FormSintoma from "@/components/forms/FormSintoma.vue"
import FilterOrd from '@/components/FilterOrd.vue'
import SymptomCard from '@/components/cards/SymptomCard.vue'
import { useAuthStore } from "@/stores/authStore"
import { getAllSymptoms, type Symptom } from "@/services/symptomService"
import SymptomExtended from "@/components/SymptomExtended.vue"

const currentSymptom = ref<Symptom | null>(null)
const registerFormVisible = ref(false)
const editar = ref(false)

const authStore = useAuthStore()
const symptoms = ref<Symptom[]>([])

const updateSymptoms = async (id: string) => {
	symptoms.value = await getAllSymptoms(id)
}
authStore.onReady(async (data) => {
	updateSymptoms(data.id)
})

const viewSymptom = (symptom: Symptom | null) => {
	currentSymptom.value = symptom
}

const toggleRegisterForm = () => {
	registerFormVisible.value = !registerFormVisible.value
}

function toggleEditar() {
	editar.value = !editar.value
}

const handleSubmit = () => {
	toggleRegisterForm()
	updateSymptoms(authStore.userData!.id)
}
</script>

<template>
	<!-- Screen -->
	<div class="flex h-screen">
		<NavBar />

		<main class="bg-background w-full h-full flex justify-center items-center p-10 overflow-hidden">
			<!-- Fernando Wrapper -->
			<div class="size-full bg-primary rounded-3xl py-8 px-5 flex flex-col min-h-0">
				<header>
					<section class="flex justify-center place-items-center relative gap-6 mb-3">
						<!--Barra de pesquisa-->
						<BaseInput placeholder="Pesquisar" icon="search" theme="light" class="w-2xl"></BaseInput>

						<!--Botão de registrar sintoma-->
						<BaseButton theme="dark" mode="outline" text="Registrar Sintoma" icon="add" class="rounded-4xl!" @click="toggleRegisterForm" />
					</section>

					<!--Sliders-->
					<FilterOrd class="mb-3"/>
				</header>

				<br>
				<p class="text-textLight text-2xl">{{ symptoms.length }} sintomas registrados</p>
				<br>

				<!-- Content -->
				<section class="max-h-full overflow-hidden flex gap-8 scrollbar-track-transparent scrollbar-thumb-accent">
					<!-- List -->
					<ul v-if="symptoms.length"
						class="max-h-full overflow-hidden flex flex-col gap-2 overflow-y-auto">
						<template v-for="symptom in symptoms" :key="symptom.id">
							<SymptomCard :symptom="symptom" theme="light"
								class="w-80 cursor-pointer" @click="viewSymptom(symptom)"
							/>
						</template>
					</ul>
					<template v-else>
						<span class="material-symbols-rounded animate-spin text-accent w-fit m-auto">
							sync
						</span>
					</template>

					<!-- Details -->
					<section class="grow h-full flex flex-col items-start" v-show="currentSymptom">
						<button type="button" class="cursor-pointer text-textLight" @click="viewSymptom(null)">
							<span class="material-symbols-rounded text-3xl!">
								arrow_back
							</span>
						</button>

						<SymptomExtended
							v-model="currentSymptom" ref="areaDescription"
							class="w-full"
						/>
					</section>
				</section>

				<!-- Forms -->
				<!-- Registrar -->
				<section v-show="registerFormVisible" class="dialog" @click.self="toggleRegisterForm" @submit="handleSubmit">
					<div class="w-150 p-10 bg-primary rounded-xl shadow-xl">
						<header class="grid grid-cols-[min-content_1fr]">
							<button type="button" class="cursor-pointer text-textLight" @click="toggleRegisterForm">
								<span class="material-symbols-rounded text-3xl!">
									close
								</span>
							</button>

							<h2 class="text-2xl text-center font-semibold text-textLight">Registrar Sintoma</h2>
						</header>

						<FormSintoma class="mt-4"/>
					</div>
				</section>
				<!-- Editar -->
				<div v-if="editar === true" class="dialog">
					<form class="bg-primary w-[45%] h-[95%] rounded-[25px] px-15 py-5 flex flex-col place-items-center relative">
						<button type="button" @click="toggleEditar">
							<span class="material-symbols-rounded absolute left-0 text-[38px]! text-textLight ml-4 cursor-pointer">
								arrow_back
							</span>
						</button>
						<p class="text-textLight text-2xl text-semibold mb-2">
							Editar Sintoma
						</p>
						<p class="text-textLight text-sm text-medium mb-1">
							O que você está sentindo?
						</p>
						<BaseInput type="text" name="resumo" placeholder="Resuma seus sintomas" bgColor="textLight" textColor="primaryDark" />
						<p class="text-textLight text-sm text-medium mb-1">
							Explique com mais detalhes
						</p>
						<BaseInput type="text" name="descricao" placeholder="Descreva seus sintomas com mais detalhes" bgColor="textLight" textColor="primaryDark" />
						<p class="text-textLight text-sm text-medium mb-1">
							Quando começou?
						</p>
						<section class="flex w-full mb-1">
							<span class="flex-1">
								<BaseInput type="date" name="data" bgColor="textLight" textColor="primaryDark" px="0" class="pr-2 m-0" />
							</span>
							<span class="flex-1">
								<BaseInput type="time" name="horario" bgColor="textLight" textColor="primaryDark" px="0" />
							</span>
						</section>
						<p class="text-textLight text-sm text-medium mb-1">
							Em qual parte do corpo?
						</p>
						<div class="relative w-full mb-1">
							<span class="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-xl pointer-events-none">
								location_on
							</span>
							<select name="localizacao" required class="w-full h-11 rounded-md bg-textLight text-primaryDark pl-10 pr-8 appearance-none outline-none">
								<option value="" disabled selected>
									Localização
								</option>
								<option value="Costas">Costas</option>
								<option value="Braço">Braço</option>
								<option value="Cabeça">Cabeça</option>
							</select>
							<span class="material-symbols-rounded absolute right-3 top-1/2 -translate-y-1/2 text-xl pointer-events-none">
								expand_more
							</span>
						</div>
						<p class="text-textLight text-sm text-medium mb-1">
							Qual a intensidade do sintoma?
						</p>
						<div class="relative w-full mb-1">
							<span class="material-symbols-rounded absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
								expand_more
							</span>
							<select name="intensidade" required class="w-full h-11 rounded-md bg-textLight text-primaryDark px-4 appearance-none outline-none">
								<option value="" disabled selected>
									Selecione a intensidade
								</option>
								<option value="1">1</option>
								<option value="2">2</option>
								<option value="3">3</option>
								<option value="4">4</option>
								<option value="5">5</option>
								<option value="6">6</option>
								<option value="7">7</option>
								<option value="8">8</option>
								<option value="9">9</option>
								<option value="10">10</option>
							</select>
						</div>
						<p class="text-textLight text-sm text-medium">
							Foto
						</p>
						<div class="flex flex-col items-center justify-center w-full h-full">
							<label for="arquivo" class="w-full h-[70%] border border-dashed border-surface flex flex-col items-center justify-center cursor-pointer" >
								<span class="material-symbols-rounded text-textLight">
									photo_camera
								</span>
								<p class="text-textLight text-sm text-medium">
									Tirar foto ou enviar anexo
								</p>
							</label>
							<input id="arquivo" name="arquivo" type="file" accept=".jpg,.jpeg,.png,.pdf" class="hidden"/>
						</div>
						<BaseButton type="submit" h="11" w="full" bgColor="accent" text="Editar Sintoma" rounded="md" class="p-2" textColor="primaryDark"/>
					</form>
				</div>
			</div>
		</main>
	</div>
</template>

<style scoped>
	@reference "@/assets/main.css";

	.dialog {
		@apply
			absolute inset-0 w-full h-full
			bg-black/50
			flex justify-center place-items-center
	}
</style>
