<script setup lang="ts">
import BaseIconButton from "@/components/bases/BaseIconButton.vue"
import BaseButton, { type ButtonState } from "@/components/bases/BaseButton.vue"
import BaseDialog from "@/components/bases/BaseDialog.vue"
import BaseInput from "@/components/bases/BaseInput.vue"
import BaseSelect from "@/components/bases/BaseSelect.vue"
import BaseToggle from "@/components/bases/BaseToggle.vue"
import { auth } from "@/database/firebase"
import { useConfigStore, type ContrastLevel, type FontSize } from "@/stores/configStore"
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword, validatePassword } from "firebase/auth"
import { onMounted, ref } from "vue"
import { useToast } from "vue-toastification"

const configStore = useConfigStore()
const toast = useToast()
const passwordDialogVisible = ref(false)
const currentPassword = ref("")
const newPassword = ref("")
const confirmPassword = ref("")
const passwordSubmitState = ref<ButtonState>("enabled")

const fontSizeButtons: { icon: string; size: FontSize }[] = [
	{ icon: "text_decrease", size: "small" },
	{ icon: "match_case", size: "default" },
	{ icon: "text_increase", size: "big" },
]

const contrastLevels: { value: ContrastLevel, label: string }[] = [
	{ value: "default", label: "Padrão" },
	{ value: "high", label: "Médio" },
	{ value: "high++", label: "Alto" },
]

onMounted(() => {
	configStore.contrastLevel = "default"
})

const openPasswordDialog = () => {
	currentPassword.value = ""
	newPassword.value = ""
	confirmPassword.value = ""
	passwordDialogVisible.value = true
}

const changePassword = async () => {
	const user = auth.currentUser
	if (!user?.email) {
		toast.error("Não foi possível alterar a senha desta conta.")
		return
	}

	if (newPassword.value !== confirmPassword.value) {
		toast.error("A confirmação da nova senha não corresponde com a digitada.")
		return
	}

	passwordSubmitState.value = "sync"
	try {
		const passwordStatus = await validatePassword(auth, newPassword.value)
		if (!passwordStatus.isValid) {
			toast.error("A nova senha não atende aos requisitos de segurança.")
			return
		}

		const credential = EmailAuthProvider.credential(user.email, currentPassword.value)
		await reauthenticateWithCredential(user, credential)
		await updatePassword(user, newPassword.value)

		passwordDialogVisible.value = false
		toast.success("Senha alterada com sucesso.")
	} catch (error) {
		console.error("Failed to change password.", error)
		toast.error("Não foi possível alterar a senha. Verifique a senha atual e tente novamente.")
	} finally {
		passwordSubmitState.value = "enabled"
	}
}
</script>

<template>
	<article>
		<section>
			<h2>Acessibilidade</h2>
			
			<fieldset>
				<p>Tamanho do Texto</p>
				<div class="flex flex-row gap-2">
					<BaseIconButton
						v-for="value in fontSizeButtons"
						:icon="value.icon"
						theme="bright"
						mode="square"
						@click="configStore.fontSize = value.size"
					/>
				</div>
			</fieldset>

			<fieldset>
				<p>Tema Claro</p>
				<BaseToggle v-model="configStore.lightTheme"  />
			</fieldset>

			<fieldset>
				<p>Alto Contraste</p>
				<BaseSelect
					v-model="configStore.contrastLevel"
					default-value="Padrão"
					mode="outline"
					class="w-25"
				>
					<option
						v-for="item in contrastLevels"
						:value="item.value"
					>
						{{  item.label }}
					</option>
				</BaseSelect>
			</fieldset>

			<fieldset>
				<p>Texto em Negrito</p>
				<BaseToggle v-model="configStore.boldText" />
			</fieldset>

			<fieldset>
				<p>Reduzir animações</p>
				<BaseToggle v-model="configStore.reduceAnimations" />
			</fieldset>
		</section>

		<section>
			<h2>Segurança</h2>
			
			<fieldset>
				<p>Alterar Senha</p>
				<BaseButton type="button" theme="accent" @click="openPasswordDialog">
					Alterar senha
				</BaseButton>
			</fieldset>
		</section>
	</article>

	<BaseDialog v-model:visible="passwordDialogVisible" title="Alterar senha">
		<form class="flex flex-col gap-3" @submit.prevent="changePassword">
			<label class="flex flex-col gap-1">
				<span>Senha atual</span>
				<BaseInput
					v-model="currentPassword"
					type="password"
					theme="light"
					placeholder="Senha atual"
					icon="lock_open"
					required
				/>
			</label>
			<label class="flex flex-col gap-1">
				<span>Nova senha</span>
				<BaseInput
					v-model="newPassword"
					type="password"
					theme="light"
					placeholder="Nova senha"
					icon="lock"
					required
				/>
			</label>
			<label class="flex flex-col gap-1">
				<span>Confirmar nova senha</span>
				<BaseInput
					v-model="confirmPassword"
					type="password"
					theme="light"
					placeholder="Confirmar nova senha"
					icon="lock"
					required
				/>
			</label>
			<BaseButton
				type="submit"
				theme="accent"
				class="justify-center mt-2"
				:state="passwordSubmitState"
			>
				Salvar nova senha
			</BaseButton>
		</form>
	</BaseDialog>
</template>

<style scoped>
@reference "@/assets/main.css";

article {
	@apply flex flex-col gap-4 text-textLight;
}

section {
	@apply flex flex-col gap-2;
}
section > h2 {
	@apply text-primaryLight font-medium mb-1 text-lg;
}

fieldset {
	@apply flex flex-row justify-between w-100 self-center items-center;
}
</style>