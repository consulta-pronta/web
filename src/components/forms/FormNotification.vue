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
import NotificationCard from "@/components/cards/NotificationCard.vue"
import { useToast } from 'vue-toastification'

interface Props {
	type?: "personal" | "contacts" | "health" | "professional" | "name"
}

const props = withDefaults(defineProps<Props>(), {
	type: "personal"
})

const authStore = useAuthStore()
const toast = useToast()

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

	try {
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
		toast.success("Dados atualizados com sucesso.")
		emit("handled-submit")
	} catch (error) {
		console.error("Failed to update profile.", error)
		toast.error("Não foi possível atualizar os dados.")
	} finally {
		buttonState.value = "enabled"
	}
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
    <form  class="flex flex-col gap-4 z-48 max-h-[75vh] min-h-0">
        <section>
            <div class="flex flex-row gap-2 justify-center">
                <BaseInput
                    placeholder="Pesquisar"
                    icon="search"
                    class="place-self-center w-full md:w-70"
                />
                <BaseButton icon="replay" />
                <BaseButton icon="drafts" />
            </div>
        </section>
        <section class="flex flex-col gap-4 flex-1 min-h-0 overflow-y-auto pr-2 scrollbar-hide">
            <NotificationCard />
            <NotificationCard />
            <NotificationCard />
            <NotificationCard />
            <NotificationCard />
            <NotificationCard />
        </section>
    </form>
</template>
