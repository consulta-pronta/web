<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from "vue"

import BaseInput from "@/components/bases/BaseInput.vue"
import FarmaciaRow, { type Medicamento } from "@/components/FarmaciaRow.vue"
import BaseButton from "@/components/bases/BaseButton.vue"
import FormMedication from "@/components/forms/FormMedication.vue"
import BaseDialog from "@/components/bases/BaseDialog.vue"
import PageWrapper from "@/components/wrappers/PageWrapper.vue"
import HeaderWrapper from "@/components/wrappers/HeaderWrapper.vue"
import DefaultContentWrapper from "@/components/wrappers/DefaultContentWrapper.vue"
import BaseTable from "@/components/bases/BaseTable.vue"

import { useAuthStore } from "@/stores/authStore"
import Medication, { doseUnitLabels, frequencyUnitLabels } from "@/database/medication.model"
import Professional from "@/database/professional.model"
import Patient from "@/database/patient.model"
import { normalizeString } from "@/utils"

type MedicamentoGroup = Medicamento & { key: string }

const authStore = useAuthStore()

const formRegister = useTemplateRef("formRegister")
const searchQuery = ref("")
const loading = ref(true)
const loadMessage = ref("")

const prescriptions = ref<Medication[]>([])
const patientNames = ref<Record<string, string>>({})
const prescribablePatients = ref<{ id: string; name: string }[]>([])

const getPatientName = (patient: Patient | null) =>
	patient?.social_name || patient?.name || "Paciente"

const loadPatientName = async (patientId: string) => {
	if (patientNames.value[patientId]) {
		return
	}

	try {
		patientNames.value[patientId] = getPatientName(await Patient.get(patientId))
	} catch (error) {
		console.error("Failed to load patient:", error)
		patientNames.value[patientId] = getPatientName(null)
	}
}

const loadPatients = async (professional: Professional) => {
	try {
		const patientsWithPermissions = await professional.getPatientsWithPermissions()

		for (const { patient } of patientsWithPermissions) {
			patientNames.value[patient.id] = getPatientName(patient)
		}

		prescribablePatients.value = patientsWithPermissions
			.filter(({ permissions }) => permissions.permissions?.prescribe_medications)
			.map(({ patient }) => ({ id: patient.id, name: patientNames.value[patient.id]! }))
	} catch (error) {
		console.error("Failed to load patients with permissions:", error)
	}
}

const getLoadErrorMessage = (error: unknown) => {
	switch ((error as { code?: string }).code) {
		case "failed-precondition":
			return "Falta o índice de medications.prescribed_by no Firestore (veja o console)."
		case "permission-denied":
			return "Sem permissão para ler as prescrições. Verifique as regras do Firestore."
		default:
			return "Não foi possível carregar as prescrições."
	}
}

const loadData = async () => {
	loading.value = true
	loadMessage.value = ""

	try {
		await authStore.onReady(async (professional) => {
			if (!(professional instanceof Professional)) {
				return
			}

			prescriptions.value = await Medication.getAllForProfessional(professional.id)

			await loadPatients(professional)

			await Promise.all(prescriptions.value.map((item) => loadPatientName(item.patient_id)))
		})

		if (prescriptions.value.length === 0) {
			loadMessage.value = "Nenhum medicamento prescrito ainda."
		}
	} catch (error) {
		console.error("Failed to load prescriptions:", error)
		loadMessage.value = getLoadErrorMessage(error)
	} finally {
		loading.value = false
	}
}

onMounted(loadData)

const groups = computed(() => {
	const result = new Map<string, MedicamentoGroup>()

	for (const item of prescriptions.value) {
		const dose = `${item.dose_value} ${doseUnitLabels[item.dose_unit]}`
		const key = [normalizeString(item.name), dose, item.route].join("|")

		if (!result.has(key)) {
			result.set(key, { key, name: item.name, dose, route: item.route, prescriptions: [] })
		}

		const frequencyUnit = frequencyUnitLabels[item.frequency_unit]

		result.get(key)!.prescriptions.push({
			id: item.id,
			patientName: patientNames.value[item.patient_id] ?? "Paciente",
			frequency: `De ${item.frequency_value} em ${item.frequency_value} ${frequencyUnit}`,
			period: item.getPeriodString(),
		})
	}

	return [...result.values()]
})

const filteredGroups = computed(() => {
	const query = normalizeString(searchQuery.value.trim())

	return groups.value.filter((group) => normalizeString(group.name).includes(query))
})

const tableMessage = computed(() =>
	prescriptions.value.length > 0 ? "Nenhum medicamento encontrado." : loadMessage.value,
)

const deletePrescription = async (id: string) => {
	const medication = prescriptions.value.find((item) => item.id === id)
	if (!medication || !confirm("Deseja apagar esta prescrição?")) {
		return
	}

	try {
		await medication.deletePrescription()
		prescriptions.value = prescriptions.value.filter((item) => item.id !== id)
	} catch (error) {
		console.error("Failed to delete prescription:", error)
		alert("Não foi possível apagar a prescrição.")
	}
}

const handleSubmit = async (success: boolean) => {
	if (!success) {
		return
	}

	formRegister.value?.toggle()
	await loadData()
}
</script>

<template>
	<PageWrapper>
		<HeaderWrapper title="Farmácia">
			<div class="flex flex-row gap-2 justify-center *:h-[stretch]">
				<BaseButton
					type="button"
					theme="accent"
					icon="prescriptions"
					@click="formRegister?.toggle()"
					class="col-span-3 rounded-2xl"
				>
					<p class="hidden lg:block">Prescrever medicamento</p>
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
				:show-message="!loading && filteredGroups.length === 0"
				:message="tableMessage"
			>
				<template #header>
					<th class="w-120">Medicamento</th>
					<th class="w-40">Quantidade</th>
					<th class="w-40">Consumo</th>
					<th class="w-12"></th>
				</template>

				<template #default>
					<FarmaciaRow
						v-for="group in filteredGroups"
						:key="group.key"
						:medicamento="group"
						@delete="deletePrescription"
					/>
				</template>
			</BaseTable>
		</DefaultContentWrapper>

		<BaseDialog title="Prescrever Medicamento" ref="formRegister">
			<FormMedication :patients="prescribablePatients" @handled-submit="handleSubmit" />
		</BaseDialog>
	</PageWrapper>
</template>
