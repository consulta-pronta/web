<script setup lang="ts">
import { ref } from "vue"
import { useAuthStore } from "@/stores/authStore"
import NavBar from "@/components/NavBar.vue"
import BaseButton from "@/components/bases/BaseButton.vue"
import SymptomCard from "@/components/cards/SymptomCard.vue"
import type { UserType } from "@/utils"
import Symptom from "@/models/symptom.model"
import Professional from "@/models/professional.model"
import User from "@/models/user.model"
import { formatToCPF } from "brazilian-values"
import { runTransaction, serverTimestamp } from "firebase/firestore"
import { db } from "@/config/firebase"

const authStore = useAuthStore()
const userName = ref("")
const userType = ref<UserType>()

const symptoms = ref<Symptom[]>([])
const signupRequests = ref<Professional[]>()

const approveRequest = async (requestId: string) => {
	const ogRequest = signupRequests.value?.find(
		(req) => req.id === requestId
	)
	if (!ogRequest) {
		alert("Solicitação não encontrada")
		return
	}

	const requestRef = Professional.requestRef(requestId)
	const newUserData = ogRequest.toMap()
	newUserData.created_at = ogRequest.created_at ?? serverTimestamp()
	newUserData.approved_at = serverTimestamp()

	try {
		await runTransaction(db, async (transaction) => {
			transaction.delete(requestRef)
			transaction.set(User.ref(ogRequest.id), newUserData)
		})
		const msg = `Successfuly approved professional of id ${requestId}`
		console.log(msg)
		alert(msg)
	} catch (error) {
		alert("Ocorreu um erro ao aprovar a solicitação.")
		console.error(error)
	}
}

authStore.onReady(async (data) => {
	userName.value = data.name
	userType.value = data.user_type

	symptoms.value = await Symptom.getAll({ scope: { userId: data.id } })
	if (data.user_type === "admin") {
		signupRequests.value = await Professional.getRequests()
	}
})
</script>

<template>
	<div class="flex h-screen overflow-hidden">
		<NavBar />

		<main
			v-if="userType !== 'admin'"
			class="size-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-16 xl:grid-rows-5 gap-4 lg:gap-6 xl:gap-8 p-5 lg:p-7 xl:p-10 overflow-y-auto"
		>
			<section
				class="bg-primary rounded-2xl md:col-span-2 xl:col-span-10 xl:row-span-2 px-5 py-8 flex flex-col justify-between h-full gap-4"
			>
				<!-- Colocar data atual aqui -->
				<div class="text-textLight font-bold flex flex-col space-y-1">
					<p class="text-2xl md:text-3xl lg:text-4xl">Bem vindo,</p>
					<p class="text-accent text-3xl md:text-4xl lg:text-5xl">{{ userName }}</p>
					<p v-if="userType === 'patient'" class="font-normal">
						Você está sentindo algum desconforto hoje? Registre!
					</p>
					<p v-else class="font-normal">Alguma consulta marcada? Verifique!</p>
				</div>
				<BaseButton
					v-if="userType === 'patient'"
					goto="historico-sintomas"
					theme="textLight"
					mode="outline"
					icon="edit_square"
					class="w-full rounded-4xl! justify-center!"
				>
					Registrar sintoma
				</BaseButton>
				<BaseButton
					v-else
					theme="textLight"
					mode="outline"
					icon="vital_signs"
					class="w-full rounded-4xl!"
				>
					Verificar consultas
				</BaseButton>
			</section>

			<section
				v-if="userType === 'patient'"
				class="bg-primary rounded-2xl md:col-span-2 xl:col-span-6 xl:row-span-5 p-5 flex flex-col justify-between h-full"
			>
				<div class="flex flex-col h-full space-y-2">
					<div class="flex justify-between">
						<p class="text-textLight font-bold text-xl">Sintomas recentes</p>
						<RouterLink to="" class="text-accent flex">
							<p>Ver todos</p>
							<span class="material-symbols-rounded text-xl!">arrow_forward</span>
						</RouterLink>
					</div>

					<template v-if="symptoms.length">
						<template v-for="symptom in symptoms" :key="symptom.id">
							<SymptomCard :symptom="symptom" theme="light" />
						</template>
					</template>
					<template v-else>
						<span
							class="material-symbols-rounded animate-spin text-accent w-fit m-auto"
						>
							sync
						</span>
					</template>
				</div>
			</section>
			<section
				v-else-if="userType === 'professional'"
				class="bg-primary rounded-2xl xl:col-span-6 xl:row-span-5 p-5 flex flex-col justify-between h-full"
			>
				<div class="flex flex-col h-full space-y-2">
					<div class="flex justify-between">
						<p class="text-textLight font-bold text-xl">Pacientes passados</p>
						<RouterLink to="" class="text-accent flex">
							<p>Ver todos</p>
							<span class="material-symbols-rounded text-xl!">arrow_forward</span>
						</RouterLink>
					</div>
					<!-- Colocar cards de paciente aqui -->
				</div>
			</section>

			<section
				v-if="userType === 'patient'"
				class="bg-primary rounded-2xl xl:col-span-5 xl:row-span-3 p-5 flex flex-col justify-between items-center h-full"
			>
				<p class="text-textLight font-bold text-xl">Informações de saúde:</p>
				<!-- Colocar informações de saúde aqui -->
				<BaseButton
					theme="textLight"
					mode="outline"
					icon="edit_square"
					class="w-full rounded-4xl!"
				>
					Editar informações de saúde
				</BaseButton>
			</section>
			<section
				v-else-if="userType === 'professional'"
				class="bg-primary rounded-2xl xl:col-span-6 xl:row-span-3 p-5 flex flex-col justify-between items-center h-full"
			>
				<p class="text-textLight font-bold text-xl">Triagens:</p>
				<!-- Colocar cards de triagem aqui -->
				<BaseButton
					theme="textLight"
					mode="outline"
					icon="person"
					class="w-full rounded-4xl!"
				>
					Verificar triagens
				</BaseButton>
			</section>

			<section
				v-if="userType === 'patient'"
				class="bg-primary rounded-2xl xl:col-span-5 xl:row-span-3 p-5 flex flex-col justify-between items-center h-full"
			>
				<p class="text-textLight font-bold text-xl">Permissões médicas:</p>
				<!-- Colocar foto de profissionais permitidos aqui -->
				<BaseButton
					theme="textLight"
					mode="outline"
					icon="edit_square"
					class="w-full rounded-4xl!"
				>
					Editar permissões
				</BaseButton>
			</section>
			<section
				v-else-if="userType === 'professional'"
				class="bg-primary rounded-2xl xl:col-span-4 xl:row-span-3 p-5 flex flex-col justify-between items-center h-full"
			>
				<p class="text-textLight font-bold text-xl">Relatórios:</p>
				<!-- Colocar cards de relatórios aqui -->
				<BaseButton
					theme="textLight"
					mode="outline"
					icon="assignment"
					class="w-full rounded-4xl!"
				>
					Verificar relatórios
				</BaseButton>
			</section>
		</main>

		<main
			v-else
			class="size-full flex flex-col p-10 text-textLight gap-4 *:flex *:flex-col"
		>
			<header class="gap-1">
				<h1 class="text-4xl font-bold">Dashboard</h1>
				<p>Logado como {{ userName }}</p>
			</header>

			<section class="gap-2">
				<h2 class="text-2xl font-semibold">Solicitações de registro</h2>
				
				<table class="w-full text-textDark *:*:*:p-3 rounded-xs overflow-clip">
					<thead>
						<tr class="bg-surface/80 *:text-start">
							<th class="w-70">Nome</th>
							<th class="w-100">Email</th>
							<th class="w-40">CPF</th>
							<th class="w-20">CRM</th>
							<th class="w-100">Local de Atuação</th>
							<th class="w-50">Ações</th>
						</tr>
					</thead>
					<tbody>
						<template v-for="request in signupRequests" :key="request.id">
							<tr class="bg-surface border-b hover:brightness-90">
								<td>{{ request.name }}</td>
								<td>{{ request.email }}
								</td>
								<td>{{ formatToCPF(request.cpf) }}</td>
								<td>{{ request.professional_data?.crm }}/{{ request.professional_data?.uf }}</td>
								<td>{{ request.professional_data?.operation_area }}</td>
								<td class="flex flex-row gap-3 *:w-full">
									<BaseButton theme="primary" @click="approveRequest(request.id)">
										Aprovar
									</BaseButton>
									<!-- <BaseButton theme="error" mode="transparent" @click="denyRequest(request.id)">
										Negar
									</BaseButton> -->
								</td>
							</tr>
						</template>
						<template v-if="signupRequests && signupRequests.length === 0">
							<tr class="bg-surface">
								<td colspan="6" class="text-center">Nenhuma solicitação de registro encontrada.</td>
							</tr>
						</template>
					</tbody>
				</table>
			</section>

		</main>
	</div>
</template>
