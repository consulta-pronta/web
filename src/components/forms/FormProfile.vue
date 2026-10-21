<script setup lang="ts">
import BaseInput from '@/components/bases/BaseInput.vue'
import BaseSelect from '@/components/bases/BaseSelect.vue'
import BaseButton from '@/components/bases/BaseButton.vue'
import { useAuthStore } from '@/stores/authStore'
import { type ButtonState } from '@/components/bases/BaseButton.vue'
import { ref } from 'vue'
import User from '@/database/user.model'
import { formatToPhone } from 'brazilian-values'
import { bloodTypes } from '@/utils'
import Patient from '@/database/patient.model'

interface Props {
	type?: "personal" | "contacts" | "health" | "professional"
}

const props = withDefaults(defineProps<Props>(), {
	type: "personal"
})

const authStore = useAuthStore()

const email = ref('')
const phone = ref('')
const height = ref('')
const weight = ref('')
const blood_type = ref('')
const buttonState = ref<ButtonState>("enabled")

const emit = defineEmits(["handled-submit"])

const submitForm = async () => {
	buttonState.value = "sync"

	await authStore.onReady(async (user) => {
		if (props.type === 'contacts') {
			await User.update(user.id, { email: email.value, phone: (phone.value.replace(/[\(\)\-\s]/g, "")) })
		} else if (props.type === 'health') {
			await Patient.update(user.id, { patient_data: { blood_type: blood_type.value, height: height.value, weight: weight.value } })
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
		if (user instanceof Patient) {
			blood_type.value = user.patient_data?.blood_type ? user.patient_data.blood_type : ''
			height.value = user.patient_data?.height ? user.patient_data.height.toString() : ''
			weight.value = user.patient_data?.weight ? user.patient_data.weight.toString() : ''
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

	<form v-if="type === 'health'" @submit.prevent="submitForm()" class="flex flex-col gap-4 z-48">
		<label>
			<p>Peso</p>
			<BaseInput
				type="text"
				placeholder="Peso em quilogramas"
				theme="light"
				v-model="weight"
				required
			/>
		</label>

		<label>
			<p>Altura</p>
			<BaseInput
				type="text"
				placeholder="Altura em centímetros"
				theme="light"
				v-model="height"
				required
			/>
		</label>

		<label>
			<p>Típo sanguíneo</p>
			<BaseSelect
				default-value="Tipo Sanguíneo"
				icon="bloodtype"
				theme="light"
				v-model="blood_type"
				required
			>
				<template v-for="tipo in bloodTypes" :key="tipo">
					<option :value="tipo">{{ tipo }}</option>
				</template>
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
