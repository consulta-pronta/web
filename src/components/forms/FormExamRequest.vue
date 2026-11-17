<script setup lang="ts">
import BaseButton, { type ButtonState } from "@/components/bases/BaseButton.vue"
import BaseInput from "@/components/bases/BaseInput.vue"
import type Patient from "@/database/patient.model"
import Exam, { type ExamCategory } from "@/database/exam.model"
import { inputDateToDate } from "@/utils"
import { Timestamp } from "firebase/firestore"
import { ref } from "vue"
import BaseRadioList from "../bases/BaseRadioList.vue"

const props = withDefaults(
	defineProps<{
		patient: Patient
		isPatient?: boolean
	}>(),
	{
		isPatient: false,
	},
)

const categories: { value: ExamCategory; label: string; icon: string }[] = [
	{ value: "laboratorial", label: "Laboratorial", icon: "bloodtype" },
	{ value: "imagem", label: "Imagem", icon: "radiology" },
	{ value: "funcional", label: "Funcional", icon: "monitor_heart" },
	{ value: "preventivo", label: "Preventivo", icon: "health_and_safety" },
]

const emit = defineEmits<{
	"handled-submit": []
}>()

const exam = ref<Exam>(new Exam())
const date = ref("")

const buttonState = ref<ButtonState>("enabled")
const submitError = ref("")

const submitForm = async () => {
	buttonState.value = "sync"
	submitError.value = ""

	try {
		exam.value.date = Timestamp.fromDate(inputDateToDate(date.value))
		exam.value.type = exam.value.category

		await Exam.set(exam.value.toMap(), { scope: { userId: props.patient.id } })

		exam.value = new Exam()
		date.value = ""
		emit("handled-submit")
	} catch (error) {
		console.error("Failed to request exam.", error)
		submitError.value = "Não foi possível solicitar o exame. Tente novamente."
	} finally {
		buttonState.value = "enabled"
	}
}
</script>

<template>
	<form @submit.prevent="submitForm" class="flex flex-col gap-4">
		<BaseInput
			v-model="exam.name"
			placeholder="Nome do exame"
			icon="medical_services"
			required
		/>

		<BaseInput v-model="exam.place" placeholder="Local" icon="location_on" required />
		<BaseInput v-model="date" type="date" icon="calendar_today" required />

		<BaseRadioList
			v-model="exam.category"
			name="exam-category"
			legend="Categoria"
			:options="categories"
		/>

		<p v-if="submitError" class="text-error text-center">
			{{ submitError }}
		</p>

		<BaseButton type="submit" theme="accent" icon="add_circle" :state="buttonState">
			{{ props.isPatient ? "Adicionar exame" : "Solicitar exame" }}
		</BaseButton>
	</form>
</template>
