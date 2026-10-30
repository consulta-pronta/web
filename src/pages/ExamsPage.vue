<script setup lang="ts">
import { computed, ref } from "vue"
import NavBar from "@/components/NavBar.vue"
import BaseInput from "@/components/bases/BaseInput.vue"
import Exam from "@/database/exam.model"
import ExamRow from "@/components/ExamRow.vue"
import { useAuthStore } from "@/stores/authStore"
import Patient from "@/database/patient.model"
import Professional from "@/database/professional.model"
import PatientCard from "@/components/cards/PatientCard.vue"

const authStore = useAuthStore()

const exames = ref<Exam[]>([])
const currentUser = ref<Patient | Professional | null>(null)
const patients = ref<Patient[]>([])
const currentPatient = ref<Patient | null>(null)
const loadError = ref("")

const userType = computed(() => currentUser.value?.user_type)

const selectPatient = async (patient: Patient) => {
	currentPatient.value = patient
	exames.value = await Exam.getAll({ scope: { userId: patient.id } })
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
						? "Meus Exames"
						: userType === "professional"
						? "Exames dos Pacientes"
						: "Exames"
					}}
				</h1>

				<BaseInput
					placeholder="Pesquisar"
					icon="search"
					class="place-self-center w-full md:w-120"
				/>
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
			</section>
		</main>
	</div>
</template>

<style scoped>
@reference "@/assets/main.css";

td,
th {
	@apply p-3 text-center;
}
</style>
