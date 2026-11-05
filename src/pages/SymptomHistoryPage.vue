<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from "vue"
import BaseButton from "@/components/bases/BaseButton.vue"
import BaseInput from "@/components/bases/BaseInput.vue"
import FormSymptom from "@/components/forms/FormSymptom.vue"
import SymptomCard from "@/components/cards/SymptomCard.vue"
import BaseFilter, { type FilterOption } from "@/components/bases/BaseFilter.vue"
import BaseSort, { type SortOption } from "@/components/bases/BaseSort.vue"
import { useAuthStore } from "@/stores/authStore"
import Symptom from "@/database/symptom.model"
import SymptomExtended from "@/components/SymptomExtended.vue"
import BaseDialog from "@/components/bases/BaseDialog.vue"
import { useRoute } from "vue-router"
import router from "@/router"
import { searchDocuments, symptomPlaces, timestampDiffSeconds, type SortDirection } from "@/utils"
import PageWrapper from "@/components/wrappers/PageWrapper.vue"
import DefaultContentWrapper from "@/components/wrappers/DefaultContentWrapper.vue"
import HeaderWrapper from "@/components/wrappers/HeaderWrapper.vue"

const route = useRoute()
const authStore = useAuthStore()

const symptoms = ref<Symptom[]>([])
const searchQuery = ref("")
const symptomsLoaded = ref(false)
const loadError = ref("")
const selectedPlace = ref<string | null>(null)
const sortField = ref<(typeof sortOptions)[number]["value"]>("date_time")
const sortDirection = ref<SortDirection>("desc")
const currentSymptomId = ref<string>("")
const formRegister = useTemplateRef("formRegister")
const formUpdate = useTemplateRef("formUpdate")

let userId = ""

const filterOptions = symptomPlaces.map<FilterOption>((place) => ({ value: place, label: place }))
const sortOptions = [
	{ value: "date_time", label: "Data de início" },
	{ value: "intensity", label: "Intensidade" },
] as const satisfies SortOption[]

const filteredSymptoms = computed(() => {
	const filtered = searchDocuments(
		symptoms.value.filter((i) => !selectedPlace.value || i.place === selectedPlace.value),
		searchQuery.value,
	) as Symptom[]

	const shouldReverse = sortDirection.value === "desc"
	switch (sortField.value) {
		case "date_time":
			filtered.sort((a, b) => timestampDiffSeconds(a.date_time!, b.date_time!, shouldReverse))
			break
		case "intensity":
			filtered.sort((a, b) =>
				shouldReverse ? a.intensity - b.intensity : b.intensity - a.intensity,
			)
			break
	}

	return filtered
})

const updateSymptoms = async () => {
	loadError.value = ""
	symptomsLoaded.value = false
	try {
		symptoms.value = await Symptom.getAll({ scope: { userId } })
	} catch (error) {
		console.error("Failed to load symptoms.", error)
		loadError.value = "Não foi possível carregar os sintomas."
	} finally {
		symptomsLoaded.value = true
	}
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
		router.replace({
			name: route.name,
			params: { id: value },
		})
	} else {
		router.replace({ name: route.name })
	}
})

authStore.onReady(async (data) => {
	userId = data.id
	currentSymptomId.value = route.params.id as string

	updateSymptoms()
})
</script>

<template>
	<PageWrapper>
		<HeaderWrapper title="Histórico de Sintomas">
			<div class="flex flex-col md:flex-row justify-center place-items-center relative gap-6">
				<BaseInput
					v-model="searchQuery"
					placeholder="Pesquisar"
					icon="search"
					theme="light"
					class="w-full md:w-2xl"
				/>

				<BaseButton
					theme="accent"
					type="button"
					icon="add"
					iconPosition="right"
					class="min-w-52"
					@click="formRegister?.toggle()"
				>
					Registrar Sintoma
				</BaseButton>
			</div>
		</HeaderWrapper>

		<DefaultContentWrapper class="flex-col">
			<div class="flex flex-col gap-2">
				<BaseFilter
					v-model="selectedPlace"
					:options="filterOptions"
					label="Filtrar por local"
				/>
				<BaseSort
					v-model="sortField"
					v-model:direction="sortDirection"
					:options="sortOptions"
				/>
			</div>

			<div class="flex flex-row gap-4">
				<ul
					v-if="filteredSymptoms.length"
					class="w-full max-h-full overflow-hidden grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(30em,1fr))] gap-2 overflow-y-auto"
					:class="[!currentSymptomId ? '' : 'hidden lg:grid lg:grid-cols-1 lg:w-120']"
				>
					<p
						class="text-textLight text-2xl col-span-full"
						:class="[!currentSymptomId ? '' : 'hidden lg:flex']"
					>
						{{ filteredSymptoms.length }} sintomas registrados
					</p>

					<template v-for="symptom in filteredSymptoms" :key="symptom.id">
						<SymptomCard
							:symptom="symptom"
							theme="light"
							class="w-full cursor-pointer"
							@click="viewSymptom(symptom.id)"
						/>
					</template>
				</ul>
				<p v-else-if="!symptomsLoaded" class="text-textLight m-auto">
					<span class="material-symbols-rounded animate-spin text-accent w-fit m-auto">
						sync
					</span>
				</p>
				<p v-else-if="loadError" class="text-error m-auto">
					{{ loadError }}
				</p>
				<p v-else class="text-textLight m-auto">
					{{
						symptoms.length
							? "Nenhum sintoma encontrado."
							: "Nenhum sintoma registrado."
					}}
				</p>

				<!-- Details -->
				<section class="grow h-full flex flex-col items-start" v-show="currentSymptomId">
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
			</div>
		</DefaultContentWrapper>

		<!-- Forms -->
		<BaseDialog title="Registrar Sintoma" ref="formRegister">
			<FormSymptom @handled-submit="handleSubmit" />
		</BaseDialog>

		<BaseDialog title="Atualizar Sintoma" ref="formUpdate">
			<FormSymptom @handled-submit="handleSubmit" :symptomId="currentSymptomId" />
		</BaseDialog>
	</PageWrapper>
</template>
