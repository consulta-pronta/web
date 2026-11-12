<script setup lang="ts">
import { computed, ref } from "vue"
import { addDoc, collection, Timestamp } from "firebase/firestore"
import { toInputValue } from "@feelinglovelynow/datetime-local"

import BaseInput from "@/components/bases/BaseInput.vue"
import BaseButton, { type ButtonState } from "@/components/bases/BaseButton.vue"
import BaseSelect from "@/components/bases/BaseSelect.vue"
import { db } from "@/database/firebase"
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
	{ value: "Oral", label: "Oral" },
	{ value: "Sublingual", label: "Sublingual" },
	{ value: "Externo", label: "Externo" },
	{ value: "Inalatorio", label: "Inalatório" },
	{ value: "Retal", label: "Retal" },
	{ value: "Oftalmico", label: "Oftálmico" },
]

const doseUnits: { value: MedicationDoseUnit; label: string }[] = [
	{ value: "Miligrama", label: "mg" },
	{ value: "Grama", label: "g" },
	{ value: "Micrograma", label: "mcg" },
	{ value: "Mililitro", label: "ml" },
	{ value: "Unidade_Internacional", label: "UI" },
	{ value: "Tablete", label: "Tablete(s)" },
]

const frequencyUnits: { value: MedicationFrequencyUnit; label: string }[] = [
	{ value: "Minuto", label: "minutos" },
	{ value: "Hora", label: "horas" },
	{ value: "Dia", label: "dias" },
	{ value: "Semana", label: "semanas" },
	{ value: "Mes", label: "meses" },
]

const title = ref("")
const route = ref("")
const doseValue = ref("")
const doseUnit = ref("")
const frequencyValue = ref("")
const frequencyUnit = ref("Hora")
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
	<Teleport to="body">
		<div
			class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
			@click.self="emit('close')"
		>
			<form
				class="flex w-full max-w-md max-h-[90vh] flex-col gap-4 overflow-y-auto rounded-[20px] bg-primaryDark p-6 shadow-xl scrollbar-hide"
				@submit.prevent="submit"
			>
				<header class="relative flex items-center justify-center">
					<button
						type="button"
						class="material-symbols-rounded absolute left-0 cursor-pointer text-textLight"
						@click="emit('close')"
					>
						arrow_back
					</button>
					<h2 class="text-xl font-semibold text-textLight">Adicionar Medicamento</h2>
				</header>

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

				<div class="grid grid-cols-2 gap-4">
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
				</div>

				<div class="grid grid-cols-2 gap-4">
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
				</div>

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
		</div>
	</Teleport>
</template>
