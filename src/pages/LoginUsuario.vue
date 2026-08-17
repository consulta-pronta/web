<script setup lang="ts">
import { ref, type Ref } from "vue"
import { useRouter } from "vue-router"

import AuthBackground from "@/components/AuthBackground.vue"
import BaseButton, { type ButtonState } from "@/components/BaseButton.vue"
import BaseInput from "@/components/BaseInput.vue"
import BaseLogo from "@/components/BaseLogo.vue"
import ToggleUser from "@/components/ToggleUser.vue"

import { useSignInStore } from "@/stores/signInStore"


const status = ref("paciente")

const signInStore = useSignInStore()
const buttonState: Ref<ButtonState> = ref("enabled")
const router = useRouter()

const login = async () => {
	buttonState.value = "sync"

	try {
		await signInStore.signIn()
		router.push("dashboard")
	} catch (error) {
		console.error(error)
	} finally {
		buttonState.value = "enabled"
	}
}
</script>

<template>
	<AuthBackground>
		<BaseLogo text complete />
		<div class="w-1/2 box-border items-center justify-center flex flex-col">
			<div class="text-[36px] text-surface font-bold mb-1">Bem-Vindo</div>
			<div class="text-[16px] text-surface mb-3">
				Faça o login para acessar os seus dados.
			</div>

			<form
				@submit.prevent="login()"
				class="space-y-2 items-center justify-center flex flex-col w-116.25"
			>
				<ToggleUser v-model="status" class="mb-4" />

				<BaseInput type="email" placeholder="Email" icon="email" v-model="signInStore.email" required />
				<BaseInput type="password" placeholder="Senha" icon="lock" class="mb-5" v-model="signInStore.password" required />
				<BaseButton type="submit" bg-color="accent" class="w-40" v-model:state="buttonState">
					Entrar
				</BaseButton>

				<RouterLink to="">
					<p class="text-accent">Esqueceu a senha?</p>
				</RouterLink>

				<hr class="border-t-2 border-surface w-full m-4" />

				<BaseButton
					bg-color="primarydark"
					border
					border-color="accent"
					text-color="accent"
					path="cadastro"
					class="mt-2"
				>
					Cadastrar nova conta
				</BaseButton>
			</form>
		</div>
	</AuthBackground>
</template>
