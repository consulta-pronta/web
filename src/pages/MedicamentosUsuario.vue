<script setup lang="ts">
import BaseInput from "@/components/bases/BaseInput.vue"
import NavBar from "@/components/NavBar.vue"
import { ref, onMounted, onUnmounted, computed } from "vue"
import {
    collection,
    onSnapshot,
    updateDoc,
    doc,
} from "firebase/firestore"

import { db } from "@/config/firebase"
import { useAuthStore } from "@/stores/authStore"
import Medication, {
    getMedicationSchedule,
} from "@/models/medication.model"

import MedicationRow from "@/components/MedicationRow.vue"

const authStore = useAuthStore()

const medications = ref<Medication[]>([])

const selectedDate = ref(getTodayDate())

let unsubscribe: (() => void) | null = null

function getTodayDate() {
    const date = new Date()

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")

    return `${year}-${month}-${day}`
}

onMounted(() => {
    const userId = authStore.user?.uid

    if (!userId) return

    const medicationsRef = collection(
        db,
        "Users",
        userId,
        Medication.collectionName
    )

    unsubscribe = onSnapshot(medicationsRef, (snapshot) => {
        medications.value = snapshot.docs.map((document) => {
            return Object.assign(
                new Medication(document.id),
                document.data()
            )
        })
    })
})

onUnmounted(() => {
    unsubscribe?.()
})
async function updateDose(
    medicationId: string,
    doseKey: string,
    taken: boolean
) {
    const userId = authStore.user?.uid

    if (!userId) return

    const medicationRef = doc(
        db,
        "Users",
        userId,
        Medication.collectionName,
        medicationId
    )

    await updateDoc(medicationRef, {
        [`taken_dates.${doseKey}`]: taken,
    })
}
const medicationDoses = computed(() => {
    return medications.value.flatMap((medication) => {
        const doses = getMedicationSchedule(
            medication,
            selectedDate.value
        )

        return doses.map((dose) => ({
            medication,
            dose,
        }))
    })
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

				<article class="w-full flex justify-center">
					<section
						class="relative grid grid-cols-[1fr_10fr] w-[85%] md:w-[60%] lg:w-[40%] min-h-11 items-center border border-textLight text-sm text-textLight rounded-[15px]"
					>
						<span class="material-symbols-rounded text-[10px] pl-5">
							shield
						</span>

						<div class="w-full text-center text-sm lg:text-sm">
							<p>
								Marque a caixa após o uso do medicamento.
							</p>
						</div>
					</section>
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
								v-for="item in medicationDoses"
								:key="item.medication.id + item.dose.key"
								:nome="item.medication.title"
								:quantidade="`${item.medication.dose_value} ${item.medication.dose_unit}`"
								:periodo="`A cada ${item.medication.frequency_value} ${item.medication.frequency_unit}`"
								:consumo="item.dose.time"
								:tomado="item.dose.taken"
								@update:tomado="updateDose(
									item.medication.id,
									item.dose.key,
									$event
								)"
							/>
						</tbody>
					</table>
				</div>
			</section>

		</main>
	</div>
</template>
