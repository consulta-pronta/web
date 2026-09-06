<script setup lang="ts">
import { ref, watch } from "vue"
import { useRouter } from "vue-router"
import AuthBackground from "@/components/AuthBackground.vue"
import BaseButton, { type ButtonState } from "@/components/bases/BaseButton.vue"
import BaseInput from "@/components/bases/BaseInput.vue"
import BaseLogo from "@/components/bases/BaseLogo.vue"
import { auth } from "@/config/firebase"
import { sendPasswordResetEmail } from "firebase/auth"
import validator from "validator"

const router = useRouter()

const email = ref("")
const submitState = ref<ButtonState>("disabled")
const emailSent = ref(false)

const submitForm = async () => {
	if (emailSent.value) {
		router.back()
		return
	}

	submitState.value = "sync"

	await sendPasswordResetEmail(auth, email.value)

	emailSent.value = true
	stopWatcing()
	submitState.value = "enabled"
}

const stopWatcing = watch(email, (value) => {
	submitState.value = validator.isEmail(value) ? "enabled" : "disabled"
})
</script>

<template>
	<AuthBackground>
		<BaseLogo text complete />

		<main
			class="lg:w-1/2 box-border items-center justify-center flex flex-col gap-6 lg:relative"
		>
			<BaseButton
				theme="textLight"
				mode="transparent"
				icon="arrow_back"
				class="lg:absolute lg:top-0 lg:left-0 mb-3 sm:m-5"
				@click="router.back()"
			>
				<p class="text-3xl font-bold">Voltar</p>
			</BaseButton>

			<header class="text-textLight text-center flex flex-col gap-1">
				<div class="text-4xl sm:text-5xl xl:text-6xl font-bold">Recuperar senha</div>
				<div class="text-lg sm:text-xl xl:text-2xl">
					Siga os passos abaixo para recuperar sua senha
				</div>
			</header>

			<form
				@submit.prevent="submitForm"
				class="space-y-2 items-center justify-center flex flex-col p-4 w-100 sm:w-120 lg:w-120 xl:w-140"
			>
				<!-- Depois fazer isso se tornar barte do BaseInput -->
				<label class="w-full flex flex-col justify-start gap-2" v-if="!emailSent">
					<p class="text-accent/85">Digite o seu e-mail</p>

					<BaseInput
						type="email"
						placeholder="Email"
						icon="email"
						theme="dark"
						required
						v-model="email"
					/>
				</label>
				<div v-else class="text-accent/85 text-center">
					<p>Abra o e-mail enviado para prosseguir com a recuperação de senha.</p>
					<p>Após isso, volte para a página de login para entrar em sua conta.</p>
				</div>

				<br />

				<BaseButton
					type="submit"
					theme="accent"
					class="justify-center w-full mt-4"
					:state="submitState"
				>
					<template v-if="emailSent"> Voltar para página de login </template>
					<template v-else> Enviar e-mail para resetar senha </template>
				</BaseButton>
			</form>
		</main>
	</AuthBackground>
</template>
