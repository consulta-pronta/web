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
import BaseCardList from "@/components/bases/BaseCardList.vue"

const route = useRoute()
const authStore = useAuthStore()

const symptoms = ref<Symptom[]>([])
const searchQuery = ref("")
const symptomsLoaded = ref(false)
const loadError = ref("")
const deleteError = ref("")
const isDeleting = ref(false)
const selectedPlace = ref<string | null>(null)
const sortField = ref<(typeof sortOptions)[number]["value"]>("date_time")
const sortDirection = ref<SortDirection>("desc")
const currentSymptomId = ref<string>("")
const formRegister = useTemplateRef("formRegister")
const formUpdate = useTemplateRef("formUpdate")
const confirmDelete = useTemplateRef("confirmDelete")

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

const openDeleteConfirmation = () => {
	deleteError.value = ""
	confirmDelete.value?.show()
}

const deleteSymptom = async () => {
	if (!currentSymptomId.value || isDeleting.value) return

	isDeleting.value = true
	deleteError.value = ""
	try {
		await Symptom.delete(currentSymptomId.value, { scope: { userId } })
		confirmDelete.value?.hide()
		currentSymptomId.value = ""
		await updateSymptoms()
	} catch (error) {
		console.error("Failed to delete symptom.", error)
		deleteError.value = "Não foi possível excluir o sintoma. Tente novamente."
	} finally {
		isDeleting.value = false
	}
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
			<div class="flex flex-row gap-2 justify-center *:h-[stretch]">
				<BaseButton
					type="button"
					theme="accent"
					icon="heart_plus"
					@click="formRegister?.toggle()"
					class="col-span-3 rounded-2xl"
				>
					<p class="hidden lg:block">Registrar Sintoma</p>
				</BaseButton>

				<BaseInput
					v-model="searchQuery"
					placeholder="Pesquisar"
					icon="search"
					class="place-self-center w-full md:w-120"
				/>
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
				<div
					class="w-full flex flex-col gap-4"
					:class="[!currentSymptomId ? '' : 'hidden lg:grid lg:w-120']"
				>
					<p
						class="text-textLight text-2xl col-span-full"
						:class="[!currentSymptomId ? '' : 'hidden lg:flex']"
					>
						<template v-if="symptomsLoaded">
							{{ filteredSymptoms.length }} sintomas registrados
						</template>
						<template v-else>
							Carregando sintomas
						</template>
					</p>

					<BaseCardList
						v-if="filteredSymptoms.length || !symptomsLoaded"
						:is-loading="!symptomsLoaded"
						class="max-h-full overflow-y-auto"
						min-width="30em"
					>

						<SymptomCard
							v-for="symptom in filteredSymptoms" 
							:key="symptom.id"
							:symptom="symptom"
							class="w-full cursor-pointer"
							@click="viewSymptom(symptom.id)"
						/>
					</BaseCardList>
				</div>
				
				<p v-if="symptomsLoaded && loadError" class="text-error m-auto">
					{{ loadError }}
				</p>
				<p
					v-else-if="symptomsLoaded && !filteredSymptoms.length"
					class="text-textLight m-auto"
				>
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

						<div class="flex flex-row gap-4">
							<BaseButton
								theme="accent"
								icon="edit_document"
								class="gap-3"
								@click.prevent="formUpdate!.show()"
							>
								<p>Atualizar sintoma</p>
							</BaseButton>
							<BaseButton
								theme="accent"
								mode="transparent"
								icon="delete"
								class="px-0!"
								@click.prevent="openDeleteConfirmation"
							/>
						</div>
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

		<BaseDialog title="Excluir sintoma" ref="confirmDelete">
			<div class="flex flex-col gap-4">
				<p class="text-center mb-2">
					Tem certeza de que deseja excluir este sintoma? Esta ação não pode ser desfeita.
				</p>

				<p v-if="deleteError" class="text-error">{{ deleteError }}</p>

				<div class="flex justify-end gap-3">
					<BaseButton
						theme="accent"
						mode="transparent"
						:state="isDeleting ? 'disabled' : 'enabled'"
						@click="confirmDelete?.hide()"
					>
						Cancelar
					</BaseButton>
					<BaseButton
						theme="accent"
						icon="delete"
						class="gap-2"
						:state="isDeleting ? 'sync' : 'enabled'"
						@click="deleteSymptom"
					>
						Excluir
					</BaseButton>
				</div>
			</div>
		</BaseDialog>
	</PageWrapper>
</template>
