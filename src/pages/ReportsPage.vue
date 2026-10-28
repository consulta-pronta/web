<script setup lang="ts">
import BaseButton from "@/components/bases/BaseButton.vue"
import BaseInput from "@/components/bases/BaseInput.vue"
import NavBar from "@/components/NavBar.vue"
import ReportRow from "@/components/ReportRow.vue"
import BaseDialog from "@/components/bases/BaseDialog.vue"
import { computed, ref, useTemplateRef } from "vue"
import FormReport from "@/components/forms/FormReport.vue"
import { useAuthStore } from "@/stores/authStore"
import Report from "@/database/report.model"
import Patient from "@/database/patient.model"
import Professional from "@/database/professional.model"
import PatientCard from "@/components/cards/PatientCard.vue"

const currentUser = ref<Patient | Professional | null>(null)
const patients = ref<Patient[]>([])
const reports = ref<Report[]>()
const currentPatient = ref<Patient | null>(null)
const loadError = ref("")

const formRegister = useTemplateRef("formRegister")

const authStore = useAuthStore()

const userType = computed(() => currentUser.value?.user_type)

const handleSubmit = async () => {
	formRegister.value?.hide()
	await authStore.onReady(async (user) => {
		reports.value = await Report.getAll({ scope: { userId: user.id } })
	})
}

const selectPatient = async (patient: Patient) => {
	currentPatient.value = patient

	reports.value = await Report.getAll({
		scope: { userId: patient.id },
	})
}

authStore.onReady(async (user) => {
	if (!(user instanceof Patient || user instanceof Professional)) {
		return
	}
	currentUser.value = user
	
	if (user instanceof Patient) {
		reports.value = await Report.getAll({ scope: { userId: user.id } })
	} else if (user instanceof Professional) {
		try {
			patients.value = await user.getPatients()
		} catch (error) {
			console.error("Failed to load professional's patients.", error)
			loadError.value = "Não foi possível carregar os pacientes."
		}
	}
})
</script>

<template>
	<div class="flex h-screen">
		<NavBar />

		<main class="w-full h-full overflow-clip px-6 py-8">
			<header class="mb-16 flex flex-col gap-8">
				<h1 class="text-4xl text-textLight font-bold text-center lg:text-start">
					{{
						userType === "patient"
						? "Meus Relatórios"
						: userType === "professional"
						? "Relatórios dos Pacientes"
						: "Relatórios"
					}}
				</h1>

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
						placeholder="Pesquisar"
						icon="search"
						class="place-self-center w-full md:w-120"
					/>
				</div>
			</header>

			<section class="w-full flex gap-8 flex-1">
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
							v-for="patient in patients"
							:key="patient.cpf"
						>
							<PatientCard
								:class="currentPatient === patient ? 'bg-accent!' : ''"
								:patient="patient"
								@selected="selectPatient(patient)"
							/>
						</li>
					</ul>
				</div>

				<div class="w-full max-h-[55vh] overflow-y-auto rounded-xl scrollbar-hide">
					<table class="w-full text-textDark bg-surface">
						<thead class="font-bold sticky top-0 z-1">
							<tr class="bg-surface shadow-[inset_0_-2px_0_var(--color-primaryDark)]">
								<th>Relatório</th>
								<th>ID</th>
								<th>Data</th>
								<th>Horário</th>
							</tr>
						</thead>
						<tbody>
							<ReportRow
								v-for="report in reports"
								:key="report.id"
								:report="report"
							/>
						</tbody>
					</table>
				</div>
			</section>
		</main>

		<BaseDialog title="Gerar Relatório" ref="formRegister">
			<FormReport @handled-submit="handleSubmit" />
		</BaseDialog>
	</div>
</template>

<style scoped>
@reference "@/assets/main.css";

td,
th {
	@apply p-3 text-center;
}
</style>
