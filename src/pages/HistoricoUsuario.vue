<script setup lang="ts">
import { ref, useTemplateRef, watch } from "vue"
import NavBar from "@/components/NavBar.vue"
import BaseButton from "@/components/bases/BaseButton.vue"
import BaseInput from "@/components/bases/BaseInput.vue"
import FormSintoma from "@/components/forms/FormSintoma.vue"
import FilterOrd from "@/components/FilterOrd.vue"
import SymptomCard from "@/components/cards/SymptomCard.vue"
import { useAuthStore } from "@/stores/authStore"
import { getAllSymptoms } from "@/services/symptomService"
import SymptomExtended from "@/components/SymptomExtended.vue"
import BaseDialog from "@/components/bases/BaseDialog.vue"
import { useRoute } from "vue-router"
import router from "@/router"
import type { Symptom } from "@/models/symptomModel"

const route = useRoute()
const authStore = useAuthStore()

const symptoms = ref<Symptom[]>([])
const currentSymptomId = ref<string>("")
const formRegister = useTemplateRef("formRegister")
const formUpdate = useTemplateRef("formUpdate")

const rootPath = "/" + route.path.split("/")[1]

let userId = ""

const updateSymptoms = async () => {
	symptoms.value = []
	symptoms.value = await getAllSymptoms(userId)
}

const viewSymptom = (symptomId: string) => {
	currentSymptomId.value = symptomId ?? ""
}

const handleSubmit = () => {
	formRegister.value!.hide()
	formUpdate.value!.hide()
	updateSymptoms()
}

watch(currentSymptomId, (value) => {
	if (value) {
		router.replace(`${rootPath}/${value}`)
	} else {
		router.replace(rootPath)
	}
})

authStore.onReady(async (data) => {
	userId = data.id
	currentSymptomId.value = route.params.id as string

	updateSymptoms()
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
					:class="[!currentSymptomId ? '' : 'hidden lg:flex']"
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
						:class="[!currentSymptomId ? '' : 'hidden lg:flex']"
					>
						<template v-for="symptom in symptoms" :key="symptom.id">
							<SymptomCard
								:symptom="symptom"
								theme="light"
								class="w-full cursor-pointer"
								@click="viewSymptom(symptom.id)"
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
						class="grow h-full flex flex-col items-start"
						v-show="currentSymptomId"
					>
						<header class="w-full flex flex-row justify-between">
							<button
								type="button"
								class="cursor-pointer text-textLight"
								@click="viewSymptom('')"
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
							v-model="currentSymptomId"
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
					<FormSintoma @handled-submit="handleSubmit" :symptomId="currentSymptomId" />
				</BaseDialog>
			</div>
		</main>
	</div>
</template>
