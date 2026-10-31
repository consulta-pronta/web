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

const authStore = useAuthStore()

const exames = ref<Exam[]>([])
const currentUser = ref<Patient | Professional | null>(null)
const currentPermission = ref<MedicalPermission | null>(null)
const forProfessionalData = ref<PatientWithProfessionalPermission[]>([])
const currentPatient = ref<Patient | null>(null)
const loadError = ref("")
const formRegister = useTemplateRef("formRegister")

const userType = computed(() => currentUser.value?.user_type)
const pageTitle = computed(() =>
	userType.value === "patient"
		? "Meus Exames"
		: userType.value === "professional"
			? "Exames dos Pacientes"
			: "Exames",
)
const canRequestExam = computed(() =>
	currentPermission.value !== null
	&& currentPermission.value.permissions.request_exam
)

const handleSubmit = async () => {
	formRegister.value?.hide()
	if (currentPatient.value && currentPermission.value) {
		await selectPatient({
			patient: currentPatient.value,
			permissions: currentPermission.value
		})
	}
}

const selectPatient = async (item: PatientWithProfessionalPermission) => {
	currentPatient.value = item.patient
	currentPermission.value = item.permissions
	exames.value = await Exam.getAll({ scope: { userId: item.patient.id } })
}

authStore.onReady(async (user) => {
	if (!(user instanceof Patient || user instanceof Professional)) {
		return
	}

	currentUser.value = user

	if (user instanceof Patient) {
		exames.value = await Exam.getAll({ scope: { userId: user.id } })
	} else if (user instanceof Professional) {
		try {
			forProfessionalData.value = await user.getPatientsWithPermissions()
		} catch (error) {
			console.error("Failed to load professional's patients.", error)
			loadError.value = "Não foi possível carregar os pacientes."
		}
	}
})
</script>

<template>
	<PageWrapper>
		<HeaderWrapper :title="pageTitle">
			<BaseInput
				placeholder="Pesquisar"
				icon="search"
				class="place-self-center w-full md:w-120"
			/>
		</HeaderWrapper>

		<DefaultContentWrapper>
			<div
				v-if="userType === 'professional'"
				class="w-full lg:w-96 shrink-0 max-h-full overflow-hidden flex flex-col gap-2 overflow-y-auto scrollbar-hide"
				:class="[currentUser ? 'hidden lg:flex' : '']"
			>
				<article class="flex text-textLight items-center">
					<span class="material-symbols-rounded text-3xl!">
						person
					</span>

					<p class="text-2xl pl-2">
						Pacientes
					</p>
				</article>

				<p
					v-if="loadError"
					class="text-error text-center"
				>
					{{ loadError }}
				</p>

				<ul class="w-full flex flex-col gap-2">
					<li
						v-for="item in forProfessionalData"
						:key="item.patient.id"
					>
						<PatientCard
							:class="currentPatient === item.patient ? 'bg-accent!' : ''"
							:patient="item.patient"
							@selected="selectPatient(item)"
						/>
					</li>
				</ul>
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

				<div class="w-full max-h-[55vh] overflow-y-auto rounded-xl scrollbar-hide h-fit">
					<table class="w-full text-textDark bg-surface">
						<thead class="font-bold sticky top-0 z-1">
							<tr class="bg-surface shadow-[inset_0_-2px_0_var(--color-primaryDark)]">
								<th>Exame</th>
								<th>Local</th>
								<th>Data</th>
								<th>Status</th>
							</tr>
						</thead>
						<tbody>
							<ExamRow
								v-for="exam in exames"
								:key="exam.id"
								:exam="exam"
							/>
						</tbody>
					</table>
				</div>
			</div>
		</DefaultContentWrapper>

		<BaseDialog
			v-if="userType === 'professional' && currentPatient"
			:title="'Solicitar exame de ' + currentPatient.name"
			ref="formRegister"
		>
			<FormExamRequest
				:patient="currentPatient"
				@handled-submit="handleSubmit"
			/>
		</BaseDialog>
	</PageWrapper>
</template>

<style scoped>
@reference "@/assets/main.css";

td,
th {
	@apply p-3 text-center;
}
</style>
