<script setup lang="ts">
import { ref, watch } from "vue"
import { useRouter } from "vue-router"
import AuthBackground from "@/components/AuthBackground.vue"
import BaseButton from "@/components/bases/BaseButton.vue"
import BaseInput from "@/components/bases/BaseInput.vue"
import BaseLogo from "@/components/bases/BaseLogo.vue"
import { auth } from "@/config/firebase"
import { sendPasswordResetEmail } from "firebase/auth"

const router = useRouter()

const step = ref(1)
const email = ref("")

const steps = 4

const actions = {
	0: () => { router.push("login") },
	1: () => {
		// NOT COMPLETE
		sendPasswordResetEmail(auth, email.value, {
			url: `${import.meta.env.VITE_APP_URL}`,
			handleCodeInApp: true
		})
	},
	2: () => {},
	3: () => {},
	4: () => { router.push("login") }
}
  
watch(step, (value) => {
	const callback = actions[value as keyof typeof actions]
	if (callback) { callback() }
})

// Excluir depois, só pra n ficar com codigo vermelho
const bruh = ref("")
</script>

<template>
	<AuthBackground>
		<BaseLogo text complete />
		<main class="lg:w-1/2 box-border items-center justify-center flex flex-col lg:relative">
			<BaseButton
				theme="textLight"
				mode="transparent"
				icon="arrow_back"
				class="lg:absolute lg:top-0 lg:left-0 mb-3 sm:m-5"
				@click="step--"
			>
				<p class="text-3xl font-bold">Voltar</p>
			</BaseButton>
			<section class="box-border items-center justify-center flex flex-col">
				<div class="text-4xl sm:text-5xl xl:text-6xl text-surface font-bold mb-1">
					Recuperar senha
				</div>
				<div class="text-lg sm:text-xl xl:text-2xl text-surface mb-5 text-center">
					Siga os passos abaixo para recuperar sua senha.
				</div>

				<hr
					class="h-px border-0 bg-textLight w-90 sm:w-120 xl:w-140 my-1 sm:my-3 mx-auto rounded-full"
				/>

				<form
					@submit.prevent="step++"
					class="space-y-2 items-center justify-center flex flex-col p-4 w-100 sm:w-120 lg:w-120 xl:w-140"
				>
					<section class="flex flex-col w-full justify-start gap-3 mb-6 text-accent">
						<p :class="step !== 1 ? 'opacity-70' : ''">1. Digite seu e-mail</p>
						<p v-if="step >= 2" :class="step !== 2 ? 'opacity-70' : ''">
							2. Digite o código enviado por e-mail
						</p>
						<p v-if="step == 3">3. Digite sua nova senha</p>
					</section>

					<BaseInput
						v-if="step === 1"
						type="email"
						theme="dark"
						placeholder="Email"
						icon="email"
						class="w-full"
						required
						v-model="email"
					/>

					<section v-if="step === 2" class="flex justify-center items-center gap-3">
						<input
							v-for="n in 6"
							:key="n"
							type="text"
							required
							class="w-full h-30 text-4xl text-textLight bg-primaryDark outline-2 outline-primary rounded-2xl p-3 text-center"
						/>
					</section>

					<!-- Trocar para uma store de recuperar senha (Rafael) -->
					<div v-if="step === 3" class="relative w-full">
						<BaseInput
							type="password"
							placeholder="Senha"
							icon="lock"
							theme="dark"
							v-model="bruh"
							required
							@focusin="bruh"
							@focusout="bruh"
						/>
						<div
							v-if="bruh"
							class="absolute left-0 right-0 bottom-[130%] mx-auto w-64 bg-surface p-3"
						>
							<p
								v-for="(value, key) in bruh"
								:key="key"
								:class="value ? 'text-textDark' : 'text-error'"
								class="flex items-center gap-2 text-sm py-0.5"
							>
								<span class="material-symbols-rounded">
									{{ value ? "check_circle" : "cancel" }}
								</span>
								{{
									key === "minLength"
										? "Mínimo 8 caracteres"
										: key === "hasNumber"
											? "Pelo menos 1 número"
											: key === "hasLowercase"
												? "Pelo menos 1 letra minúscula"
												: key === "hasUppercase"
													? "Pelo menos 1 letra maiúscula"
													: key === "match"
														? "Senhas coincidem"
														: key
								}}
							</p>
							<span
								class="w-4 h-4 bg-surface absolute -bottom-2 left-0 right-0 mx-auto rotate-45"
							></span>
						</div>
					</div>

					<BaseInput
						v-if="step === 3"
						type="password"
						placeholder="Confirmar senha"
						icon="lock"
						theme="dark"
						class="w-full"
						v-model="bruh"
						required
					/>

					<br />

					<BaseButton type="submit" theme="accent" class="justify-center w-full mt-4">
						Prosseguir
					</BaseButton>
				</form>
			</section>
		</main>
	</AuthBackground>
</template>
