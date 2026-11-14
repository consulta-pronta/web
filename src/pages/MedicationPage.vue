<script setup lang="ts">
import BaseInput from "@/components/bases/BaseInput.vue"
import BaseButton from "@/components/bases/BaseButton.vue"
import NavBar from "@/components/NavBar.vue"
import MedicationRow from "@/components/MedicationRow.vue"
import FormAddMedical from "@/components/forms/FormAddMedical.vue"
import { ref, watch, onMounted, onUnmounted, computed } from "vue"

import { useAuthStore } from "@/stores/authStore"
import Medication, {
	isMedicationTaken,
	isTreatmentOver,
} from "@/database/medication.model"
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

		unsubscribe = Medication.listen(userId, (list) => {
			medications.value = list
		})
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

async function toggleTaken(medicationId: string, taken: boolean) {
	const userId = authStore.user?.uid

	if (!userId) return

	await Medication.markTaken(userId, medicationId, taken)
}

const medicationRows = computed(() => {
	return medications.value
		.filter((medication) => !isTreatmentOver(medication, now.value))
		.map((medication) => ({
			medication,
			taken: isMedicationTaken(medication, now.value),
		}))
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
					v-for="item in medicationRows"
					:key="item.medication.id"
					:medication="item.medication"
					@update:tomado="toggleTaken(item.medication.id, $event)"
				/>
			</BaseTable>
		</DefaultContentWrapper>

		<FormAddMedical v-if="showAddModal" @close="showAddModal = false" />
	</PageWrapper>
</template>
