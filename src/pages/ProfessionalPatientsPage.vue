<script setup lang="ts">
import { ref, watch } from "vue"
import BaseInput from "@/components/bases/BaseInput.vue"
import PermissionCard from "@/components/cards/PermissionCard.vue"
import { useAuthStore } from "@/stores/authStore"
import MedicalPermission from "@/database/medicalPermission.model"
import PatientExtended from "@/components/PatientExtended.vue"
import { useRoute } from "vue-router"
import router from "@/router"
import Professional from "@/database/professional.model"
import PageWrapper from "@/components/wrappers/PageWrapper.vue"
import DefaultContentWrapper from "@/components/wrappers/DefaultContentWrapper.vue"
import BaseCardList from "@/components/bases/BaseCardList.vue"
import HeaderWrapper from "@/components/wrappers/HeaderWrapper.vue"

const route = useRoute()
const authStore = useAuthStore()

const medicalPermissions = ref<MedicalPermission[]>([])
const loadingPatients = ref(true)
const loadingCurrentPatient = ref(false)
const loadMessage = ref("")
const currentPatientId = ref<string>("")
const searchQuery = ref("")

const rootPath = "/" + route.path.split("/")[1]

const updatePatients = async () => {
	loadingPatients.value = true
	loadMessage.value = ""

	try {
		await authStore.onReady(async (professional) => {
			if (!(professional instanceof Professional)) {
				return
			}
			medicalPermissions.value = await professional.getMedicalPermissions()
		})
		if (medicalPermissions.value.length === 0) {
			loadMessage.value = "Nenhum paciente com permissão médica encontrado."
		}
	} catch (error) {
		console.error("Failed to load professional's medical permissions.", error)
		loadMessage.value = "Não foi possível carregar os pacientes."
	} finally {
		loadingPatients.value = false
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
	<PageWrapper>
		<HeaderWrapper title="Seus Pacientes">
			<section
				class="flex flex-col md:flex-row justify-center place-items-center relative gap-6 mb-3"
			>
				<BaseInput
					v-model="searchQuery"
					placeholder="Pesquisar"
					icon="search"
					theme="light"
					class="w-full md:w-2xl"
				></BaseInput>
			</section>
		</HeaderWrapper>

		<DefaultContentWrapper
			class="max-h-full overflow-hidden scrollbar-track-transparent scrollbar-thumb-accent"
		>
		
			<div
				class="w-full flex flex-col gap-4"
				:class="[!currentPatientId ? '' : 'hidden lg:flex lg:w-120']"
			>
				<p class="text-textLight text-2xl mb-4">
					{{ medicalPermissions.length }} Pacientes
				</p>

				<!-- TODO patient selected stop w-full -->
				<BaseCardList
					v-if="medicalPermissions.length || loadingPatients"
					:is-loading="loadingPatients"
					min-width="25em"
					class="w-full max-h-full overflow-y-auto"
				>
					<PermissionCard
						v-for="permission in medicalPermissions" 
						:key="permission.patient_id"
						:medical-permission="permission"
						:search-query="searchQuery"
						@click="viewPatient(permission.patient_id)"
					/>
				</BaseCardList>
			</div>

			<p
				v-if="!loadingPatients && !medicalPermissions.length && loadMessage" 
				class="text-textLight m-auto"
			>
				{{ loadMessage }}
			</p>

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
					v-model="currentPatientId"
					ref="areaDescription"
					class="w-full"
				/>
			</section>
		</DefaultContentWrapper>
	</PageWrapper>
</template>
