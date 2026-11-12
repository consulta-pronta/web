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
	<div class="flex h-screen">
		<NavBar />

		<main class="w-full h-full overflow-clip px-6 py-8">
			<header class="mb-4 flex flex-col gap-6">
				<h1 class="text-4xl text-textLight font-bold text-center lg:text-start">
					Meus Medicamentos
				</h1>

				<BaseInput
					placeholder="Pesquisar"
					icon="search"
					class="place-self-center w-full md:w-120"
				/>

				<article
					class="relative w-full lg:w-[85%] mx-auto flex flex-col items-center gap-4"
				>
					<section
						class="flex items-center gap-2 px-4 min-h-11 border border-textLight text-sm text-textLight rounded-[15px]"
					>
						<span class="material-symbols-rounded text-base">shield</span>
						<p>Marque a caixa após o uso do medicamento.</p>
					</section>

					<BaseButton
						mode="transparent"
						theme="textLight"
						icon="add_circle"
						icon-position="right"
						class="font-bold gap-2 lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2"
						@click="showAddModal = true"
					>
						Adicionar Medicamento
					</BaseButton>
				</article>
			</header>

			<section class="w-full flex justify-center place-items-center text-center min-h-0">
				<div class="w-full lg:w-[85%] max-h-[55vh] overflow-y-auto rounded-[20px] scrollbar-hide">
					<table class="bg-surface w-full">
						<thead class="text-sm text-primarydark font-bold sticky top-0 bg-surface z-10">
							<tr>
								<th class="px-4 py-3">Medicamento</th>
								<th class="px-4 py-3">Quantidade</th>
								<th class="px-4 py-3">Período</th>
								<th class="px-4 py-3">Consumo</th>
								<th class="px-4 py-3">Consumido</th>
							</tr>
						</thead>

						<tbody>
							<MedicationRow
								v-for="item in medicationRows"
								:key="item.medication.id"
								:nome="item.medication.title"
								:quantidade="`${item.medication.dose_value} ${item.medication.dose_unit}`"
								:periodo="`A cada ${item.medication.frequency_value} ${item.medication.frequency_unit}`"
								:consumo="item.medication.route"
								:tomado="item.taken"
								@update:tomado="toggleTaken(item.medication.id, $event)"
							/>
						</tbody>
					</table>
				</div>
			</section>
		</main>

		<FormAddMedical v-if="showAddModal" @close="showAddModal = false" />
	</div>
</template>
