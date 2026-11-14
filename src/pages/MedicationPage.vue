<script setup lang="ts">
import BaseInput from "@/components/bases/BaseInput.vue"
import BaseButton from "@/components/bases/BaseButton.vue"
import NavBar from "@/components/NavBar.vue"
import MedicationRow from "@/components/MedicationRow.vue"
import FormAddMedical from "@/components/forms/FormAddMedical.vue"
import { ref, watch, onMounted, onUnmounted, computed } from "vue"

import { useAuthStore } from "@/stores/authStore"
import Medication from "@/database/medication.model"
import PageWrapper from "@/components/wrappers/PageWrapper.vue"
import HeaderWrapper from "@/components/wrappers/HeaderWrapper.vue"
import DefaultContentWrapper from "@/components/wrappers/DefaultContentWrapper.vue"
import BaseTable from "@/components/bases/BaseTable.vue"

const authStore = useAuthStore()

const showAddModal = ref(false)
const medications = ref<Medication[]>([])

// Relógio que faz a caixa desmarcar sozinha quando o intervalo acaba
const now = ref(Date.now())
let timer: number | undefined

let unsubscribe: (() => void) | null = null

watch(
	() => authStore.user?.uid,
	(userId) => {
		unsubscribe?.()
		unsubscribe = null

		if (!userId) {
			medications.value = []
			return
		}

		unsubscribe = Medication.listen(
			(list) => {
				medications.value = list
			},
			{ scope: { userId } },
		)
	},
	{ immediate: true },
)

onMounted(() => {
	timer = window.setInterval(() => {
		now.value = Date.now()
	}, 1000)
})

onUnmounted(() => {
	clearInterval(timer)
	unsubscribe?.()
})

const toggleTaken = async (medication: Medication, taken: boolean) => {
	authStore.onReady(async (guy) => {
		await medication.markTaken(taken, { scope: { userId: guy.id } })
	})
}

const medicationRows = computed(() => {
	return medications.value
		.filter((medication) => !medication.isTreatmentOver(now.value))
})
</script>

<template>
	<PageWrapper>
		<HeaderWrapper title="Meus Medicamentos">
			<div class="flex flex-row gap-2 justify-center *:h-[stretch]">
				<BaseButton
					type="button"
					theme="accent"
					icon="prescriptions"
					@click="showAddModal = true"
					class="col-span-3 rounded-2xl"
				>
					<p class="hidden lg:block">Adicionar Medicamento</p>
				</BaseButton>

				<!-- v-model="searchQuery" -->
				<BaseInput
					placeholder="Pesquisar"
					icon="search"
					class="place-self-center w-full md:w-120"
				/>
			</div>
		</HeaderWrapper>

		<DefaultContentWrapper>
			<BaseTable>
				<template #header>
					<th class="w-">Medicamento</th>
					<th class="w-">Quantidade</th>
					<th class="w-">Período</th>
					<th class="w-">Consumo</th>
					<th class="w-12">Consumido</th>
					<th class="w-12"></th>
				</template>

				<MedicationRow
					v-for="medication in medicationRows"
					:key="medication.id"
					:medication="medication"
					@update:tomado="toggleTaken(medication, $event)"
				/>
			</BaseTable>
		</DefaultContentWrapper>

		<FormAddMedical v-if="showAddModal" @close="showAddModal = false" />
	</PageWrapper>
</template>
