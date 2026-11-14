<script setup lang="ts">
import BaseButton from "@/components/bases/BaseButton.vue"
import BaseInput from "@/components/bases/BaseInput.vue"
import ReportRow from "@/components/ReportRow.vue"
import BaseDialog from "@/components/bases/BaseDialog.vue"
import { computed, ref, useTemplateRef, watch } from "vue"
import FormReport from "@/components/forms/FormReport.vue"
import { useAuthStore } from "@/stores/authStore"
import Report from "@/database/report.model"
import Patient from "@/database/patient.model"
import Professional from "@/database/professional.model"
import PatientCard from "@/components/cards/PatientCard.vue"
import PageWrapper from "@/components/wrappers/PageWrapper.vue"
import HeaderWrapper from "@/components/wrappers/HeaderWrapper.vue"
import DefaultContentWrapper from "@/components/wrappers/DefaultContentWrapper.vue"
import router from "@/router"
import { useRoute } from "vue-router"
import { normalizeString, searchDocuments } from "@/utils"
import BaseTable from "@/components/bases/BaseTable.vue"
import BaseCardList from "@/components/bases/BaseCardList.vue"
import BaseSideSheet from "@/components/bases/BaseSideSheet.vue"
import ReportExtended from "@/components/ReportExtended.vue"

const route = useRoute()
const authStore = useAuthStore()

const currentUser = ref<Patient | Professional | null>(null)
const patients = ref<Patient[]>([])
const reports = ref<Report[]>([])
const currentPatient = ref<Patient | null>(null)
const selectedReport = ref<Report | null>(null)
const loadError = ref("")
const loadingPatients = ref(true)
const loadingReports = ref(false)
const searchQuery = ref("")

const formRegister = useTemplateRef("formRegister")

const userType = computed(() => currentUser.value?.user_type)
const filteredPatients = computed(() => {
	const query = normalizeString(searchQuery.value)
	return patients.value.filter((patient) =>
		normalizeString(
			`${patient.name} ${patient.cpf} ${patient.email} ${patient.phone}`,
		).includes(query),
	)
})
const filteredReports = computed(
	() => searchDocuments(reports.value, searchQuery.value) as Report[],
)
const pageTitle = computed(() =>
	userType.value === "patient"
		? "Meus Relatórios"
		: userType.value === "professional"
			? "Relatórios dos Pacientes"
			: "Relatórios",
)

const handleSubmit = async () => {
	formRegister.value?.hide()
	loadingReports.value = true
	loadError.value = ""
	try {
		await authStore.onReady(async (user) => {
			reports.value = await Report.getAll({ scope: { userId: user.id } })
		})
	} catch (error) {
		console.error("Failed to load reports.", error)
		loadError.value = "Não foi possível carregar os relatórios."
	} finally {
		loadingReports.value = false
	}
}

const selectPatient = async (patient: Patient) => {
	if (currentPatient.value === patient) return
	currentPatient.value = patient
	loadingReports.value = true
	loadError.value = ""
	try {
		reports.value = await Report.getAll({
			scope: { userId: patient.id },
		})
	} catch (error) {
		console.error("Failed to load patient's reports.", error)
		loadError.value = "Não foi possível carregar os relatórios."
	} finally {
		loadingReports.value = false
	}
}

const unselectPatient = () => {
	currentPatient.value = null
	loadingPatients.value = false
	loadingReports.value = false
	loadError.value = ""
	reports.value = []
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
			reports.value = await Report.getAll({ scope: { userId: user.id } })
		} else {
			patients.value = await user.getPatients()
			if (route.params.id) {
				const patient = patients.value.find((item) => item.id === route.params.id)
				if (patient) {
					await selectPatient(patient)
				} else {
					loadError.value = "Paciente não encontrado."
				}
			}
		}
	} catch (error) {
		console.error("Failed to load reports page data.", error)
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
					icon="add_notes"
					@click="formRegister?.toggle()"
					class="col-span-3 rounded-2xl"
				>
					<p class="hidden lg:block">Adicionar Relatórios</p>
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

				<BaseCardList
					:is-loading="loadingPatients"
					class="w-full flex flex-col gap-2"
				>
					<PatientCard
						v-for="patient in filteredPatients" 
						:key="patient.cpf"
						:class="currentPatient === patient ? 'bg-accent!' : ''"
						:patient="patient"
						@selected="selectPatient(patient)"
					/>
				</BaseCardList>
			</div>

			<div class="size-full">
				<div
					v-if="userType === 'professional'" 
					class="text-textLight"
				>
					<button
						type="button"
						class="cursor-pointer flex justify-center items-center size-11"
						:class="!currentPatient ? 'invisible' : ''"
						@click.prevent="unselectPatient"
					>
						<span class="material-symbols-rounded rounded-full p-1 hover:bg-primaryLight/10">
							arrow_back
						</span>
					</button>
				</div>
				<BaseTable
					:is-loading="loadingReports"
					:show-message="filteredReports.length === 0"
					:message="loadError || `Nenhum relatório ${reports.length ? 'encontrado' : 'disponível'}`"
				>
					<template #header>
						<th class="w-100">Relatório</th>
						<th class="w-20">Duração</th>
						<th class="w-30">Criado em</th>
						<th class="w-12"></th>
					</template>
	
					<template #default>
						<ReportRow
							v-for="report in filteredReports"
							:key="report.id"
							:report="report"
							@selected="selectedReport = $event"
						/>
					</template>
				</BaseTable>
			</div>
		</DefaultContentWrapper>

		<BaseDialog title="Gerar Relatório" ref="formRegister">
			<FormReport @handled-submit="handleSubmit" />
		</BaseDialog>

		<BaseSideSheet
			:title="selectedReport?.title"
			:visible="selectedReport !== null"
			class="w-200"
		>
			<template #header-options>
				<button
					type="button"
					class="cursor-pointer h-fit text-primaryLight"
					@click="selectedReport = null"
				>
					<span class="material-symbols-rounded"> close </span>
				</button>
			</template>

			<template #default>
				<ReportExtended
					v-if="selectedReport"
					:key="selectedReport.id"
					:report="selectedReport"
				/>
			</template>
		</BaseSideSheet>
	</PageWrapper>
</template>

<style scoped>
@reference "@/assets/main.css";

td,
th {
	@apply px-4 py-3;
}

th {
	@apply font-semibold uppercase tracking-wide;
}
</style>
