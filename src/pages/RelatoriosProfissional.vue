```vue
<script setup lang="ts">
import { ref } from "vue"
import NavBar from "@/components/NavBar.vue"
import BaseInput from "@/components/bases/BaseInput.vue"
import { useAuthStore } from "@/stores/authStore"
import UserPhoto from "@/components/UserPhoto.vue"
import PatientList from "@/components/cards/PatientList.vue"
import ReportList from "@/components/cards/ReportList.vue"
import Professional from "@/database/professional.model"
import type Patient from "@/database/patient.model"
import Report from "@/database/report.model"

const authStore = useAuthStore()

const currentUser = ref(false)
const loadError = ref("")

const patients = ref<Patient[]>([])
const reportsByPatient = ref<Record<string, Report[]>>({})

const currentPatient = ref<Patient | null>(null)
const currentReport = ref<Report | null>(null)

function viewPatient(patient: Patient) {
	currentPatient.value = patient
	currentUser.value = true
	currentReport.value = null
}

function closePatient() {
	currentUser.value = false
	currentPatient.value = null
	currentReport.value = null
}

function viewReport(report: Report) {
	currentReport.value = report
}

function closeReport() {
	currentReport.value = null
}

authStore.onReady(async (user) => {
	if (!(user instanceof Professional)) {
		loadError.value = "Não foi possível carregar os dados do profissional."
		return
	}

	try {
		const professionalPatients = await user.getPatients()
		const patientReports = await Promise.all(
			professionalPatients.map(async (patient) => {
				const reports = await Report.getAll({
					scope: { userId: patient.id },
				})

				return [patient.id, reports] as const
			}),
		)
		patients.value = professionalPatients
		reportsByPatient.value = Object.fromEntries(patientReports)
	} catch (error) {
		console.error("Failed to load professional's patients and reports.", error)
		loadError.value = "Não foi possível carregar os pacientes e relatórios."
	}
})
</script>

<template>
	<main class="flex h-screen overflow-hidden">
		<NavBar />

		<article class="flex-1 min-w-0 h-screen overflow-hidden">
			<div class="bg-background w-full h-full flex flex-col min-h-0 px-6 py-8">
				<p class="text-3xl md:text-4xl text-textLight font-bold h-20.25 text-center lg:text-left">
					Relatórios
				</p>

				<div class="grid items-center justify-center">
					<BaseInput
						placeholder="Buscar por nome, ID ou CPF"
						icon="search"
						theme="dark"
						class="w-full md:w-2xl"
					></BaseInput>
				</div>

				<section class="w-full flex-1 min-h-0 overflow-hidden flex gap-8 px-6 py-20">

					<ul
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

						<PatientList
							v-else
							:patients="patients"
							@selected="viewPatient"
						/>
					</ul>

					<section
						v-show="currentUser"
						class="flex-1 min-w-0 min-h-0 w-full bg-textLight rounded-[20px] flex flex-col"
					>
						<article class="flex w-full justify-center relative shrink-0">
							<button
								type="button"
								class="cursor-pointer text-primaryDark absolute left-3"
								@click="closePatient"
							>
								<span class="material-symbols-rounded text-4xl! pl-3 pt-2">
									arrow_back
								</span>
							</button>

							<section class="flex text-primaryDark items-center my-2">
								<UserPhoto />

								<span class="flex flex-col w-full text-start pl-6">
									<p class="font-bold text-2xl oneliner">
										{{ currentPatient?.name }}
									</p>

									<p class="oneliner text-base">
										CPF: {{ currentPatient?.cpf }}
									</p>
								</span>
							</section>
						</article>

						<hr class="mx-4 shrink-0" />

						<article class="flex-1 min-h-0 min-w-0 overflow-hidden text-textDark p-3 w-full">
							<section
								v-if="!currentReport"
								class="w-full h-full overflow-y-auto scrollbar-hide"
							>
								<ReportList
								:reports="currentPatient ? reportsByPatient[currentPatient.id] ?? [] : []"
									@select="viewReport"
								/>
							</section>
						</article>
					</section>
				</section>
			</div>
		</article>

		<!-- Visualização completa do relatório -->
		<section
			v-if="currentReport"
			class="dialog"
		>
			<form class="bg-background w-[95%] md:w-[70%] lg:w-[55%] h-[95%] rounded-[25px] px-10 py-6">

				<article class="overflow-y-auto flex flex-col border border-textLight w-full h-full relative rounded-2xl scrollbar-hide">

					<!-- Seta de retorno -->
					<button
						type="button"
						@click="closeReport"
						class="flex justify-start sticky top-0 left-0 z-50 self-start cursor-pointer bg-background w-full"
					>
						<span class="material-symbols-rounded text-[30px]! w-fit text-textLight m-3 cursor-pointer">
							arrow_back
						</span>
					</button>

					<!-- Título -->
					<p class="text-textLight text-2xl font-bold mx-4">
						{{ currentReport.title }}
					</p>

					<p class="text-textLight text-base font-light italic mx-4">
						Relatório: {{ currentReport.id }}
					</p>

					<!-- Período -->
					<span class="flex flex-wrap mx-4">
						<p class="text-textLight text-base font-bold mr-2">
							Período:
						</p>

						<p class="text-textLight text-base font-normal">
							{{ currentReport.period_start?.toDate().toLocaleDateString("pt-BR") ?? "—" }} a
							{{ currentReport.period_end?.toDate().toLocaleDateString("pt-BR") ?? "—" }}
						</p>
					</span>

					<!-- Paciente -->
					<section class="flex mx-3 mt-3">

						<UserPhoto />

						<article class="flex flex-col justify-center mx-4">

							<p class="text-textLight text-base font-bold">
								{{ currentPatient?.name }}
							</p>

							<p class="text-textLight text-xs">
								CPF: {{ currentPatient?.cpf }}
							</p>

						</article>

					</section>

					<!-- Resumo Geral -->
					<p class="text-textLight text-xl font-bold mx-4 mt-4">
						Resumo Geral
					</p>

					<section class="grid grid-cols-2 gap-2 mx-4 mt-1 w-[95%]">

						<div class="bg-surface rounded-xl flex flex-col p-2.5">

							<p class="text-sm font-medium">
								Sintoma mais comum:
							</p>

							<p class="text-xl font-bold">
								{{ currentReport.title }}
							</p>

							<p class="text-sm font-medium">
								Período do relatório
							</p>

							<div class="flex bg-error rounded-3xl text-surface mt-1 w-fit items-center px-2">

								<span class="material-symbols-rounded text-xs! mx-1">
									warning
								</span>

								<p class="text-xs p-1">
									Prioridade Alta
								</p>

							</div>

						</div>

						<div class="flex flex-col bg-surface text-background rounded-xl p-2.5">

							<span class="flex">
								<p class="text-base font-bold mr-2">
									Início:
								</p>

								<p class="text-base font-normal">
									{{ currentReport.period_start?.toDate().toLocaleDateString("pt-BR") ?? "—" }}
								</p>
							</span>

							<span class="flex">
								<p class="text-base font-bold mr-2">
									Fim:
								</p>

								<p class="text-base font-normal">
									{{ currentReport.period_end?.toDate().toLocaleDateString("pt-BR") ?? "—" }}
								</p>
							</span>

						</div>

					</section>

					<!-- Cronologia -->
					<p class="text-textLight text-xl font-bold mx-4 mt-8">
						Cronologia do Sintoma
					</p>

					<section class="flex flex-col p-4">

						<div class="flex">

							<article class="flex flex-col justify-center items-center w-[10%]">

								<div class="flex justify-center items-center">
									<span class="material-symbols-rounded bg-primaryLight text-background rounded-full">
										vital_signs
									</span>
								</div>

								<hr class="flex-1 w-px bg-primaryLight border-0">

							</article>

							<article class="flex flex-col w-[90%] bg-surface text-background rounded-lg p-3">

								<p class="text-lg font-bold">
									{{ currentReport.title }}
								</p>

								<p class="text-sm font-medium">
									({{ currentReport.period_start?.toDate().toLocaleDateString("pt-BR") ?? "—" }})
								</p>

							</article>

						</div>

						<div class="flex">

							<article class="flex flex-col justify-center items-center w-[10%]">

								<div class="flex justify-center items-center">
									<span class="material-symbols-rounded bg-primaryLight text-background rounded-full">
										vital_signs
									</span>
								</div>

								<hr class="flex-1 w-px bg-primaryLight border-0">

							</article>

							<article class="flex flex-col w-[90%] bg-surface text-background rounded-lg p-3">

								<p class="text-lg font-bold">
									Acompanhamento
								</p>

								<p class="text-sm font-medium">
									({{ currentReport.period_end?.toDate().toLocaleDateString("pt-BR") ?? "—" }})
								</p>

								<p class="text-sm font-medium">
									- Finalização do período registrado no relatório.
								</p>

							</article>

						</div>

						<!-- Visão geral -->
						<p class="text-textLight text-xl font-bold mx-4 mt-4">
							Visão Geral
						</p>

						<article class="flex justify-center w-full">

							<table class="w-[95%] border-separate border-spacing-0.5">

								<thead class="text-background font-semibold">
									<tr>
										<th class="bg-surface">
											Sintoma
										</th>

										<th class="bg-surface">
											Duração
										</th>

										<th class="bg-surface">
											Ocorrência
										</th>
									</tr>
								</thead>

								<tbody class="text-background">

									<tr>
										<th class="bg-textLight">
											{{ currentReport.title }}
										</th>

										<th class="bg-textLight">
											Período registrado
										</th>

										<th class="bg-textLight">
											2 Ocorrências
										</th>
									</tr>

								</tbody>

							</table>

						</article>

					</section>

				</article>
			</form>
		</section>

	</main>
</template>

<style scoped>
@reference "@/assets/main.css";

.oneliner {
	@apply whitespace-nowrap overflow-hidden text-ellipsis;
}

.dialog {
	@apply
		fixed inset-0 w-full h-full
		bg-black/80
		flex justify-center place-items-center
		z-50;
}
</style>
