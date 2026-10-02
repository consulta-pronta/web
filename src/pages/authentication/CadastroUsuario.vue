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
import PasswordRules from "@/components/cards/PasswordRules.vue"

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
				Preencha seus dados para começar.
			</div>

			
			<form
			@submit.prevent="submitForm"
			class="space-y-2 items-center justify-center flex flex-col p-4 w-100 sm:w-120 lg:w-120 xl:w-140"
			>
				<!-- <progress class="w-full" max="3" value="1"></progress> -->

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
						required
						v-model="signUpStore.crm"
					/>

					<BaseSelect
						theme="dark"
						default-value="UF"
						required
						class="w-20"
						v-model="signUpStore.uf"
						>

						<template v-for="uf in ufList" :key="uf">
							<option :value="uf">{{ uf }}</option>
						</template>
					</BaseSelect>
				</fieldset>
				
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
