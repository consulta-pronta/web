<script setup lang="ts">
import { ref, watch } from "vue"
import NavBar from "@/components/NavBar.vue"
import BaseInput from "@/components/bases/BaseInput.vue"
import PatientCard from "@/components/cards/PatientCard.vue"
import { useAuthStore } from "@/stores/authStore"
//import { getAllPatients } from "@/services/symptomService" // tem que criar isso aqui
import PatientExtended from "@/components/PatientExtended.vue"
import { useRoute } from "vue-router"
import router from "@/router"

interface Paciente {
    id: string
    nome: string
    cpf: string
    priority: number
    proximaConsulta: string | null
}

const route = useRoute()
const authStore = useAuthStore()

const patients = ref<Paciente[]>([])
const currentPatientId = ref<string>("")

const rootPath = "/" + route.path.split("/")[1]

let userId = ""

const updatePatients = async () => {
	patients.value = []
	//patients.value = await getAllPatients(userId)
}

const viewPatient = (patientId: string) => {
	currentPatientId.value = patientId ?? ""
}

watch(currentPatientId, (value) => {
	if (value) {
		router.replace(`${rootPath}/${value}`)
	} else {
		router.replace(rootPath)
	}
})

authStore.onReady(async (data) => {
	userId = data.id
	currentPatientId.value = route.params.id as string

	updatePatients()
})

const pacientes: Paciente[] = [
    { id: '1', nome: 'Cláudio Silva', cpf: '321.654.987-01', priority: 9, proximaConsulta: '07/10/2026 às 09:00' },
    { id: '2', nome: 'Joana Neto', cpf: '458.712.630-55', priority: 3, proximaConsulta: '12/10/2026 às 14:30' },
    { id: '3', nome: 'Marcos Oliveira', cpf: '902.317.884-20', priority: 6, proximaConsulta: null },
    { id: '4', nome: 'Fernanda Souza', cpf: '187.449.253-76', priority: 8, proximaConsulta: '06/10/2026 às 16:00' },
    { id: '5', nome: 'Rafael Almeida', cpf: '574.093.118-39', priority: 1, proximaConsulta: '20/10/2026 às 10:15' },
    { id: '6', nome: 'Patrícia Lima', cpf: '263.581.907-64', priority: 5, proximaConsulta: null },
    { id: '7', nome: 'Ana Costa', cpf: '719.826.340-18', priority: 10, proximaConsulta: '05/10/2026 às 08:30' },
    { id: '8', nome: 'Pedro Lima', cpf: '630.254.791-82', priority: 4, proximaConsulta: '15/10/2026 às 11:00' },
    { id: '9', nome: 'Maria Oliveira', cpf: '845.173.026-47', priority: 7, proximaConsulta: '09/10/2026 às 13:45' },
    { id: '10', nome: 'Carlos Souza', cpf: '396.708.512-93', priority: 2, proximaConsulta: null },
]
</script>

<template>
	<!-- Screen -->
	<div class="flex h-screen">
		<NavBar />

		<main
			class="bg-background w-full h-full flex justify-center items-center gap-4 lg:gap-6 xl:gap-8 p-5 lg:p-7 xl:p-10 overflow-hidden"
		>
			<!-- Fernando Wrapper -->
			<div class="size-full bg-primary rounded-3xl py-8 px-5 flex flex-col min-h-0">
				<header>
					<section
						class="flex flex-col md:flex-row justify-center place-items-center relative gap-6 mb-3"
					>
						<!--Barra de pesquisa-->
						<BaseInput
							placeholder="Pesquisar"
							icon="search"
							theme="light"
							class="w-full md:w-2xl"
						></BaseInput>
					</section>
				</header>

				<br />
				<p
					class="text-textLight text-2xl"
					:class="[!currentPatientId ? '' : 'hidden lg:flex']"
				>
					{{ pacientes.length }} Pacientes
				</p>
				<br />

				<!-- Content -->
				<section
					class="max-h-full overflow-hidden flex gap-8 scrollbar-track-transparent scrollbar-thumb-accent"
				>
					<!-- List -->
					<ul
						v-if="pacientes.length"
						class="w-full lg:w-max max-h-full overflow-hidden flex flex-col gap-2 overflow-y-auto"
						:class="[!currentPatientId ? '' : 'hidden lg:flex']"
					>
						<template v-for="paciente in pacientes" :key="paciente.id">
							<PatientCard
								:patient="paciente"
								theme="light"
								class="w-full cursor-pointer"
								@click="viewPatient(paciente.id)"
							/>
						</template>
					</ul>
					<template v-else>
						<span
							class="material-symbols-rounded animate-spin text-accent w-fit m-auto"
						>
							sync
						</span>
					</template>

					<!-- Details -->
					<section
						class="grow h-full flex flex-col items-start"
						v-show="currentPatientId"
					>
						<header class="w-full flex flex-row justify-between">
							<button
								type="button"
								class="cursor-pointer text-textLight"
								@click="viewPatient('')"
							>
								<span class="material-symbols-rounded text-3xl!"> arrow_back </span>
							</button>
						</header>

						<br />

						<PatientExtended
							ref="areaDescription"
							class="w-full"
						/>
					</section>
				</section>
			</div>
		</main>
	</div>
</template>
