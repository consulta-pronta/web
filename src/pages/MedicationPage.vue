<script setup lang="ts">
import BaseInput from "@/components/bases/BaseInput.vue"
import BaseButton from "@/components/bases/BaseButton.vue"
import MedicationRow from "@/components/MedicationRow.vue"
import { ref, watch, onMounted, onUnmounted, computed } from "vue"
import { useAuthStore } from "@/stores/authStore"
import Medication from "@/database/medication.model"
import PageWrapper from "@/components/wrappers/PageWrapper.vue"
import HeaderWrapper from "@/components/wrappers/HeaderWrapper.vue"
import DefaultContentWrapper from "@/components/wrappers/DefaultContentWrapper.vue"
import BaseTable from "@/components/bases/BaseTable.vue"
import BaseDialog from "@/components/bases/BaseDialog.vue"
import FormAddMedication from "@/components/forms/FormAddMedication.vue"
import { searchDocuments } from "@/utils"
import { useToast } from "vue-toastification"

const authStore = useAuthStore()
const toast = useToast()

const registerFormVisible = ref(false)
const updateFormVisible = ref(false)
const selectedMedication = ref<Medication | null>(null)
const medications = ref<Medication[]>([])
const loading = ref(true)
const searchQuery = ref("")

const filteredMedications = computed(() =>
	searchDocuments(medications.value, searchQuery.value) as Medication[]
)

// Relógio que faz a caixa desmarcar sozinha quando o intervalo acaba
const now = ref(Date.now())
let timer: number | undefined

let unsubscribe: (() => void) | null = null

watch(
	() => authStore.user?.uid,
	(userId) => {
		unsubscribe?.()
		unsubscribe = null
		loading.value = true

		if (!userId) {
			medications.value = []
			loading.value = false
			return
		}

		unsubscribe = Medication.listen(
			(list) => {
				medications.value = list
				loading.value = false
			},
			{ scope: { userId } },
			(error) => {
				console.error("Failed to load medications:", error)
				toast.error("Não foi possível carregar os medicamentos.")
				loading.value = false
			},
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
		try {
			await medication.markTaken(taken, { scope: { userId: guy.id } })
			toast.success(taken ? "Medicamento marcado como tomado." : "Marcação removida.")
		} catch (error) {
			console.error("Failed to update medication status.", error)
			toast.error("Não foi possível atualizar o medicamento.")
		}
	})
}

const medicationRows = computed(() => {
	return medications.value
		.filter((medication) => !medication.isTreatmentOver(now.value))
})

const updateMedication = (medication: Medication) => {
	updateFormVisible.value = true
	selectedMedication.value = medication
}

const deleteMedication = (medication: Medication) => {
	authStore.onReady(async (user) => {
		try {
			await Medication.delete(medication.id, { scope: { userId: user.id } })
			toast.success("Medicamento excluído com sucesso.")
		} catch (error) {
			console.error("Failed to delete medication.", error)
			toast.error("Não foi possível excluir o medicamento.")
		}
	})
}
</script>

<template>
	<PageWrapper>
		<HeaderWrapper title="Meus Medicamentos">
			<div class="flex flex-row gap-2 justify-center *:h-[stretch]">
				<BaseButton
					type="button"
					theme="accent"
					icon="prescriptions"
					@click="registerFormVisible = true"
					class="col-span-3 rounded-2xl"
				>
					<p class="hidden lg:block">Adicionar Medicamento</p>
				</BaseButton>

				<BaseInput
					v-model="searchQuery"
					placeholder="Pesquisar"
					icon="search"
					class="place-self-center w-full md:w-120"
				/>
			</div>
		</HeaderWrapper>

		<DefaultContentWrapper>
			<BaseTable
				:is-loading="loading"
				:skeleton-rows="5"
				:column-count="6"
				:show-message="!loading && filteredMedications.length === 0"
				message="Nenhum medicamento encontrado"
			>
				<template #header>
					<th class="w-100">Medicamento</th>
					<th class="w-55">Quantidade</th>
					<th class="w-50">Período</th>
					<th class="w-24">Consumo</th>
					<th class="w-24">Consumido</th>
					<th class="w-12"></th>
				</template>

				<MedicationRow
					v-for="medication in filteredMedications"
					:key="medication.id"
					:medication="medication"
					@update:tomado="toggleTaken(medication, $event)"
					@update:medication="updateMedication($event)"
					@delete:medication="deleteMedication($event)"
				/>
			</BaseTable>
		</DefaultContentWrapper>

		<BaseDialog
			title="Adicionar Medicamento"
			v-model:visible="registerFormVisible"
		>
			<FormAddMedication @close="registerFormVisible = false" />
		</BaseDialog>

		<BaseDialog
			title="Atualizar Medicamento"
			v-model:visible="updateFormVisible"
		>
			<FormAddMedication @close="updateFormVisible = false" :medication="selectedMedication" />
		</BaseDialog>
	</PageWrapper>
</template>
