<script setup lang="ts">
import BaseButton, { type ButtonState } from "@/components/bases/BaseButton.vue"
import BaseInput from "@/components/bases/BaseInput.vue"
import type Patient from "@/database/patient.model"
import Appointment, { type AppointmentMotivation } from "@/database/appointment.model"
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

const motivations: { value: AppointmentMotivation; label: string; icon: string }[] = [
	{ value: "Rotina", label: "Rotina", icon: "calendar_month" },
	{ value: "Prevenção", label: "Prevenção", icon: "health_and_safety" },
	{ value: "Sintomas", label: "Sintomas", icon: "health_metrics" },
	{ value: "Entrega de exames", label: "Entrega de exames", icon: "science" },
	{ value: "Complicações ou condições crônicas", label: "Complicações ou condições crônicas", icon: "warning" },
]

const emit = defineEmits<{
	"handled-submit": []
}>()

const appointment = ref<Appointment>(new Appointment())
const date = ref("")

const buttonState = ref<ButtonState>("enabled")
const submitError = ref("")

const submitForm = async () => {
	buttonState.value = "sync"
	submitError.value = ""

	try {
		appointment.value.date = Timestamp.fromDate(inputDateToDate(date.value))

		await Appointment.set(appointment.value.toMap(), { scope: { userId: props.patient.id } })

		appointment.value = new Appointment()
		date.value = ""
		emit("handled-submit")
	} catch (error) {
		console.error("Failed to request appointment.", error)
		submitError.value = "Não foi possível solicitar a consulta. Tente novamente."
	} finally {
		buttonState.value = "enabled"
	}
}
</script>

<template>
	<form @submit.prevent="submitForm" class="flex flex-col gap-4">
		<BaseInput
			v-model="appointment.details"
			placeholder="Nome da consulta"
			icon="medical_services"
			required
		/>

		<BaseInput v-model="appointment.hospital" placeholder="Local" icon="location_on" required />
		<BaseInput v-model="date" type="date" icon="calendar_today" required />

		<BaseRadioList
			v-model="appointment.motivation"
			name="appointment-motivation"
			legend="Motivação"
			:options="motivations"
		/>

		<p v-if="submitError" class="text-error text-center">
			{{ submitError }}
		</p>

		<BaseButton type="submit" theme="accent" icon="add_circle" :state="buttonState">
			{{ props.isPatient ? "Adicionar consulta" : "Solicitar consulta" }}
		</BaseButton>
	</form>
</template>
