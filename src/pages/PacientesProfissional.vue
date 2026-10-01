<script setup lang="ts">
import { ref, watch } from "vue"
import NavBar from "@/components/NavBar.vue"
import BaseButton from "@/components/bases/BaseButton.vue"
import BaseInput from "@/components/bases/BaseInput.vue"
import FilterOrd from "@/components/FilterOrd.vue"
import PatientCard from "@/components/cards/PatientCard.vue"
import { useAuthStore } from "@/stores/authStore"
//import { getAllPatients } from "@/services/symptomService" // tem que criar isso aqui
import PatientExtended from "@/components/PatientExtended.vue"
import { useRoute } from "vue-router"
import router from "@/router"

const route = useRoute()
const authStore = useAuthStore()

const patients = ref<unknown[]>([])
const currentPatientId = ref<string>("")

const rootPath = "/" + route.path.split("/")[1]

let userId = ""

const updatePatients = async () => {
	patients.value = []
	//patients.value = await getAllPatients(userId)
}

const viewPatient = (symptomId: string) => {
	currentPatientId.value = symptomId ?? ""
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
					{{ patients.length }} Pacientes
				</p>
				<br />

				<!-- Content -->
				<section
					class="max-h-full overflow-hidden flex gap-8 scrollbar-track-transparent scrollbar-thumb-accent"
				>
					<ul class="w-full lg:w-max max-h-full overflow-hidden flex flex-col gap-2 overflow-y-auto">
						<PatientCard
								:patient="0"
								theme="light"
								class="w-full cursor-pointer"
							/>
					</ul>
					<!-- List -->
					<ul
						v-if="patients.length"
						class="w-full lg:w-max max-h-full overflow-hidden flex flex-col gap-2 overflow-y-auto"
						:class="[!currentPatientId ? '' : 'hidden lg:flex']"
					>
						<template v-for="patient in patients" :key="patient.id">
							<PatientCard
								:patient="patient"
								theme="light"
								class="w-full cursor-pointer"
								@click="viewPatient(patient.id)"
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
							v-model="currentPatientId"
							ref="areaDescription"
							class="w-full"
						/>
					</section>
				</section>
			</div>
		</main>
	</div>
</template>
