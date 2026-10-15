<script setup lang="ts">
import BaseInput from '@/components/bases/BaseInput.vue'
import BaseSelect from '@/components/bases/BaseSelect.vue'
import BaseButton from '@/components/bases/BaseButton.vue'
import { useAuthStore } from '@/stores/authStore'
import { type ButtonState } from '@/components/bases/BaseButton.vue'
import { ref } from 'vue'
import User from '@/database/user.model'
import { formatToPhone } from 'brazilian-values'

interface Props {
	type?: "personal" | "contacts" | "health" | "professional"
}

const props = withDefaults(defineProps<Props>(), {
	type: "personal"
})

const authStore = useAuthStore()

const email = ref('')
const phone = ref('')
const buttonState = ref<ButtonState>("enabled")

const emit = defineEmits(["handled-submit"])

const submitForm = async () => {
	buttonState.value = "sync"

	await authStore.onReady(async (user) => {
		if (props.type === 'contacts') {
			await User.update(user.id, { email: email.value, phone: (phone.value.replace(/[\(\)\-\s]/g, "")) })
		}
	})

	emit("handled-submit")
	buttonState.value = "enabled"
}

const reset = async () => {
	await authStore.onReady(async (user) => {
		if (user instanceof User) {
			email.value = user.email
			phone.value = formatToPhone(user.phone)
		}
	})
}

defineExpose({ reset })

reset()
</script>

<template>
	<form v-if="type === 'personal'" @submit.prevent class="flex flex-col gap-4 z-48">
		<label>
			<p>Data de nascimento</p>
			<BaseInput
				type="date"
				theme="light"
				required
			/>
		</label>

		<label>
			<p>Endereço</p>
			<BaseInput
				type="text"
				placeholder="Digite seu endereço"
				theme="light"
				required
			/>
		</label>

		<label>
			<p>Gênero</p>
			<BaseSelect>

			</BaseSelect>
		</label>

		<BaseButton type="submit" theme="accent" class="m-auto px-10" :state="buttonState">
			Confirmar
		</BaseButton>
	</form>

	<form v-if="type === 'contacts'" @submit.prevent="submitForm()" class="flex flex-col gap-4 z-48">
		<label>
			<p>Telefone</p>
			<BaseInput
				type="tel"
				placeholder="Digite seu telefone"
				theme="light"
				v-model="phone"
				required
			/>
		</label>

		<label>
			<p>E-mail</p>
			<BaseInput
				type="email"
				placeholder="Digite seu endereço de e-mail"
				theme="light"
				v-model="email"
				required
			/>
		</label>

		<BaseButton type="submit" theme="accent" class="m-auto px-10" :state="buttonState">
			Confirmar
		</BaseButton>
	</form>

	<form v-if="type === 'health'" @submit.prevent class="flex flex-col gap-4 z-48">
		<label>
			<p>Peso</p>
			<BaseInput
				type="text"
				placeholder="Digite seu peso em quilogramas"
				theme="light"
				required
			/>
		</label>

		<label>
			<p>Altura</p>
			<BaseInput
				type="number"
				placeholder="Digite sua altura em centímetros"
				theme="light"
				required
			/>
		</label>

		<label>
			<p>Típo sanguíneo</p>
			<BaseSelect defaultValue="Selecione o tipo sanguíneo" required>
				<option>A</option>
				<option>B</option>
				<option>AB</option>
				<option>O</option>
			</BaseSelect>
		</label>

		<label>
			<p>Rh</p>
			<BaseSelect defaultValue="Selecione o Rh" required>
				<option>+</option>
				<option>-</option>
			</BaseSelect>
		</label>

		<BaseButton type="submit" theme="accent" class="m-auto px-10" :state="buttonState">
			Confirmar
		</BaseButton>
	</form>

	<form v-if="type === 'professional'" @submit.prevent class="flex flex-col gap-4 z-48">
		<label>
			<p>CRM</p>
			<BaseInput
				type="text"
				placeholder="Digite seu CRM"
				theme="light"
				required
			/>
		</label>

		<label>
			<p>Pediatria</p>
			<BaseInput
				type="text"
				placeholder="Digite sua pediatria"
				theme="light"
				required
			/>
		</label>

		<label>
			<p>Local</p>
			<BaseInput
				type="text"
				placeholder="Digite seu local de atendimento"
				theme="light"
				required
			/>
		</label>

		<BaseButton type="submit" theme="accent" class="m-auto px-10" :state="buttonState">
			Confirmar
		</BaseButton>
	</form>
</template>
