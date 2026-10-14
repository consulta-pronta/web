<script setup lang="ts">
import BaseButton from "@/components/bases/BaseButton.vue"
import type Professional from "@/database/professional.model"
import { formatToPhone } from "brazilian-values"
import BaseDialog from "@/components/bases/BaseDialog.vue"
import { useTemplateRef } from "vue"
import MedicalPermission from "@/database/medicalPermission.model"
import type {
	MedicalAccessStatus,
	MedicalPermissions,
} from "@/database/medicalPermission.model"
import FormMedicalPermission from "@/components/forms/FormMedicalPermission.vue"

defineProps<{
	professional: Professional
}>()

const managePermissionsVisible = useTemplateRef("managePermissionsDialog")
const medicalPermission = new MedicalPermission("professional-id", "active", {
	read_records: true,
	prescribe_medications: false,
	request_exam: true,
	request_appointments: false,
})

const handlePermissionSubmit = (updatedPermission: {
	status: MedicalAccessStatus
	permissions: MedicalPermissions
}) => {
	medicalPermission.status = updatedPermission.status
	medicalPermission.permissions = updatedPermission.permissions
	managePermissionsVisible.value?.hide()
}
</script>

<template>
	<article class="bg-surface min-w-fit rounded-lg overflow-clip">
		<div class="w-full bg-primaryLight flex justify-between items-center p-3 mb-2">
			{{ "TODO TODO" }}
			<div class="material-symbols-rounded bg-surface p-0.5 rounded-lg h-fit shadow hover:-translate-0.5 duration-100 hover:brightness-95 cursor-pointer">
				more_horiz
			</div>
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
					<a :href="'mailto:' + professional.email">
						{{ professional.email }}
					</a>
				</p>
				<p>
					<i class="material-symbols-rounded">home_health</i>
					Local de atuação:
				</p>
				<p>{{ professional.professional_data?.operation_area }}</p>
			</div>

			<p>{{
				(true)
				? "Todas as permissões ativas"
				: `${4} permissões ativas`
			}} </p>

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
				@handled-submit="handlePermissionSubmit"
			/>
		</BaseDialog>
	</Teleport>
</template>
