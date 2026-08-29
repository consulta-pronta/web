<script setup lang="ts">
import { ref, type Ref } from "vue"
import { useRouter } from "vue-router"

import AuthBackground from "@/components/AuthBackground.vue"
import BaseButton, { type ButtonState } from "@/components/BaseButton.vue"
import BaseInput from "@/components/BaseInput.vue"
import BaseLogo from "@/components/BaseLogo.vue"
import ToggleUser, { type UserType } from "@/components/ToggleUser.vue"

import { useSignInStore } from "@/stores/signInStore"

const status = ref<UserType>("paciente")

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
		<div class="lg:w-1/2 box-border items-center justify-center flex flex-col">
			<div class="text-4xl sm:text-5xl xl:text-6xl text-surface font-bold mb-1">
				Bem-Vindo
			</div>
			<div class="text-lg sm:text-xl xl:text-2xl text-surface mb-5">
				Faça o login para acessar os seus dados.
			</div>

			<form
				@submit.prevent="login()"
				class="space-y-2 items-center justify-center flex flex-col p-4 w-100 sm:w-120 lg:w-120 xl:w-140"
			>
				<ToggleUser v-model="status" />
				<br />

				<BaseInput
					type="email"
					placeholder="Email"
					icon="email"
					theme="dark"
					class="w-full"
					v-model="signInStore.email"
					required
				/>
				<BaseInput
					type="password"
					placeholder="Senha"
					icon="lock"
					theme="dark"
					class="w-full"
					v-model="signInStore.password"
					required
				/>
				<br />
				<BaseButton
					type="submit"
					theme="light"
					class="justify-center w-full"
					v-model:state="buttonState"
				>
					Entrar
				</BaseButton>

				<RouterLink to="cadastro">
					<p class="text-textLight">
						Nâo possui conta?
						<a href="" class="text-accent">Criar conta</a>
					</p>
				</RouterLink>

				<RouterLink to="">
					<p class="text-accent">Esqueceu a senha?</p>
				</RouterLink>
			</form>
		</div>
	</AuthBackground>
</template>
