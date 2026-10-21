<script setup lang="ts">
import { ref, watch } from "vue"
import NavBar from "@/components/NavBar.vue"
import BaseInput from "@/components/bases/BaseInput.vue"
import PermissionCard from "@/components/cards/PermissionCard.vue"
import { useAuthStore } from "@/stores/authStore"
import MedicalPermission from "@/database/medicalPermission.model"
import PatientExtended from "@/components/PatientExtended.vue"
import { useRoute } from "vue-router"
import router from "@/router"

const route = useRoute()
const authStore = useAuthStore()

const medicalPermissions = ref<MedicalPermission[]>([])
const loading = ref(true)
const loadMessage = ref("")
const currentPatientId = ref<string>("")

const rootPath = "/" + route.path.split("/")[1]

const updatePatients = async () => {
	loading.value = true
	loadMessage.value = ""

	try {
		await authStore.onReady(async (professional) => {
			medicalPermissions.value = await MedicalPermission.getAllForProfessional(professional.id)
		})
		if (medicalPermissions.value.length === 0) {
			loadMessage.value = "Nenhum paciente com permissão médica encontrado."
		}
	} catch (error) {
		console.error("Failed to load professional's medical permissions.", error)
		loadMessage.value = "Não foi possível carregar os pacientes."
	} finally {
		loading.value = false
	}
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

authStore.onReady(async () => {
	currentPatientId.value = route.params.id as string

	await updatePatients()
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
					{{ medicalPermissions.length }} Pacientes
				</p>
				<br />

				<!-- Content -->
				<section
					class="max-h-full overflow-hidden flex gap-8 scrollbar-track-transparent scrollbar-thumb-accent"
				>
					<!-- List -->
					<ul
						v-if="medicalPermissions.length"
						class="w-full md:flex-1 max-h-full overflow-hidden grid grid-cols-[repeat(auto-fill,minmax(25em,1fr))] gap-4 overflow-y-auto"
						:class="[!currentPatientId ? '' : 'hidden md:flex md:flex-col md:min-w-80']"
					>
						<template
							v-for="permission in medicalPermissions"
							:key="permission.patient_id"
						>
							<PermissionCard
								:medical-permission="permission"
								class="w-full"
							/>
						</template>
					</ul>
					<p v-else-if="loading" class="text-textLight m-auto">
						<span
							class="material-symbols-rounded animate-spin text-accent w-fit m-auto"
						>
							sync
						</span>
					</p>
					<p v-else-if="loadMessage" class="text-textLight m-auto">
						{{ loadMessage }}
					</p>

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
