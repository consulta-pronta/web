<script setup lang="ts">
import BaseInput from '@/components/bases/BaseInput.vue'
import BaseSelect from '@/components/bases/BaseSelect.vue'
import BaseButton from '@/components/bases/BaseButton.vue'
import { useAuthStore } from '@/stores/authStore'
import { type ButtonState } from '@/components/bases/BaseButton.vue'
import { ref } from 'vue'
import User from '@/database/user.model'
import { formatToPhone } from 'brazilian-values'
import { bloodTypes, genderTypes, federalUnits } from '@/utils'
import Patient from '@/database/patient.model'
import Professional from '@/database/professional.model'

interface Props {
	type?: "personal" | "contacts" | "health" | "professional" | "name"
}

const props = withDefaults(defineProps<Props>(), {
	type: "personal"
})

const authStore = useAuthStore()

const name = ref('')
const social_name = ref('')
const birth_date = ref('')
const address = ref('')
const email = ref('')
const phone = ref('')
const height = ref('')
const weight = ref('')
const gender = ref('')
const blood_type = ref('')
const crm = ref('')
const uf = ref('')
const specialty = ref('')
const operation_area = ref('')
const buttonState = ref<ButtonState>("enabled")

const emit = defineEmits(["handled-submit"])

const submitForm = async () => {
	buttonState.value = "sync"

	await authStore.onReady(async (user) => {
		if (props.type === 'contacts') {
			await User.update(user.id, { email: email.value, phone: (phone.value.replace(/[\(\)\-\s]/g, "")) })
		} else if (props.type === 'health') {
			await Patient.update(user.id, { patient_data: { blood_type: blood_type.value, height: height.value, weight: weight.value } })
		} else if (props.type === 'personal') {
			await User.update(user.id, { birth_date: birth_date.value, address: address.value, gender: gender.value })
		} else if (props.type === 'name') {
			await User.update(user.id, { name: name.value, social_name: social_name.value })
		} else if (props.type === 'professional') {
			await Professional.update(user.id, { professional_data: { crm: crm.value, uf: uf.value, specialty: specialty.value, operation_area: operation_area.value } })
		}
	})

	emit("handled-submit")
	buttonState.value = "enabled"
}

const reset = async () => {
	await authStore.onReady(async (user) => {
		if (user instanceof User) {
			name.value = user.name
			social_name.value = user.social_name
			birth_date.value = user.birth_date
			address.value = user.address
			email.value = user.email
			phone.value = formatToPhone(user.phone)
			gender.value = user.gender
		}
		if (user instanceof Patient) {
			blood_type.value = user.patient_data?.blood_type ? user.patient_data.blood_type : ''
			height.value = user.patient_data?.height ? user.patient_data.height.toString() : ''
			weight.value = user.patient_data?.weight ? user.patient_data.weight.toString() : ''
		}
		if (user instanceof Professional) {
			crm.value = user.professional_data?.crm ? user.professional_data.crm : ''
			uf.value = user.professional_data?.uf ? user.professional_data.uf : ''
			specialty.value = user.professional_data?.specialty ? user.professional_data.specialty : ''
			operation_area.value = user.professional_data?.operation_area ? user.professional_data.operation_area : ''
		}
	})
}

defineExpose({ reset })

reset()
</script>

<template>
	<form v-if="type === 'personal'" @submit.prevent="submitForm()" class="flex flex-col gap-4 z-48">
		<label>
			<p>Data de nascimento</p>
			<BaseInput
				type="date"
				theme="light"
				v-model="birth_date"
				required
			/>
		</label>

		<label>
			<p>Endereço</p>
			<BaseInput
				type="text"
				placeholder="Digite seu endereço"
				theme="light"
				v-model="address"
				required
			/>
		</label>

		<label>
			<p>Gênero</p>
			<BaseSelect
				default-value="Identidade de gênero"
				icon="transgender"
				v-model="gender"
			>
				<template v-for="tipo in genderTypes" :key="tipo">
					<option :value="tipo">{{ tipo }}</option>
				</template>
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

	<form v-if="type === 'professional'" @submit.prevent="submitForm()" class="flex flex-col gap-4 z-48">
		<label class="w-full flex flex-row gap-3">
			<div class="w-full">
				<p>CRM</p>
				<BaseInput
					type="text"
					placeholder="Digite seu CRM"
					v-model="crm"
					theme="light"
					required
				/>
			</div>
			<div>
				<p>UF</p>
				<BaseSelect
					default-value="UF"
					required
					class="w-20"
					v-model="uf"
				>
					<template v-for="federalUnit in federalUnits" :key="federalUnit">
						<option :value="federalUnit">{{ federalUnit }}</option>
					</template>
				</BaseSelect>
			</div>
		</label>

		<label>
			<p>Pediatria</p>
			<BaseInput
				type="text"
				placeholder="Digite sua pediatria"
				v-model="specialty"
				theme="light"
				required
			/>
		</label>

		<label>
			<p>Local</p>
			<BaseInput
				type="text"
				placeholder="Digite seu local de atendimento"
				v-model="operation_area"
				theme="light"
				required
			/>
		</label>

		<BaseButton type="submit" theme="accent" class="m-auto px-10" :state="buttonState">
			Confirmar
		</BaseButton>
	</form>

	<form v-if="type === 'name'" @submit.prevent="submitForm()" class="flex flex-col gap-4 z-48">
		<label>
			<p>Nome</p>
			<BaseInput
				type="text"
				placeholder="Digite seu nome"
				v-model="name"
				theme="light"
				required
			/>
		</label>

		<label>
			<p>Nome Social (opcional)</p>
			<BaseInput
				type="text"
				placeholder="Digite seu nome social"
				v-model="social_name"
				theme="light"
			/>
		</label>

		<BaseButton type="submit" theme="accent" class="m-auto px-10" :state="buttonState">
			Confirmar
		</BaseButton>
	</form>
</template>
