<script setup lang="ts">
import { computed, ref, useTemplateRef } from "vue"
import BaseInput from "@/components/bases/BaseInput.vue"
import Exam from "@/database/exam.model"
import ExamRow from "@/components/ExamRow.vue"
import { useAuthStore } from "@/stores/authStore"
import Patient from "@/database/patient.model"
import Professional, { type PatientWithProfessionalPermission } from "@/database/professional.model"
import PatientCard from "@/components/cards/PatientCard.vue"
import BaseDialog from "@/components/bases/BaseDialog.vue"
import BaseButton from "@/components/bases/BaseButton.vue"
import FormExamRequest from "@/components/forms/FormExamRequest.vue"
import MedicalPermission from "@/database/medicalPermission.model"
import PageWrapper from "@/components/wrappers/PageWrapper.vue"
import HeaderWrapper from "@/components/wrappers/HeaderWrapper.vue"
import DefaultContentWrapper from "@/components/wrappers/DefaultContentWrapper.vue"
import { searchDocuments } from "@/utils"
import BaseTable from "@/components/bases/BaseTable.vue"
import BaseCardList from "@/components/bases/BaseCardList.vue"

const authStore = useAuthStore()

const exames = ref<Exam[]>([])
const currentUser = ref<Patient | Professional | null>(null)
const currentPermission = ref<MedicalPermission | null>(null)
const forProfessionalData = ref<PatientWithProfessionalPermission[]>([])
const currentPatient = ref<Patient | null>(null)
const loadError = ref("")
const loading = ref(true)
const searchQuery = ref("")
const formRegister = useTemplateRef("formRegister")

const userType = computed(() => currentUser.value?.user_type)
const filteredProfessionalData = computed(() => {
	const matchingPatientIds = new Set(
		searchDocuments(
			forProfessionalData.value.map(({ patient }) => patient),
			searchQuery.value,
		).map((patient) => patient.id),
	)
	return forProfessionalData.value.filter(({ patient }) => matchingPatientIds.has(patient.id))
})
const filteredExams = computed(() => searchDocuments(exames.value, searchQuery.value) as Exam[])
const pageTitle = computed(() =>
	userType.value === "patient"
		? "Meus Exames"
		: userType.value === "professional"
			? "Exames dos Pacientes"
			: "Exames",
)
const canRequestExam = computed(
	() => currentPermission.value !== null && currentPermission.value.permissions.request_exam,
)

const handleSubmit = async () => {
	formRegister.value?.hide()
	if (currentPatient.value && currentPermission.value) {
		await selectPatient({
			patient: currentPatient.value,
			permissions: currentPermission.value,
		})
	}
}

const selectPatient = async (item: PatientWithProfessionalPermission) => {
	currentPatient.value = item.patient
	currentPermission.value = item.permissions
	searchQuery.value = ""
	loading.value = true
	loadError.value = ""
	try {
		exames.value = await Exam.getAll({ scope: { userId: item.patient.id } })
	} catch (error) {
		console.error("Failed to load patient's exams.", error)
		loadError.value = "Não foi possível carregar os exames."
	} finally {
		loading.value = false
	}
}

authStore.onReady(async (user) => {
	try {
		if (!(user instanceof Patient || user instanceof Professional)) {
			return
		}

		currentUser.value = user

		if (user instanceof Patient) {
			exames.value = await Exam.getAll({ scope: { userId: user.id } })
		} else {
			forProfessionalData.value = await user.getPatientsWithPermissions()
		}
	} catch (error) {
		console.error("Failed to load exams page data.", error)
		loadError.value = "Não foi possível carregar os dados."
	} finally {
		loading.value = false
	}
})
</script>

<template>
	<PageWrapper>
		<HeaderWrapper :title="pageTitle">
			<BaseInput
				v-model="searchQuery"
				placeholder="Pesquisar"
				icon="search"
				class="place-self-center w-full md:w-120"
			/>
		</HeaderWrapper>

		<DefaultContentWrapper>
			<div
				v-if="userType === 'professional'"
				class="w-full lg:w-96 shrink-0 max-h-full overflow-hidden flex flex-col gap-2 overflow-y-auto scrollbar-hide"
				:class="[currentPatient ? 'hidden lg:flex' : '']"
			>
				<article class="flex text-textLight items-center">
					<span class="material-symbols-rounded text-3xl!"> person </span>

					<p class="text-2xl pl-2">Pacientes</p>
				</article>

				<p v-if="loadError" class="text-error text-center">
					{{ loadError }}
				</p>

				<BaseCardList :is-loading="loading" class="w-full flex flex-col gap-2">
					<li v-for="item in filteredProfessionalData" :key="item.patient.id">
						<PatientCard
							:class="currentPatient === item.patient ? 'bg-accent!' : ''"
							:patient="item.patient"
							@selected="selectPatient(item)"
						/>
					</li>
				</BaseCardList>
			</div>

			<div class="w-full flex flex-col gap-4">
				<BaseButton
					v-if="userType === 'professional'"
					type="button"
					theme="accent"
					icon="add"
					:state="canRequestExam ? 'enabled' : 'disabled'"
					@click="formRegister?.show()"
					class="self-end"
				>
					Solicitar exame
				</BaseButton>

				<BaseTable
					:is-loading="loading"
					:show-message="filteredExams.length === 0"
					:message="loadError || 'Nenhum exame encontrado'"
				>
					<template #header>
						<th class="w-70">Exame</th>
						<th class="w-70">Local</th>
						<th class="w-30">Data</th>
						<th class="w-40">Status</th>
						<th class="w-12	"></th>
					</template>

					<template #default>
						<ExamRow v-for="exam in filteredExams" :key="exam.id" :exam="exam" />
					</template>
				</BaseTable>
			</div>
		</DefaultContentWrapper>

		<BaseDialog
			v-if="userType === 'professional' && currentPatient"
			:title="'Solicitar exame de ' + currentPatient.name"
			ref="formRegister"
		>
			<FormExamRequest :patient="currentPatient" @handled-submit="handleSubmit" />
		</BaseDialog>
	</PageWrapper>
</template>

<style scoped>
@reference "@/assets/main.css";

td,
th {
	@apply p-3;
}
</style>
