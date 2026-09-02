<script setup lang="ts">
import { ref, useTemplateRef } from "vue"
import NavBar from "@/components/NavBar.vue"
import BaseButton from "@/components/bases/BaseButton.vue"
import BaseInput from "@/components/bases/BaseInput.vue"
import FormSintoma from "@/components/forms/FormSintoma.vue"
import FilterOrd from "@/components/FilterOrd.vue"
import SymptomCard from "@/components/cards/SymptomCard.vue"
import { useAuthStore } from "@/stores/authStore"
import { getAllSymptoms, type Symptom } from "@/services/symptomService"
import SymptomExtended from "@/components/SymptomExtended.vue"
import BaseDialog from "@/components/bases/BaseDialog.vue"

const authStore = useAuthStore()

const symptoms = ref<Symptom[]>([])
const currentSymptom = ref<Symptom | null>(null)
const formRegister = useTemplateRef("formRegister")
const formUpdate = useTemplateRef("formUpdate")

const updateSymptoms = async (id: string) => {
	symptoms.value = await getAllSymptoms(id)
}

const viewSymptom = (symptom: Symptom | null) => {
	currentSymptom.value = symptom
}

const handleSubmit = () => {
	formRegister.value!.hide()
	formUpdate.value!.hide()
	currentSymptom.value = null
	updateSymptoms(authStore.userData!.id)
}

authStore.onReady(async (data) => {
	updateSymptoms(data.id)
})
</script>

<template>
	<!-- Screen -->
	<div class="flex h-screen">
		<NavBar />

		<main
			class="bg-background w-full h-full flex justify-center items-center gap-4 lg:gap-6 xl:gap-8 p-5 lg:p-7 xl:p-10 overflow-hidden"
		>
			<!-- Fernando Wrapper -->
			<div class="size-full bg-primary rounded-3xl py-8 px-5 flex flex-col min-h-0">
				<header>
					<section
						class="flex flex-col md:flex-row justify-center place-items-center relative gap-6 mb-3"
					>
						<!--Barra de pesquisa-->
						<BaseInput
							placeholder="Pesquisar"
							icon="search"
							theme="light"
							class="w-full md:w-2xl"
						></BaseInput>

						<!--Botão de registrar sintoma-->
						<BaseButton
							theme="accent"
							type="button"
							icon="add"
							iconPosition="right"
							class="rounded-4xl!"
							@click="formRegister?.toggle()"
						>
							Registrar Sintoma
						</BaseButton>
					</section>
					<!--Sliders-->
					<FilterOrd class="mb-3" />
				</header>

				<br />
				<p
					class="text-textLight text-2xl"
					:class="[!currentSymptom ? '' : 'hidden lg:flex']"
				>
					{{ symptoms.length }} sintomas registrados
				</p>
				<br />

				<!-- Content -->
				<section
					class="max-h-full overflow-hidden flex gap-8 scrollbar-track-transparent scrollbar-thumb-accent"
				>
					<!-- List -->
					<ul
						v-if="symptoms.length"
						class="w-full lg:w-max max-h-full overflow-hidden flex flex-col gap-2 overflow-y-auto"
						:class="[!currentSymptom ? '' : 'hidden lg:flex']"
					>
						<template v-for="symptom in symptoms" :key="symptom.id">
							<SymptomCard
								:symptom="symptom"
								theme="light"
								class="w-full cursor-pointer"
								@click="viewSymptom(symptom)"
							/>
						</template>
					</ul>
					<template v-else>
						<span
							class="material-symbols-rounded animate-spin text-accent w-fit m-auto"
						>
							sync
						</span>
					</template>

					<!-- Details -->
					<section
						class="grow w-fit h-full flex flex-col items-start"
						v-show="currentSymptom"
					>
						<header class="w-full flex flex-row justify-between">
							<button
								type="button"
								class="cursor-pointer text-textLight"
								@click="viewSymptom(null)"
							>
								<span class="material-symbols-rounded text-3xl!"> arrow_back </span>
							</button>

							<BaseButton
								theme="accent"
								icon="edit_document"
								class="gap-3"
								@click.prevent="formUpdate!.show()"
							>
								<p>Atualizar sintoma</p>
							</BaseButton>
						</header>

						<br />
						<SymptomExtended
							v-model="currentSymptom"
							ref="areaDescription"
							class="w-full"
						/>
					</section>
				</section>

				<!-- Forms -->
				<BaseDialog title="Registrar Sintoma" ref="formRegister">
					<FormSintoma @handled-submit="handleSubmit" />
				</BaseDialog>

				<BaseDialog title="Atualizar Sintoma" ref="formUpdate">
					<FormSintoma @handled-submit="handleSubmit" :symptom="currentSymptom" />
				</BaseDialog>
			</div>
		</main>
	</div>
</template>
