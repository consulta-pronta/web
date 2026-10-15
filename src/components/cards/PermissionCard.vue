<script setup lang="ts">
import BaseButton from "@/components/bases/BaseButton.vue"
import Professional from "@/database/professional.model"
import { formatToPhone } from "brazilian-values"
import BaseDialog from "@/components/bases/BaseDialog.vue"
import { computed, useTemplateRef } from "vue"
import MedicalPermission from "@/database/medicalPermission.model"
import type {
	MedicalAccessStatus,
	MedicalPermissions,
} from "@/database/medicalPermission.model"
import FormMedicalPermission from "@/components/forms/FormMedicalPermission.vue"
import { computedAsync } from "@vueuse/core"
import { useAuthStore } from "@/stores/authStore"

const props = defineProps<{
	medicalPermission: MedicalPermission
}>()

const authStore = useAuthStore()

const managePermissionsVisible = useTemplateRef("managePermissionsDialog")

const permissions = computed(() => props.medicalPermission.permissions)
const professional = computedAsync(
	async () => await Professional.get(props.medicalPermission.id) as Professional,
	new Professional(),
)

const handlePermissionSubmit = async (updatedPermission: {
	status: MedicalAccessStatus
	permissions: MedicalPermissions
}) => {
	await authStore.onReady(async (data) => {
		MedicalPermission.update(
			props.medicalPermission.id,
			{
				status: updatedPermission.status,
				permissions: updatedPermission.permissions
			},
			{ scope: { patientId: data.id} }
		)
	})
	managePermissionsVisible.value?.hide()
}

const statusLabel = computed(() => {
	switch (props.medicalPermission.status) {
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
</script>

<template>
	<article class="bg-surface min-w-fit rounded-lg overflow-clip text-textDark">
		<div class="w-full bg-primaryLight flex justify-between items-center p-3 mb-2">
			{{ statusLabel }}
				<!-- <div class="material-symbols-rounded bg-surface p-0.5 rounded-lg h-fit shadow hover:-translate-0.5 duration-100 hover:brightness-95 cursor-pointer">
					more_horiz
				</div> -->
		</div>
		<section class="px-3 pb-3 flex flex-col gap-3">
			<header>
				<h1 class="text-lg font-medium">{{ professional.name }}</h1>
				<h2>{{ `${professional.professional_data?.crm}/${professional.professional_data?.uf}` }}</h2>
			</header>

			<div class="grid grid-cols-2 *:flex *:gap-2 [&_a]:hover:underline">
				<p>
					<i class="material-symbols-rounded">phone</i>
					Telefone:
				</p>
				<p>
					<a :href="'tel:+' + professional.phone">
						{{ formatToPhone(professional.phone) }}
					</a>
				</p>
				<p>
					<i class="material-symbols-rounded">email</i>
					Email:
				</p>
				<p>
					<a
						:href="'mailto:' + professional.email"
						class="wrap-anywhere"
					>
						{{ professional.email }}
					</a>
				</p>
				<p>
					<i class="material-symbols-rounded">home_health</i>
					Local de atuação:
				</p>
				<p>{{ professional.professional_data?.operation_area }}</p>
			</div>

			<p>{{ amountOfPermissionsLabel }} </p>

			<BaseButton mode="outline" @click="managePermissionsVisible?.toggle()">
				<i class="material-symbols-rounded text-primary text!">lock_open</i>
				Gerenciar permissões
			</BaseButton>
		</section>
	</article>
	

	<Teleport to="body">
		<BaseDialog ref="managePermissionsDialog" :title="'Permissões de ' + professional.name">
			<FormMedicalPermission
				:medical-permission="medicalPermission"
				@handled-submit="(updatedPermission) => handlePermissionSubmit(updatedPermission)"
			/>
		</BaseDialog>
	</Teleport>
</template>
