<script setup lang="ts">
import { ref } from "vue"
import { Timestamp } from "firebase/firestore"

import BaseInput from "@/components/bases/BaseInput.vue"
import BaseButton, { type ButtonState } from "@/components/bases/BaseButton.vue"
import BaseSelect from "@/components/bases/BaseSelect.vue"
import { useAuthStore } from "@/stores/authStore"
import { inputDateToDate } from "@/utils"
import Medication, {
	doseUnitLabels,
	type MedicationRoute,
	type MedicationDoseUnit,
} from "@/database/medication.model"

defineProps<{
	patients: { id: string; name: string }[]
}>()

const emit = defineEmits<{
	(e: "handled-submit", success: boolean): void
}>()

const MAX_FREQUENCY_HOURS = 72

const authStore = useAuthStore()
const buttonState = ref<ButtonState>("enabled")
const errorMessage = ref("")

const vias: { value: MedicationRoute; label: string }[] = [
	{ value: "oral", label: "Oral" },
	{ value: "sublingual", label: "Sublingual" },
	{ value: "externo", label: "Externo (tópico)" },
	{ value: "inalatorio", label: "Inalatório" },
	{ value: "retal", label: "Retal" },
	{ value: "oftalmico", label: "Oftálmico" },
]

const doseUnits = Object.entries(doseUnitLabels) as [MedicationDoseUnit, string][]

const patientId = ref("")
const name = ref("")
const route = ref("")
const doseValue = ref("")
const doseUnit = ref("")
const everyHours = ref("")
const startDate = ref("")
const endDate = ref("")
const notes = ref("")

function reset() {
	patientId.value = ""
	name.value = ""
	route.value = ""
	doseValue.value = ""
	doseUnit.value = ""
	everyHours.value = ""
	startDate.value = ""
	endDate.value = ""
	notes.value = ""
	errorMessage.value = ""
}

async function registrarPrescricao() {
	errorMessage.value = ""

	const professionalId = authStore.user?.uid
	if (!professionalId) {
		errorMessage.value = "Você precisa estar logado."
		return
	}

	const dose = Number(doseValue.value)
	const frequency = Number(everyHours.value)

	if (!(dose > 0) || !(frequency > 0)) {
		errorMessage.value = "Dosagem e intervalo precisam ser maiores que zero."
		return
	}

	if (frequency > MAX_FREQUENCY_HOURS) {
		errorMessage.value = `O intervalo máximo é de ${MAX_FREQUENCY_HOURS} horas.`
		return
	}

	const start = inputDateToDate(startDate.value)
	const end = inputDateToDate(endDate.value)
	const duration = Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1

	if (!(duration >= 1)) {
		errorMessage.value = "A data final precisa ser igual ou posterior à inicial."
		return
	}

	buttonState.value = "sync"

	try {
		const medication = new Medication(
			"",
			name.value.trim(),
			route.value as MedicationRoute,
			dose,
			doseUnit.value as MedicationDoseUnit,
			frequency,
			"hora",
			duration,
			Timestamp.fromDate(start),
		)
		medication.notes = notes.value.trim()

		await Medication.prescribe(patientId.value, professionalId, medication)

		reset()
		emit("handled-submit", true)
	} catch (error) {
		console.error("Erro ao prescrever medicamento:", error)
		errorMessage.value =
			"Não foi possível prescrever. Verifique se você tem permissão para este paciente."
		emit("handled-submit", false)
	} finally {
		buttonState.value = "enabled"
	}
}
</script>

<template>
	<form @submit.prevent="registrarPrescricao" class="flex flex-col gap-4 z-48">
		<label>
			<p>Para qual paciente?</p>

			<BaseSelect
				v-model="patientId"
				icon="person"
				theme="light"
				defaultValue="Paciente"
				required
			>
				<template v-for="paciente in patients" :key="paciente.id">
					<option :value="paciente.id">{{ paciente.name }}</option>
				</template>
			</BaseSelect>
		</label>

		<label>
			<p>Qual medicamento?</p>
			<BaseInput
				v-model="name"
				type="text"
				placeholder="Nome do medicamento"
				theme="light"
				required
			/>
		</label>

		<label>
			<p>Qual a via de consumo?</p>

			<BaseSelect
				v-model="route"
				icon="medication"
				theme="light"
				defaultValue="Via de consumo"
				required
			>
				<template v-for="via in vias" :key="via.value">
					<option :value="via.value">Consumo {{ via.label }}</option>
				</template>
			</BaseSelect>
		</label>

		<div>
			<p>Qual a dosagem?</p>
			<div class="flex gap-4 w-full">
				<BaseInput
					v-model="doseValue"
					type="custom-number"
					number-mode="positive-decimal"
					placeholder="Ex: 500"
					theme="light"
					class="grow"
					required
				/>
				<BaseSelect v-model="doseUnit" theme="light" defaultValue="Unidade" required>
					<template v-for="[value, label] in doseUnits" :key="value">
						<option :value="value">{{ label }}</option>
					</template>
				</BaseSelect>
			</div>
		</div>

		<label>
			<p>De quanto em quanto tempo?</p>
			<div class="flex flex-row items-center gap-4 text-textLight w-full">
				A cada
				<BaseInput
					v-model="everyHours"
					type="custom-number"
					number-mode="positive-integer"
					placeholder="Ex: 8"
					theme="light"
					class="grow"
					required
				/>
				horas
			</div>
		</label>

		<div>
			<p>Durante qual período?</p>
			<fieldset class="flex gap-4 w-full">
				<label class="grow">
					<span class="text-sm">Início</span>
					<BaseInput v-model="startDate" type="date" theme="light" required />
				</label>

				<label class="grow">
					<span class="text-sm">Fim</span>
					<BaseInput v-model="endDate" type="date" theme="light" required />
				</label>
			</fieldset>
		</div>

		<label>
			<p>Observações</p>
			<BaseInput
				v-model="notes"
				theme="light"
				placeholder="Orientações adicionais, como tomar após as refeições"
			/>
		</label>

		<p v-if="errorMessage" class="text-center text-sm text-error">{{ errorMessage }}</p>

		<BaseButton type="submit" theme="accent" class="m-auto px-10" :state="buttonState">
			Prescrever Medicamento
		</BaseButton>
	</form>
</template>
