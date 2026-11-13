<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from "vue"
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
import router from "@/router"
import { useRoute } from "vue-router"

const route = useRoute()
const authStore = useAuthStore()

const exames = ref<Exam[]>([])
const currentUser = ref<Patient | Professional | null>(null)
const currentPermission = ref<MedicalPermission | null>(null)
const forProfessionalData = ref<PatientWithProfessionalPermission[]>([])
const currentPatient = ref<Patient | null>(null)
const loadError = ref("")
const loadingPatients = ref(true)
const loadingExams = ref(false)
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
	if (currentPatient.value === item.patient) return
	currentPatient.value = item.patient
	currentPermission.value = item.permissions
	loadingExams.value = true
	loadError.value = ""
	try {
		exames.value = await Exam.getAll({ scope: { userId: item.patient.id } })
	} catch (error) {
		console.error("Failed to load patient's exams.", error)
		loadError.value = "Não foi possível carregar os exames."
	} finally {
		loadingExams.value = false
	}
}

const unselectPatient = () => {
	currentPatient.value = null
	loadingPatients.value = false
	loadingExams.value = false
	loadError.value = ""
	exames.value = []
}

watch(currentPatient, (value) => {
	if (value) {
		router.replace({
			name: route.name,
			params: { id: value.id },
		})
	} else {
		router.replace({ name: route.name })
	}
})

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
		loadingPatients.value = false
	}
})
</script>

<template>
	<PageWrapper>
		<HeaderWrapper :title="pageTitle">
			<div class="flex flex-row gap-2 justify-center *:h-[stretch]">
				<BaseButton
					v-if="userType === 'patient'"
					type="button"
					theme="accent"
					icon="note_add"
					@click="formRegister?.toggle()"
					class="col-span-3 rounded-2xl"
				>
					<p class="hidden lg:block">Adicionar Exame</p>
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

				<BaseCardList :is-loading="loadingPatients" class="w-full flex flex-col gap-2">
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
				<div class="flex flex-row justify-between">
					<button
						v-if="userType === 'professional'" 
						type="button"
						class="cursor-pointer flex justify-center items-center size-11 text-textLight"
						:class="!currentPatient ? 'invisible' : ''"
						@click.prevent="unselectPatient"
					>
						<span class="material-symbols-rounded rounded-full p-1 hover:bg-primaryLight/10">
							arrow_back
						</span>
					</button>

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
				</div>

				<BaseTable
					:is-loading="loadingExams"
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
