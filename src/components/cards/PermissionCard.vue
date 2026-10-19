<script setup lang="ts">
import BaseButton from "@/components/bases/BaseButton.vue"
import Professional from "@/database/professional.model"
import Patient from "@/database/patient.model"
import { formatToCPF, formatToPhone } from "brazilian-values"
import BaseDialog from "@/components/bases/BaseDialog.vue"
import { computed, ref, useTemplateRef } from "vue"
import MedicalPermission from "@/database/medicalPermission.model"
import type {
	MedicalAccessStatus,
	MedicalPermissions,
} from "@/database/medicalPermission.model"
import FormMedicalPermission from "@/components/forms/FormMedicalPermission.vue"
import { useAuthStore } from "@/stores/authStore"

const props = defineProps<{
	medicalPermission: MedicalPermission
}>()

const authStore = useAuthStore()

const managePermissionsVisible = useTemplateRef("managePermissionsDialog")

const status = ref(props.medicalPermission.status)
const permissions = ref(props.medicalPermission.permissions)

const user = ref<Patient | Professional | null>(null)

const updatePermissions = async (updatedPermission: {
	status: MedicalAccessStatus
	permissions: MedicalPermissions
}) => {
	status.value = updatedPermission.status
	permissions.value = updatedPermission.permissions

	const data = props.medicalPermission.status === "pending"
		? { permissions: permissions.value }
		: { status: status.value, permissions: permissions.value }
	await authStore.onReady(async (user) => {
		await MedicalPermission.update(
			props.medicalPermission.id,
			data,
			{ scope: { patientId: props.medicalPermission.patient_id || user.id } },
		)
	})
	managePermissionsVisible.value?.hide()
}

const acceptRequest = async () => {
	try {
		await props.medicalPermission.acceptRequest()
		status.value = "active"
	} catch (error) {
		console.error("Failed to accept medical permission request.", error)
	}
}

const headHeaderStyle = computed(() => {
	switch (status.value) {
		case "pending":
			return "bg-gray-300"
		case "active":
			return "bg-sucess/70"
		case "revoked":
			return "bg-error/70"
		default:
			return "bg-black/70 text-textLight"
	}
})
const subtitleLabel = computed(() => {
	if (user.value instanceof Patient) {
		return formatToCPF(user.value.cpf)
	}
	if (user.value instanceof Professional) {
		return user.value.getFormattedCRM()
	}

	return "error!"
})
const statusLabel = computed(() => {
	switch (status.value) {
		case "pending":
			return "Solicitação pendente"
		case "active":
			return "Permissões ativas"
		case "revoked":
			return "Permissões revogadas"
		default:
			return "Permissões desconhecidas"
	}
})
const amountOfPermissionsLabel = computed(() => {
	const omgSoTrue = Object.values(permissions.value).filter((item) => item)
	// not harcoding would be cool
	return (omgSoTrue.length === 3)
		? "Todas as permissões ativas"
		: `${omgSoTrue.length} permissões ativas`
})

authStore.onReady(async (data) => {
	user.value = await (
		data.user_type === "patient"
		? Professional.get(props.medicalPermission.id)
		: Patient.get(props.medicalPermission.patient_id)
	)
})
</script>

<template>
	<article class="bg-surface min-w-fit rounded-lg overflow-clip text-textDark">
		<div
			class="w-full flex justify-between items-center p-3 mb-2"
			:class="headHeaderStyle"
		>
			{{ statusLabel }}
			<BaseButton
				v-if="user instanceof Patient && status === 'pending'"
				theme="primary"
				icon="check"
				class="px-3"
				@click="acceptRequest"
			>
				Aceitar
			</BaseButton>
		</div>
		<section class="px-3 pb-3 flex flex-col gap-3">
			<header>
				<h1 class="text-lg font-medium">{{ user?.name }}</h1>
				<h2>{{ subtitleLabel }}</h2>
			</header>

			<div class="grid grid-cols-2 *:flex *:gap-2 [&_a]:hover:underline">
				<p>
					<i class="material-symbols-rounded">phone</i>
					Telefone:
				</p>
				<p>
					<a :href="'tel:+' + user?.phone">
						{{ user?.phone ? formatToPhone(user.phone) : "" }}
					</a>
				</p>
				<p>
					<i class="material-symbols-rounded">email</i>
					Email:
				</p>
				<p>
					<a
						:href="'mailto:' + user?.email"
						class="wrap-anywhere"
					>
						{{ user?.email }}
					</a>
				</p>
				<template v-if="user instanceof Professional || false">
					<p>
						<i class="material-symbols-rounded">home_health</i>
						Local de atuação:
					</p>
					<p>{{ user.professional_data?.operation_area }}</p>
				</template>
			</div>

			<p>{{ amountOfPermissionsLabel }} </p>

			<BaseButton
				v-if="user instanceof Patient || false"
				mode="outline"
				@click="managePermissionsVisible?.toggle()"
			>
				<i class="material-symbols-rounded text-primary text!">lock_open</i>
				Visualizar permissões
			</BaseButton>
			<BaseButton
				v-else
				mode="outline"
				@click="managePermissionsVisible?.toggle()"
			>
				<i class="material-symbols-rounded text-primary text!">lock_open</i>
				Gerenciar permissões
			</BaseButton>
		</section>
	</article>
	

	<Teleport to="body">
		<BaseDialog ref="managePermissionsDialog" :title="'Permissões de ' + user?.name">
			<FormMedicalPermission
				:medical-permission="medicalPermission"
				@handled-submit="updatePermissions"
			/>
		</BaseDialog>
	</Teleport>
</template>
