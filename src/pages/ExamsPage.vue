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
import { useToast } from "vue-toastification"

const route = useRoute()
const authStore = useAuthStore()
const toast = useToast()

const registerFormVisible = ref(false)
const updateFormVisible = ref(false)

const exames = ref<Exam[]>([])
const currentUser = ref<Patient | Professional | null>(null)
const currentPermission = ref<MedicalPermission | null>(null)
const forProfessionalData = ref<PatientWithProfessionalPermission[]>([])
const currentPatient = ref<Patient | null>(null)
const loadingPatients = ref(true)
const loadingExams = ref(true)
const searchQuery = ref("")
const formRegister = useTemplateRef("formRegister")

const userType = computed(() => currentUser.value?.user_type)
const examPatient = computed(() =>
	currentUser.value instanceof Patient ? currentUser.value : currentPatient.value,
)
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

const loading = ref(true)
let unsubscribe: (() => void) | null = null
watch(
	() => examPatient.value?.id,
	(userId) => {
		unsubscribe?.()
		unsubscribe = null
		loading.value = true

		if (!userId) {
			exames.value = []
			loading.value = false
			return
		}

		unsubscribe = Exam.listen(
			(list) => {
				exames.value = list
				loading.value = false
			},
			{ scope: { userId } },
			(error) => {
				console.error("Failed to load exams:", error)
				toast.error("Não foi possível carregar os exames.")
				loading.value = false
			},
		)
	},
	{ immediate: true },
)

const loadPatientExams = async (patient: Patient) => {
	loadingExams.value = true
	try {
		exames.value = await Exam.getAll({ scope: { userId: patient.id } })
	} catch (error) {
		console.error("Failed to load patient's exams.", error)
		toast.error("Não foi possível carregar os exames.")
	} finally {
		loadingExams.value = false
	}
}

const selectPatient = async (item: PatientWithProfessionalPermission) => {
	if (currentPatient.value === item.patient) return
	currentPatient.value = item.patient
	currentPermission.value = item.permissions
	await loadPatientExams(item.patient)
}

const unselectPatient = () => {
	currentPatient.value = null
	loadingPatients.value = false
	loadingExams.value = false
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
		toast.error("Não foi possível carregar os dados.")
	} finally {
		loadingPatients.value = false
		loadingExams.value = false
	}
})

const selectedExam = ref<Exam | null>(null)
const updateExam = async (exam: Exam) => {
	updateFormVisible.value = true
	selectedExam.value = exam
}

const deleteExam = async (exam: Exam) => {
	const patient = examPatient.value
	if (!patient) return

	try {
		await Exam.delete(exam.id, { scope: { userId: patient.id } })
		toast.success("Exame excluído com sucesso.")
	} catch (error) {
		console.error("Failed to delete exam:", error)
		toast.error("Não foi possível excluir o exame.")
	}
}
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
					@click="registerFormVisible = true"
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

				<BaseCardList :is-loading="loadingPatients" class="w-full flex flex-col gap-2">
					<PatientCard
						v-for="item in filteredProfessionalData"
						:key="item.patient.id"
						:class="currentPatient === item.patient ? 'bg-accent!' : ''"
						:patient="item.patient"
						@selected="selectPatient(item)"
					/>
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
						@click="registerFormVisible = true"
						class="self-end"
					>
						Solicitar exame
					</BaseButton>
				</div>

				<BaseTable
					:is-loading="loadingExams"
					:show-message="filteredExams.length === 0"
					message="Nenhum exame encontrado"
				>
					<template #header>
						<th class="w-70">Exame</th>
						<th class="w-70">Local</th>
						<th class="w-30">Data</th>
						<th class="w-40">Status</th>
						<th class="w-12	"></th>
					</template>

					<template #default>
						<ExamRow v-for="exam in filteredExams" :key="exam.id" :exam="exam"
						@update:exam="updateExam($event)" @delete:exam="deleteExam($event)" />
					</template>
				</BaseTable>
			</div>
		</DefaultContentWrapper>

		<BaseDialog
			v-if="examPatient"
			:title="
				userType === 'patient'
					? 'Adicionar exame'
					: 'Solicitar exame de ' + examPatient.name
			"
			v-model:visible="registerFormVisible"
		>
			<FormExamRequest
				:patient="examPatient"
				:is-patient="userType === 'patient'"
				@close="registerFormVisible = false"
			/>
		</BaseDialog>

		<BaseDialog
			v-if="examPatient"
			title="Atualizar exame"
			v-model:visible="updateFormVisible"
		>
			<FormExamRequest
				:patient="examPatient"
				:exam="selectedExam"
				@close="updateFormVisible = false"
			/>
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
