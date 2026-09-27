<script setup lang="ts">
import { ref, type Ref } from "vue"
import { useRouter } from "vue-router"

import AuthBackground from "@/components/AuthBackground.vue"
import BaseLogo from "@/components/bases/BaseLogo.vue"
import BaseButton, { type ButtonState } from "@/components/bases/BaseButton.vue"
import BaseInput, { type BaseInputProps } from "@/components/bases/BaseInput.vue"
import BaseSelect from "@/components/bases/BaseSelect.vue"
import ToggleUser from "@/components/ToggleUser.vue"
import { useSignUpStore } from "@/stores/signUpStore"
import ufList from "@/assets/lista_uf.json" with { type: "json" }

const router = useRouter()
const signUpStore = useSignUpStore()

const buttonState: Ref<ButtonState> = ref("enabled")
const showPasswordRules = ref(false)

const submitForm = async () => {
	buttonState.value = "sync"

	try {
		await signUpStore.submitForm()
		router.push("dashboard")
	} catch (error) {
		console.error(error)
	} finally {
		buttonState.value = "enabled"
	}
}

interface Uhh extends BaseInputProps { class: string }
const sharedAttributes: Uhh = {
	theme: "dark",
	required: true,
	class: "w-full",
}
</script>
<template>
	<AuthBackground>
		<BaseLogo text complete />

		<div class="lg:w-1/2 box-border items-center justify-center flex flex-col">
			<div class="text-4xl sm:text-5xl xl:text-6xl text-surface font-bold mb-1">
				Crie uma Conta
			</div>
			<div class="text-lg sm:text-xl xl:text-2xl text-surface mb-3">
				Preencha seus dados para começar.
			</div>

			<form
				@submit.prevent="submitForm"
				class="space-y-2 items-center justify-center flex flex-col p-4 w-100 sm:w-120 lg:w-120 xl:w-140"
			>

				<ToggleUser v-model="signUpStore.userType" class="mb-4" />

				<BaseInput
					v-bind="sharedAttributes"
					type="text"
					placeholder="Nome"
					icon="person"
					v-model="signUpStore.name"
				/>
				<BaseInput
					v-bind="sharedAttributes"
					type="cpf"
					placeholder="CPF"
					icon="article"
					v-model="signUpStore.cpf"
				/>
				<BaseInput
					v-bind="sharedAttributes"
					type="email"
					placeholder="E-Mail"
					icon="email"
					v-model="signUpStore.email"
				/>
				<BaseInput
					v-bind="sharedAttributes"
					type="tel"
					placeholder="Telefone"
					icon="phone"
					v-model="signUpStore.phone"
				/>

				<fieldset
					v-if="signUpStore.userType === 'profissional'"
					class="w-full flex flex-row gap-3"
					>

					<BaseInput
						type="crm"
						placeholder="CRM"
						icon="assignment_ind"
						theme="dark"
						class="grow"
					/>

					<BaseSelect
						theme="dark"
						default-value="UF"
						required
						class="w-20"
						>

						<template v-for="uf in ufList" :key="uf">
							<option :value="uf">{{ uf }}</option>
						</template>
					</BaseSelect>
				</fieldset>
				<div class="relative w-full">
					<BaseInput
						v-bind="sharedAttributes"
						type="password"
						placeholder="Senha"
						icon="lock"
						v-model="signUpStore.password"
						@focusin="showPasswordRules = true"
						@focusout="showPasswordRules = false"
					/>
					<div
						v-if="showPasswordRules"
						class="absolute left-0 right-0 bottom-[130%] mx-auto w-64 bg-surface p-3"
					>
						<p
							v-for="(value, key) in signUpStore.rules"
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
					v-bind="sharedAttributes"
					type="password"
					placeholder="Confirmar senha"
					icon="lock"
					v-model="signUpStore.confirmPassword"
				/>

				<br />
				<BaseButton
					type="submit"
					theme="accent"
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
