<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from "vue"
import { useRouter } from "vue-router"

import AuthBackground from "@/components/AuthBackground.vue"
import BaseLogo from "@/components/bases/BaseLogo.vue"
import BaseButton, { type ButtonState } from "@/components/bases/BaseButton.vue"
import BaseInput, { type BaseInputProps } from "@/components/bases/BaseInput.vue"
import BaseSelect from "@/components/bases/BaseSelect.vue"
import ToggleUser from "@/components/ToggleUser.vue"
import { useSignUpStore } from "@/stores/signUpStore"
import ufList from "@/assets/lista_uf.json" with { type: "json" }
import PasswordRules from "@/components/cards/PasswordRules.vue"

const router = useRouter()
const signUpStore = useSignUpStore()

const currentStep = ref(1)
const buttonState = ref<ButtonState>("enabled")
const showPasswordRules = ref(false)

const form = useTemplateRef("form")

const stepTitle = computed(() => {
	switch (currentStep.value) {
		case 1:
			return "Informações de login"
		case 2:
			return "Informações pessoais"
		default:
			return "Informações do perfil"
	}
})

watch(currentStep, (value, previous) => {
	if (value < previous) { return }
	if (!form.value?.reportValidity()) {
		currentStep.value = previous
		return
	}

	switch (previous) {
		case 1:
			if (signUpStore.isPasswordInvalid) {
				alert("Senha inválida. Por favor, verifique os requisitos de senha.")
				currentStep.value = previous
			}
			break
		case 2:
			if (signUpStore.isCpfInvalid) {
				alert("CPF inválido. Por favor, verifique o CPF informado.")
				currentStep.value = previous
			}
			else if (signUpStore.isPhoneInvalid) {
				alert("Telefone inválido. Por favor, verifique o telefone informado.")
				currentStep.value = previous
			}
			break
		case 3:
			submitForm()
			break
	}
})

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

const rulesAnchor = ref<"--default" | "--confirm">("--default")
const setPasswordRulesAnchor = (anchor: null | "default" | "confirm") => {
	if (!anchor) {
		showPasswordRules.value = false
		return
	}
	showPasswordRules.value = true
	rulesAnchor.value = `--${anchor}`
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
				{{ stepTitle }}
			</div>

			
			<form
				ref="form"
				@submit.prevent="currentStep++"
				@keydown.enter="currentStep++"
				class="space-y-2 items-center justify-center flex flex-col p-4 w-100 sm:w-120 lg:w-120 xl:w-140"
			>
				<progress class="w-full mb-8" max="3" :value="currentStep">
					{{ currentStep }} / 3
				</progress>

				<template v-if="currentStep === 1">
					<BaseInput
						v-bind="sharedAttributes"
						type="email"
						placeholder="E-Mail"
						icon="email"
						v-model="signUpStore.email"
					/>
					<BaseInput
						v-bind="sharedAttributes"
						type="password"
						placeholder="Senha"
						icon="lock"
						v-model="signUpStore.password"
						@focusin="setPasswordRulesAnchor('default')"
						@focusout="setPasswordRulesAnchor(null)"
						style="anchor-name: --default;"
					/>
					<BaseInput
						v-bind="sharedAttributes"
						type="password"
						placeholder="Confirmar senha"
						icon="lock"
						v-model="signUpStore.confirmPassword"
						@focusin="setPasswordRulesAnchor('confirm')"
						@focusout="setPasswordRulesAnchor(null)"
						style="anchor-name: --confirm;"
					/>
					<PasswordRules
						v-show="showPasswordRules"
						:rules="signUpStore.rules"
						id="password-rules"
						class="absolute w-64 bg-surface p-3 mb-4"
					/>
				</template>

				<template v-else-if="currentStep === 2">
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
						type="tel"
						placeholder="Telefone"
						icon="phone"
						v-model="signUpStore.phone"
					/>
				</template>

				<template v-else>
					<ToggleUser v-model="signUpStore.userType" class="mb-4" />
					<template 
						v-if="signUpStore.userType === 'profissional'">
						<fieldset
							class="w-full flex flex-row gap-3"
						>
							<BaseInput
								type="crm"
								placeholder="CRM"
								icon="assignment_ind"
								theme="dark"
								class="grow"
								required
								v-model="signUpStore.professionalData.crm"
							/>

							<BaseSelect
								theme="dark"
								default-value="UF"
								required
								class="w-20"
								v-model="signUpStore.professionalData.uf"
							>
								<template v-for="uf in ufList" :key="uf">
									<option :value="uf">{{ uf }}</option>
								</template>
							</BaseSelect>
						</fieldset>
						<BaseInput
							v-bind="sharedAttributes"
							placeholder="Local de atuação"
							icon="local_hospital"
							required
							v-model="signUpStore.professionalData.localAtuacao"
						/>
					</template>
					<template v-else>
						<BaseInput
							v-bind="sharedAttributes"
							placeholder="Peso"
							icon="weight"
							v-model="signUpStore.patientData.peso"
						/>
						<BaseInput
							v-bind="sharedAttributes"
							placeholder="Altura"
							icon="height"
							v-model="signUpStore.patientData.altura"
						/>
						<BaseSelect
							v-bind="sharedAttributes"
							default-value="Tipo Sanguíneo"
							icon="bloodtype"
							v-model="signUpStore.patientData.tipoSanguineo"
						>
							<template v-for="tipo in ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']" :key="tipo">
								<option :value="tipo">{{ tipo }}</option>
							</template>
						</BaseSelect>
					</template>
				</template>

				<div class="w-full flex gap-3 *:w-full mt-4">
					<BaseButton
						v-show="currentStep !== 1"
						type="button"
						theme="primary"
						@click="currentStep--"
					>
						Voltar
					</BaseButton>
					<BaseButton
						v-show="currentStep !== 3"
						type="button"
						theme="accent"
						@click="currentStep++"
					>
						Continuar
					</BaseButton>

					<BaseButton
						v-if="currentStep === 3"
						type="submit"
						theme="accent"
						v-model:state="buttonState"
					>
						Criar Conta
					</BaseButton>
				</div>

				<RouterLink to="login">
					<p v-if="currentStep === 1" class="text-textLight text-center">
						Já possui conta? <a href="" class="text-accent">Fazer login</a>
					</p>
				</RouterLink>
			</form>
		</div>
	</AuthBackground>
</template>

<style scoped>
@reference "@/assets/main.css";

progress {
	@apply overflow-hidden rounded-full h-3
		progress-unfilled:bg-primary
		progress-filled:bg-accent
		progress-filled:rounded-2xl
		progress-filled:transition-all
		progress-filled:duration-300
}

#password-rules {
	position-anchor: v-bind(rulesAnchor);
	bottom: anchor(top);
}

</style>
