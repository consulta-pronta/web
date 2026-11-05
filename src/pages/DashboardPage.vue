<script setup lang="ts">
import { computed, ref } from "vue"
import { useAuthStore } from "@/stores/authStore"
import ProfessionalSignupRequestRow from "@/components/ProfessionalSignupRequestRow.vue"
import Professional from "@/database/professional.model"
import User from "@/database/user.model"
import { runTransaction, serverTimestamp } from "firebase/firestore"
import { db } from "@/database/firebase"
import PageWrapper from "@/components/wrappers/PageWrapper.vue"
import HeaderWrapper from "@/components/wrappers/HeaderWrapper.vue"
import DefaultContentWrapper from "@/components/wrappers/DefaultContentWrapper.vue"
import { searchDocuments } from "@/utils"
import BaseInput from "@/components/bases/BaseInput.vue"

const authStore = useAuthStore()

const signupRequests = ref<Professional[]>([])
const searchQuery = ref("")

const filteredRequests = computed(
	() => searchDocuments(signupRequests.value, searchQuery.value) as Professional[],
)

const approveRequest = async (requestId: string) => {
	const ogRequest = signupRequests.value?.find((req) => req.id === requestId)
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
	if (data.user_type === "admin") {
		signupRequests.value = await Professional.getRequests()
	}
})
</script>

<template>
	<PageWrapper class="text-textLight">
		<HeaderWrapper title="Dashboard" class="gap-3!">
			<p>Logado como {{ authStore.userData?.name ?? "..." }}</p>
		</HeaderWrapper>

		<DefaultContentWrapper class="flex-col gap-2">
			<div class="flex flex-row justify-between">
				<h2 class="text-2xl font-semibold">Solicitações de registro</h2>

				<BaseInput
					v-model="searchQuery"
					placeholder="Pesquisar"
					icon="search"
					class="place-self-center w-full md:w-120"
				/>
			</div>

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
					<ProfessionalSignupRequestRow
						v-for="request in filteredRequests"
						:key="request.id"
						:request="request"
						@approve="approveRequest"
					/>
					<tr v-if="signupRequests.length === 0" class="bg-surface">
						<td colspan="6" class="text-center">
							Nenhuma solicitação de registro encontrada.
						</td>
					</tr>
				</tbody>
			</table>
		</DefaultContentWrapper>
	</PageWrapper>
</template>
