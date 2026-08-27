<script setup lang="ts">
import { ref, type Ref } from "vue"
import { useRouter } from "vue-router"

import AuthBackground from "@/components/AuthBackground.vue"
import BaseButton, { type ButtonState } from "@/components/BaseButton.vue"
import BaseLogo from "@/components/BaseLogo.vue"
import BaseInput from "@/components/BaseInput.vue"
import ToggleUser from "@/components/ToggleUser.vue"
// import UserPhoto from "@/components/UserPhoto.vue"

import { useSignUpStore } from "@/stores/signUpStore"


const router = useRouter()
const signUpStore = useSignUpStore()

const buttonState: Ref<ButtonState> = ref("enabled")
const showPasswordRules = ref(false)


const submitForm = async () => {
	buttonState.value = "sync"

	try {
		// const isPasswordValid = await signUpStore.isPasswordValid()
		await signUpStore.submitForm()
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
			<div class="text-4xl sm:text-5xl xl:text-6xl text-surface font-bold mb-1">Crie uma Conta</div>
			<div class="text-lg sm:text-xl xl:text-2xl text-surface mb-3">Preencha seus dados para começar.</div>

			<!--form-->
			<form
				@submit.prevent="submitForm"
				class="space-y-2 items-center justify-center flex flex-col p-4 w-100 sm:w-120 lg:w-120 xl:w-140"
			>
				<!-- <UserPhoto borderColor="accent"/> -->

				<ToggleUser v-model="signUpStore.userType" class="mb-4" />

				<BaseInput
					type="text" placeholder="Nome" icon="person" theme="dark"
					class="w-full"
					v-model="signUpStore.name" required
				/>
				<BaseInput
					type="cpf" placeholder="CPF" icon="article" theme="dark"
					class="w-full"
					v-model="signUpStore.cpf" required
				/>
				<BaseInput
					type="email" placeholder="E-Mail" icon="email" theme="dark"
					class="w-full"
					v-model="signUpStore.email" required
				/>
				<BaseInput
					type="tel" placeholder="Telefone" icon="phone" theme="dark"
					class="w-full"
					v-model="signUpStore.phone" required
				/>
				<div class="relative w-full">
					<BaseInput
						type="password" placeholder="Senha" icon="lock" theme="dark"
						v-model="signUpStore.password" required
						@focusin="showPasswordRules = true" @focusout="showPasswordRules = false"
					/>
					<div
						v-if="showPasswordRules"
						class="absolute left-0 right-0 bottom-[130%] mx-auto w-64 bg-surface p-3 "
					>
						<p
							v-for="(value, key) in signUpStore.rules"
							:key="key"
							:class="value ? 'text-textDark' : 'text-error'"
							class="flex items-center gap-2 text-sm py-0.5"
						>
							<span class="material-symbols-rounded">
								{{ value ? 'check_circle' : 'cancel' }}
							</span>
							{{
								key === "minLength" ? "Mínimo 8 caracteres" :
								key === "hasNumber" ? "Pelo menos 1 número" :
								key === "hasLowercase" ? "Pelo menos 1 letra minúscula" :
								key === "hasUppercase" ? "Pelo menos 1 letra maiúscula" :
								key === "match" ? "Senhas coincidem" :
								key
							}}
						</p>
						<span class="w-4 h-4 bg-surface absolute -bottom-2 left-0 right-0 mx-auto rotate-45"></span>
					</div>
				</div>

				<BaseInput
					type="password" placeholder="Confirmar senha" icon="lock" theme="dark"
					class="w-full"
					v-model="signUpStore.confirmPassword" required
				/>

				<BaseButton
					v-if="signUpStore.userType === 'profissional'"
					type="button"
					theme="dark"
					mode="transparent"
					icon="article"
					path="cadastroCRM"
					class="border-0 bg-textDark"
				>
					Enviar CRM ou E-CRM
				</BaseButton>

				<br>
				<BaseButton
					type="submit"
					theme="light"
					class="w-full justify-center"
					v-model:state="buttonState"
				>
					Criar Conta
				</BaseButton>

				<RouterLink to="login">
					<p class="text-textLight">
						Já possui conta? <a href="" class="text-accent">Fazer login</a>
					</p>
				</RouterLink>
			</form>
		</div>
	</AuthBackground>
</template>
