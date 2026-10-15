<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
import UserPhoto from '@/components/UserPhoto.vue'
import BaseButton from '@/components/bases/BaseButton.vue'
import BaseDialog from '@/components/bases/BaseDialog.vue'
import FormProfile from '@/components/forms/FormProfile.vue'

import { computed, ref, useTemplateRef } from "vue"
import { useAuthStore } from "@/stores/authStore"
import Patient from '@/database/patient.model'
import Professional from '@/database/professional.model'
import { formatToCPF, formatToNumber, formatToPhone } from 'brazilian-values'
import { formatCRM } from '@/utils'

const authStore = useAuthStore()
const dialogForm = useTemplateRef("dialogForm")
const formProfile = useTemplateRef("formProfile")

const user = ref<Patient | Professional>(new Patient())
const formType = ref<"personal" | "contacts" | "health" | "professional">()

const formTitle = computed(() => {
	switch (formType.value) {
		case "personal":
			return "Atualizar dados pessoais"
		case "contacts":
			return "Atualizar meios de contato"
		case "health":
			return "Atualizar informações de saúde"
		case "professional":
			return "Atualizar informações profissionais"
		default:
			return ""
	}
})

authStore.onReady(async (data) => {
	user.value = data as Patient | Professional
})

const openForm = (type: "personal" | "contacts" | "health" | "professional") => {
	formType.value = type
	formProfile.value?.reset()
	dialogForm.value?.toggle()
}

const handleSubmit = async () => {
	dialogForm.value?.hide()
	await authStore.reloadUser()
	await authStore.onReady(async (data) => {
		user.value = data as Patient | Professional
	})
}
</script>

<template>
	<div class="flex h-screen overflow-hidden">
		<NavBar />

		<main
			class="bg-background size-full flex flex-col gap-10 lg:gap-12 xl:gap-15 p-5 lg:p-7 xl:p-10"
		>
			<h1 class="text-4xl text-textLight font-bold text-center lg:text-start">
				Meu perfil
			</h1>

			<article class="flex justify-center">
				<div class="flex flex-col w-full 2xl:w-300 gap-10">
					<div class="flex gap-2">
						<UserPhoto />
						<div class="flex flex-col justify-center">
							<p class="text-2xl text-textLight font-bold">{{ user.name }}</p>
							<p class="text-xl text-textLight font-medium opacity-80">{{ user.email }}</p>
						</div>
					</div>

					<hr class="h-1 border-0 bg-textLight w-full m-auto rounded-full opacity-70" />

					<section class="max-h-150 flex flex-col overflow-y-auto gap-5 rounded-2xl">
						<div class="flex flex-col md:flex-row w-full gap-5">
							<div class="bg-primary w-full rounded-2xl md:col-span-1 p-5 flex flex-col h-full gap-4 text-textLight font-bold">
								<div class="flex justify-between">
									<p class="text-xl">Dados pessoais</p>
									<BaseButton type="button" theme="textLight" mode="transparent" icon="edit_square" @click="openForm('personal')" />
								</div>

								<div class="grid grid-cols-2 gap-5">
									<div class="grid col-span-1">
										<p>{{ user.age }} anos</p>
										<p class="font-normal opacity-70">Idade</p>
									</div>
									<div class="grid col-span-1">
										<p>{{ user.birth_date }}</p>
										<p class="font-normal opacity-70">Data de nascimento</p>
									</div>
									<div class="grid col-span-1">
										<p>{{ user.gender }}</p>
										<p class="font-normal opacity-70">Gênero</p>
									</div>
									<div class="grid col-span-1">
										<p>{{ user.biological_sex }}</p>
										<p class="font-normal opacity-70">Sexo biológico</p>
									</div>
									<div class="grid col-span-1">
										<p>{{ formatToCPF(user.cpf) }}</p>
										<p class="font-normal opacity-70">CPF</p>
									</div>
									<div class="grid col-span-1">
										<p>{{ user.address }}</p>
										<p class="font-normal opacity-70">Endereço</p>
									</div>
								</div>
							</div>

							<div class="bg-primary w-full rounded-2xl md:col-span-1 p-5 flex flex-col h-full gap-4 text-textLight font-bold">
								<div class="flex justify-between">
									<p class="text-xl">Meios de contato</p>
									<BaseButton type="button" theme="textLight" mode="transparent" icon="edit_square" @click="openForm('contacts')" />
								</div>
								<div class="flex flex-col gap-5">
									<div>
										<p>{{ formatToPhone(user.phone) }}</p>
										<p class="font-normal opacity-70">Telefone</p>
									</div>
									<div>
										<p>{{ user.email }}</p>
										<p class="font-normal opacity-70">Email</p>
									</div>
								</div>
							</div>
						</div>

						<div v-if="user instanceof Patient" class="bg-primary rounded-2xl md:col-span-2 p-5 flex flex-col justify-between h-full gap-4 text-textLight">
							<div class="flex justify-between">
								<p class="text-xl font-bold">Informações de saúde</p>
								<BaseButton type="button" theme="textLight" mode="transparent" icon="edit_square" @click="openForm('health')" />
							</div>
							<div class="grid grid-cols-3 gap-5">
								<div class="grid col-span-1">
									<p>{{ user.patient_data?.blood_type }}</p>
									<p class="font-normal opacity-70">Tipo sanguíneo</p>
								</div>
								<div class="grid col-span-1">
									<p>{{ formatToNumber((user.patient_data?.height || 0) / 100) }}m</p>
									<p class="font-normal opacity-70">Altura</p>
								</div>
								<div class="grid col-span-1">
									<p>{{ user.patient_data?.weight }}kg</p>
									<p class="font-normal opacity-70">Peso</p>
								</div>
							</div>

							<!-- <hr class="h-0.5 border-0 bg-textLight w-full m-auto rounded-full opacity-70" />

							<div class="grid grid-cols-2 gap-5">
								<div class="grid col-span-1">
									<p>{{ userName }}</p>
									<p>{{ userName }}</p>
									<p>{{ userName }}</p>
									<p class="font-normal opacity-70">Alergias</p>
								</div>
								<div class="grid col-span-1">
									<p>{{ userName }}: {{ userName }}</p>
									<p>{{ userName }}: {{ userName }}</p>
									<p>{{ userName }}: {{ userName }}</p>
									<p class="font-normal opacity-70">Histórico familiar</p>
								</div>
							</div> -->
						</div>

						<div v-if="user instanceof Professional" class="bg-primary rounded-2xl md:col-span-2 p-5 flex flex-col justify-between h-full gap-4 text-textLight">
							<div class="flex justify-between">
								<p class="text-xl">Dados profissionais</p>
								<BaseButton type="button" theme="textLight" mode="transparent" icon="edit_square" @click="openForm('professional')" />
							</div>
							<div class="grid grid-cols-3 gap-5">
								<div class="grid col-span-1">
									<p>{{ `${formatCRM(user.professional_data?.crm || '')}/${user.professional_data?.uf}` }}</p>
									<p class="font-normal opacity-70">CRM</p>
								</div>
								<div class="grid col-span-1">
									<p>{{ user.professional_data?.specialty }}</p>
									<p class="font-normal opacity-70">Especialidade</p>
								</div>
								<div class="grid col-span-1">
									<p>{{ user.professional_data?.operation_area }}</p>
									<p class="font-normal opacity-70">Local</p>
								</div>
							</div>
						</div>
					</section>
				</div>
			</article>

			<!-- Forms -->
			<BaseDialog :title="formTitle" ref="dialogForm">
				<FormProfile :type="formType" ref="formProfile" @handled-submit="handleSubmit"/>
			</BaseDialog>
		</main>
	</div>
</template>
