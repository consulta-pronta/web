<script setup lang="ts">
import { ref, type Ref } from "vue"
import { useRouter } from "vue-router"

import AuthBackground from "@/components/AuthBackground.vue"
import BaseButton, { type ButtonState } from "@/components/bases/BaseButton.vue"
import BaseLogo from "@/components/bases/BaseLogo.vue"
import BaseInput from "@/components/bases/BaseInput.vue"
import whatsappIcon from "@/assets/icons/whatsapp.svg"
import telegramIcon from "@/assets/icons/telegram.svg"
// import UserPhoto from "@/components/UserPhoto.vue"

import { useSignUpStore } from "@/stores/signUpStore"

const router = useRouter()
const signUpStore = useSignUpStore()

const buttonState: Ref<ButtonState> = ref("enabled")

const mostrarEmail = ref(false)
const mostrarSMS = ref(false)
const mostrarWhatsapp = ref(false)
const mostrarTelegram = ref(false)


//Não está verificando se os campos dos forms estão vazios.

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

		<div class="lg:w-1/2 box-border items-center justify-center flex flex-col gap-6 lg:relative">
			<BaseButton
				theme="textLight"
				mode="transparent"
				icon="arrow_back"
				class="lg:absolute lg:top-0 lg:left-0 mb-3 sm:m-5"
				@click="router.back()"
			>
				<p class="text-3xl font-bold">Voltar</p>
			</BaseButton>
			<div class="text-4xl sm:text-5xl xl:text-6xl text-surface font-bold mb-1">
				Crie uma Conta
			</div>
			<div class="text-base sm:text-xl xl:text-2xl text-surface mb-3">
				Selecione uma das formas de contato (no mínimo uma).
			</div>

			<!--form-->
			<form
				@submit.prevent="submitForm"
				class="space-y-2 items-center justify-center flex flex-col p-4 w-100 sm:w-120 lg:w-120 xl:w-140"
			>

				<article class="flex flex-col w-full rounded-md px-3 cursor-pointer">
					<section>
						<input type="checkbox" class="h-4 w-4 appearance-none rounded border border-textLight bg-transparent checked:bg-textLight checked:border-textLight" v-model="mostrarEmail"/>
						<span class="text-textLight text-xl font-bold">
							Email
						</span>
					</section>
					<BaseInput
						v-if="mostrarEmail"
						type="email"
						placeholder="E-Mail"
						icon="email"
						theme="dark"
						class="w-full"
						v-model="signUpStore.email"
						required
					/>
				</article>

				<article class="flex flex-col w-full rounded-md px-3 cursor-pointer">
					<section>
						<input type="checkbox" class="h-4 w-4 appearance-none rounded border border-textLight bg-transparent checked:bg-textLight checked:border-textLight" v-model="mostrarSMS"/>
						<span class="text-textLight text-xl font-bold">
							SMS
						</span>
					</section>
					<BaseInput
						v-if="mostrarSMS"
						type="tel"
						placeholder="SMS"
						icon="sms"
						theme="dark"
						class="w-full"
						v-model="signUpStore.phone"
						required
					/>
				</article>


				<article class="flex flex-col w-full rounded-md px-3 cursor-pointer">
					<section>
						<input type="checkbox" class="h-4 w-4 appearance-none rounded border border-textLight bg-transparent checked:bg-textLight checked:border-textLight" v-model="mostrarWhatsapp"/>
						<span class="text-textLight text-xl font-bold">
							Whatsapp
						</span>
					</section>
					<BaseInput
						v-if="mostrarWhatsapp"
						type="tel"
						placeholder="Whatsapp"
						:icon-image="whatsappIcon"
						theme="dark"
						class="w-full"
						v-model="signUpStore.phone"
						required
					/>
				</article>

				<article class="flex flex-col w-full rounded-md px-3 cursor-pointer">
					<section>
						<input type="checkbox" class="h-4 w-4 appearance-none rounded border border-textLight bg-transparent checked:bg-textLight checked:border-textLight" v-model="mostrarTelegram"/>
						<span class="text-textLight text-xl font-bold">
							Telegram
						</span>
					</section>
					<BaseInput
						v-if="mostrarTelegram"
						type="tel"
						placeholder="Telegram"
						:icon-image="telegramIcon"
						theme="dark"
						class="w-full"
						v-model="signUpStore.phone"
						required
					/>
				</article>
				<br />
				<RouterLink to="login">
					<p class="text-textLight">
						Já possui conta? <a href="" class="text-accent">Fazer login</a>
					</p>
				</RouterLink>

				<BaseButton
					type="submit"
					theme="accent"
					class="w-full justify-center"
					v-model:state="buttonState"
				>
					Verificar
				</BaseButton>
			</form>
		</div>
	</AuthBackground>
</template>
