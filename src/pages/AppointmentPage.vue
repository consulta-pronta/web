<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from "vue"
import BaseInput from "@/components/bases/BaseInput.vue"
import Appointment from "@/database/appointment.model"
import AppointmentRow from "@/components/AppointmentRow.vue"
import { useAuthStore } from "@/stores/authStore"
import Patient from "@/database/patient.model"
import Professional, { type PatientWithProfessionalPermission } from "@/database/professional.model"
import PatientCard from "@/components/cards/PatientCard.vue"
import BaseDialog from "@/components/bases/BaseDialog.vue"
import BaseButton from "@/components/bases/BaseButton.vue"
import FormAppointmentRequest from "@/components/forms/FormAppointmentRequest.vue"
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

const consultas = ref<Appointment[]>([])
const currentUser = ref<Patient | Professional | null>(null)
const currentPermission = ref<MedicalPermission | null>(null)
const forProfessionalData = ref<PatientWithProfessionalPermission[]>([])
const currentPatient = ref<Patient | null>(null)
const loadError = ref("")
const loadingPatients = ref(true)
const loadingAppointments = ref(true)
const searchQuery = ref("")
const formRegister = useTemplateRef("formRegister")

const userType = computed(() => currentUser.value?.user_type)
const appointmentPatient = computed(() =>
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
const filteredAppointments = computed(() => searchDocuments(consultas.value, searchQuery.value) as Appointment[])
const pageTitle = computed(() =>
	userType.value === "patient"
		? "Minhas Consultas"
		: userType.value === "professional"
			? "Consultas dos Pacientes"
			: "Consultas",
)
const canRequestAppointment = computed(
	() => currentPermission.value !== null && currentPermission.value.permissions.request_appointments,
)

const handleSubmit = async () => {
	formRegister.value?.hide()
	if (appointmentPatient.value) {
		await loadPatientAppointments(appointmentPatient.value)
	}
}

const loadPatientAppointments = async (patient: Patient) => {
	loadingAppointments.value = true
	loadError.value = ""
	try {
		consultas.value = await Appointment.getAll({ scope: { userId: patient.id } })
	} catch (error) {
		console.error("Failed to load patient's appointments.", error)
		loadError.value = "Não foi possível carregar as consultas."
	} finally {
		loadingAppointments.value = false
	}
}

const selectPatient = async (item: PatientWithProfessionalPermission) => {
	if (currentPatient.value === item.patient) return
	currentPatient.value = item.patient
	currentPermission.value = item.permissions
	await loadPatientAppointments(item.patient)
}

const unselectPatient = () => {
	currentPatient.value = null
	loadingPatients.value = false
	loadingAppointments.value = false
	loadError.value = ""
	consultas.value = []
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
			consultas.value = await Appointment.getAll({ scope: { userId: user.id } })
		} else {
			forProfessionalData.value = await user.getPatientsWithPermissions()
		}
	} catch (error) {
		console.error("Failed to load appointments page data.", error)
		loadError.value = "Não foi possível carregar os dados."
	} finally {
		loadingPatients.value = false
		loadingAppointments.value = false
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
					<p class="hidden lg:block">Adicionar consulta</p>
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
						:state="canRequestAppointment ? 'enabled' : 'disabled'"
						@click="formRegister?.show()"
						class="self-end"
					>
						Solicitar consulta
					</BaseButton>
				</div>

				<BaseTable
					:is-loading="loadingAppointments"
					:show-message="filteredAppointments.length === 0"
					:message="loadError || 'Nenhuma consulta encontrado'"
				>
					<template #header>
						<th class="w-70">Consulta</th>
						<th class="w-70">Hospital</th>
						<th class="w-30">Data</th>
						<th class="w-40">Status</th>
						<th class="w-12	"></th>
					</template>

					<template #default>
						<AppointmentRow v-for="appointment in filteredAppointments" :key="appointment.id" :appointment="appointment" />
					</template>
				</BaseTable>
			</div>
		</DefaultContentWrapper>

		<BaseDialog
			v-if="appointmentPatient"
			:title="
				userType === 'patient'
					? 'Adicionar consulta'
					: 'Solicitar consulta de ' + appointmentPatient.name
			"
			ref="formRegister"
		>
			<FormAppointmentRequest
				:patient="appointmentPatient"
				:is-patient="userType === 'patient'"
				@handled-submit="handleSubmit"
			/>
		</BaseDialog>
	</PageWrapper>
</template>

<style scoped>
	@reference "@/assets/main.css";

	.dialog {
		@apply absolute inset-0 w-full h-full
				bg-black/80
				flex justify-center place-items-center
				z-50;
	}

	td,
	th {
		@apply p-3 text-center;
	}
</style>
