<script setup lang="ts">
import { ref } from "vue"
import BaseButton, { type ButtonState } from "@/components/bases/BaseButton.vue"
import BaseInput from "@/components/bases/BaseInput.vue"
import MedicalPermission from "@/database/medicalPermission.model"
import Professional from "@/database/professional.model"
import { useAuthStore } from "@/stores/authStore"

const emit = defineEmits<{
	"handled-submit": []
}>()

const authStore = useAuthStore()
const email = ref("")
const message = ref("")
const professional = ref<Professional | null>(null)
const searchState = ref<ButtonState>("enabled")
const submitState = ref<ButtonState>("disabled")

const searchProfessional = async () => {
	resetState()

	const searchEmail = email.value
	if (!searchEmail) {
		message.value = "Informe o e-mail do profissional."
		return
	}

	searchState.value = "sync"
	try {
		professional.value = await Professional.getByEmail(searchEmail)
		if (!professional.value) {
			message.value = "Nenhum profissional encontrado com esse e-mail."
			return
		}

		submitState.value = "enabled"
	} catch (error) {
		console.error("Failed to search professional by email.", error)
		message.value = "Não foi possível pesquisar agora. Tente novamente."
	} finally {
		searchState.value = "enabled"
	}
}

const sendRequest = async () => {
	if (!professional.value) {
		return
	}

	submitState.value = "sync"
	message.value = ""
	try {
		authStore.onReady(async (data) => {
			const worked = await MedicalPermission.createRequest(
				// @ts-expect-error(dumb)
				professional.value.id,
				data.id,
			)
			if (!worked) {
				console.error("Professional access request already exists.")
				message.value = "Solicitação de acesso já existe."
			}
			emit("handled-submit")
		})
	} catch (error) {
		console.error("Failed to send professional access request.", error)
		message.value = "Não foi possível enviar a solicitação. Tente novamente mais tarde."
	} finally {
		submitState.value = "enabled"
	}
}

const resetState = () => {
	professional.value = null
	submitState.value = "disabled"
	message.value = ""
}
</script>

<template>
	<form class="flex flex-col gap-4" @submit.prevent="sendRequest">
		<p class="text-textLight">
			Pesquise o profissional pelo e-mail e envie uma solicitação de acesso.
		</p>

		<div class="flex items-stretch gap-2">
			<BaseInput
				v-model="email"
				type="email"
				placeholder="E-mail do profissional"
				icon="mail"
				required
				class="min-w-0 flex-1"
				@keydown.enter.prevent="searchProfessional"
				@input="resetState"
			/>
			<BaseButton
				type="button"
				theme="accent"
				icon="search"
				:state="searchState"
				class="h-[stretch]"
				@click="searchProfessional"
			/>
		</div>

		<section
			v-if="professional"
			class="rounded-md bg-surface p-4 text-textDark"
			aria-live="polite"
		>
			<h3 class="font-semibold">{{ professional.name }}</h3>
			<p>
				CRM:
				{{ `${professional.professional_data?.crm}/${professional.professional_data?.uf}` }}
			</p>
		</section>

		<p v-if="message" class="text-sm text-accent" role="status">
			{{ message }}
		</p>

		<BaseButton
			type="submit"
			theme="accent"
			icon="send"
			:state="submitState"
		>
			Enviar solicitação
		</BaseButton>
	</form>
</template>
