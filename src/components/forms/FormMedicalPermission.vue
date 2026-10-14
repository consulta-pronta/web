<script setup lang="ts">
import BaseButton from "@/components/bases/BaseButton.vue"
import { ref } from "vue"
import type MedicalPermission from "@/database/medicalPermission.model"
import type {
	MedicalAccessStatus,
	MedicalPermissions,
} from "@/database/medicalPermission.model"

const props = defineProps<{
	medicalPermission: MedicalPermission
}>()

const emit = defineEmits<{
	"handled-submit": [permission: { status: MedicalAccessStatus; permissions: MedicalPermissions }]
}>()

const permission = ref({
	status: props.medicalPermission.status,
	permissions: { ...props.medicalPermission.permissions },
})

const submitForm = () => {
	emit("handled-submit", {
		status: permission.value.status,
		permissions: { ...permission.value.permissions },
	})
}
</script>

<template>
	<form class="flex flex-col gap-4" @submit.prevent="submitForm">
		<label class="flex flex-col gap-1 text-textLight">
			<span class="font-medium">Status do acesso</span>
			<select
				v-model="permission.status"
				class="rounded-md bg-surface px-3 py-2 text-textDark outline-none focus:ring-2 focus:ring-accent"
			>
				<option value="active">Ativo</option>
				<option value="revoked">Revogado</option>
			</select>
		</label>

		<fieldset class="flex flex-col gap-3">
			<legend class="mb-2 font-medium text-textLight">Permissões</legend>

			<!-- NO USE YET
			<label class="flex cursor-pointer items-start gap-3 rounded-md bg-surface p-3 text-textDark">
				<input
					v-model="permission.permissions.read_records"
					type="checkbox"
					class="mt-1 accent-primary"
				/>
				<span>
					<span class="block font-medium">Ler prontuário</span>
					<span class="block text-sm">
						Acesso aos dados do prontuário, sem incluir sintomas detalhados.
					</span>
				</span>
			</label> -->

			<label class="flex cursor-pointer items-center gap-3 rounded-md bg-surface p-3 text-textDark">
				<input
					v-model="permission.permissions.prescribe_medications"
					type="checkbox"
					class="accent-primary"
				/>
				<span>Prescrever medicamentos</span>
			</label>

			<label class="flex cursor-pointer items-center gap-3 rounded-md bg-surface p-3 text-textDark">
				<input
					v-model="permission.permissions.request_exam"
					type="checkbox"
					class="accent-primary"
				/>
				<span>Solicitar exames</span>
			</label>

			<label class="flex cursor-pointer items-center gap-3 rounded-md bg-surface p-3 text-textDark">
				<input
					v-model="permission.permissions.request_appointments"
					type="checkbox"
					class="accent-primary"
				/>
				<span>Solicitar consultas</span>
			</label>
		</fieldset>

		<BaseButton type="submit" theme="accent">
			<i class="material-symbols-rounded text-textDark text!">save</i>
			Confirmar alterações
		</BaseButton>
	</form>
</template>
