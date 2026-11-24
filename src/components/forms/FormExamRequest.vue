<script setup lang="ts">
import BaseButton, { type ButtonState } from "@/components/bases/BaseButton.vue"
import BaseInput from "@/components/bases/BaseInput.vue"
import Patient from "@/database/patient.model"
import Professional from "@/database/professional.model"
import Exam, { type ExamCategory, type ExamStatus } from "@/database/exam.model"
import { Timestamp } from "firebase/firestore"
import { ref, watch, computed } from "vue"
import BaseRadioList from "../bases/BaseRadioList.vue"
import { useToast } from "vue-toastification"
import { useAuthStore } from "@/stores/authStore"
import { toInputValue } from "@feelinglovelynow/datetime-local"

const authStore = useAuthStore()
const toast = useToast()
const buttonState = ref<ButtonState>("enabled")

const currentUser = ref<Patient | Professional | null>(null)
const userType = computed(() => currentUser.value?.user_type)

const props = defineProps<{
	patient: Patient
	exam?: Exam | null
}>()


const categories: { value: ExamCategory; label: string; icon: string }[] = [
	{ value: "laboratorial", label: "Laboratorial", icon: "bloodtype" },
	{ value: "imagem", label: "Imagem", icon: "radiology" },
	{ value: "funcional", label: "Funcional", icon: "monitor_heart" },
	{ value: "preventivo", label: "Preventivo", icon: "health_and_safety" },
]

const emit = defineEmits<{
	"close": []
}>()

const dateInput = computed({
	get: () => (date.value ? toInputValue(date.value.toDate()) : ""),
	set: (value) => {
		date.value = value ? Timestamp.fromDate(new Date(value)) : null
	},
})

const category = ref("")
const name = ref("")
const place = ref("")
const date = ref<Timestamp | null>(null)
const type = ref("")
const status = ref("")

watch(() => props.exam, (newExam) => {
	if (newExam) {
		category.value = newExam.category
		name.value = newExam.name
		place.value = newExam.place
		date.value = newExam.date
		type.value = newExam.type
		status.value = newExam.status
	}
})

const submitForm = async () => {
	buttonState.value = "sync"

	try {
		const exam = new Exam(
			"",
			name.value,
			category.value as ExamCategory,
			type.value,
			place.value,
			date.value,
			status.value as ExamStatus,
		)

		if (props.exam) {
			await Exam.update(props.exam.id, exam.toMap(), { scope: { userId: props.patient.id } })
			toast.success("Exame atualizado com sucesso.")
		} else {
			exam.status = "solicitado"
			await Exam.set(exam.toMap(), { scope: { userId: props.patient.id } })
			toast.success("Exame adicionado com sucesso.")
		}

		emit("close")
	} catch (error) {
		console.error("Failed to request exam.", error)
		toast.error("Não foi possível solicitar o exame. Tente novamente.")
	} finally {
		buttonState.value = "enabled"
	}
}
</script>

<template>
	<form @submit.prevent="submitForm" class="flex flex-col gap-4">
		<BaseInput
			v-model="name"
			placeholder="Nome do exame"
			icon="medical_services"
			required
		/>

		<BaseInput v-model="place" placeholder="Local" icon="location_on" required />
		<BaseInput v-model="dateInput" type="datetime-local" icon="calendar_today" required />

		<BaseRadioList
			v-model="category"
			name="exam-category"
			legend="Categoria"
			:options="categories"
		/>

		<BaseButton type="submit" theme="accent" icon="add_circle" :state="buttonState">
			{{ props.exam ? "Atualizar exame" : "Adicionar exame" }}
		</BaseButton>
	</form>
</template>
