<script setup lang="ts">
import { computed, ref } from "vue"
import { Timestamp } from "firebase/firestore"
import { toInputValue } from "@feelinglovelynow/datetime-local"

import BaseInput from "@/components/bases/BaseInput.vue"
import BaseButton, { type ButtonState } from "@/components/bases/BaseButton.vue"
import BaseSelect from "@/components/bases/BaseSelect.vue"
import { useAuthStore } from "@/stores/authStore"
import Medication, {
	type MedicationRoute,
	type MedicationDoseUnit,
	type MedicationFrequencyUnit,
} from "@/database/medication.model"

const emit = defineEmits<{
	close: []
}>()

const authStore = useAuthStore()
const buttonState = ref<ButtonState>("enabled")
const errorMessage = ref("")

const routes: { value: MedicationRoute; label: string }[] = [
	{ value: "oral", label: "Oral" },
	{ value: "sublingual", label: "Sublingual" },
	{ value: "externo", label: "Externo" },
	{ value: "inalatorio", label: "Inalatório" },
	{ value: "retal", label: "Retal" },
	{ value: "oftalmico", label: "Oftálmico" },
]

const doseUnits: { value: MedicationDoseUnit; label: string }[] = [
	{ value: "miligrama", label: "mg" },
	{ value: "grama", label: "g" },
	{ value: "micrograma", label: "mcg" },
	{ value: "mililitro", label: "ml" },
	{ value: "unidade_internacional", label: "UI" },
	{ value: "tablete", label: "Tablete(s)" },
]

const frequencyUnits: { value: MedicationFrequencyUnit; label: string }[] = [
	{ value: "minuto", label: "minutos" },
	{ value: "hora", label: "horas" },
	{ value: "dia", label: "dias" },
	{ value: "semana", label: "semanas" },
	{ value: "mes", label: "meses" },
]

const title = ref("")
const route = ref("")
const doseValue = ref("")
const doseUnit = ref("")
const frequencyValue = ref("")
const frequencyUnit = ref("hora")
const durationDays = ref("")
const startAt = ref<Timestamp | null>(null)

const startAtInput = computed({
	get: () => (startAt.value ? toInputValue(startAt.value.toDate()) : ""),
	set: (value) => {
		startAt.value = value ? Timestamp.fromDate(new Date(value)) : null
	},
})

async function submit() {
	errorMessage.value = ""

	const userId = authStore.user?.uid
	if (!userId) {
		errorMessage.value = "Você precisa estar logado para adicionar um medicamento."
		return
	}

	if (!startAt.value) {
		errorMessage.value = "Informe a data e a hora da primeira dose."
		return
	}

	const dose = Number(doseValue.value)
	const frequency = Number(frequencyValue.value)
	const duration = Number(durationDays.value)

	if (!(dose > 0) || !(frequency > 0) || !(duration > 0)) {
		errorMessage.value = "Quantidade, frequência e duração precisam ser maiores que zero."
		return
	}

	buttonState.value = "sync"

	try {
		const medication = new Medication(
			"",
			title.value.trim(),
			route.value as MedicationRoute,
			dose,
			doseUnit.value as MedicationDoseUnit,
			frequency,
			frequencyUnit.value as MedicationFrequencyUnit,
			duration,
			startAt.value,
		)

		Medication.set(medication.toMap(), { scope: { userId } })

		emit("close")
	} catch (error) {
		console.error("Erro ao salvar medicamento:", error)
		errorMessage.value = "Não foi possível salvar. Tente novamente."
	} finally {
		buttonState.value = "enabled"
	}
}
</script>

<template>
	<form
		class="flex w-full flex-col gap-4"
		@submit.prevent="submit"
	>
		<label>
			<p class="text-textLight">Nome do medicamento</p>
			<BaseInput
				v-model="title"
				placeholder="Escreva o nome do medicamento"
				theme="light"
				required
			/>
		</label>

		<label>
			<p class="text-textLight">Tipo de consumo</p>
			<BaseSelect
				v-model="route"
				icon="medication"
				theme="light"
				defaultValue="Selecione o consumo"
				required
			>
				<option v-for="item in routes" :key="item.value" :value="item.value">
					{{ item.label }}
				</option>
			</BaseSelect>
		</label>

		<fieldset class="grid grid-cols-2 gap-4">
			<label>
				<p class="text-textLight">Quantidade</p>
				<BaseInput
					v-model="doseValue"
					type="custom-number"
					number-mode="positive-decimal"
					placeholder="Ex: 500"
					theme="light"
					required
				/>
			</label>

			<label>
				<p class="text-textLight">Unidade</p>
				<BaseSelect
					v-model="doseUnit"
					theme="light"
					defaultValue="Unidade"
					required
				>
					<option v-for="item in doseUnits" :key="item.value" :value="item.value">
						{{ item.label }}
					</option>
				</BaseSelect>
			</label>
		</fieldset>

		<fieldset class="grid grid-cols-2 gap-4">
			<label>
				<p class="text-textLight">De quanto em quanto</p>
				<BaseInput
					v-model="frequencyValue"
					type="custom-number"
					number-mode="positive-integer"
					placeholder="Ex: 8"
					theme="light"
					required
				/>
			</label>

			<label>
				<p class="text-textLight">Medido em</p>
				<BaseSelect v-model="frequencyUnit" theme="light" required>
					<option
						v-for="item in frequencyUnits"
						:key="item.value"
						:value="item.value"
					>
						{{ item.label }}
					</option>
				</BaseSelect>
			</label>
		</fieldset>

		<label>
			<p class="text-textLight">Primeira dose</p>
			<BaseInput
				v-model="startAtInput"
				type="datetime-local"
				theme="light"
				required
			/>
		</label>

		<label>
			<p class="text-textLight">Duração do tratamento (dias)</p>
			<BaseInput
				v-model="durationDays"
				type="custom-number"
				number-mode="positive-integer"
				placeholder="Ex: 7"
				theme="light"
				required
			/>
		</label>

		<p v-if="errorMessage" class="text-center text-sm text-error">
			{{ errorMessage }}
		</p>

		<BaseButton
			type="submit"
			theme="accent"
			class="m-auto px-10"
			:state="buttonState"
		>
			Registrar Medicamento
		</BaseButton>
	</form>
</template>
