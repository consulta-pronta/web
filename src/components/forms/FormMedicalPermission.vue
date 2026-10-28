<script setup lang="ts">
import BaseButton from "@/components/bases/BaseButton.vue"
import { computed, ref } from "vue"
import type MedicalPermission from "@/database/medicalPermission.model"
import type {
	MedicalAccessStatus,
	MedicalPermissions,
} from "@/database/medicalPermission.model"
import BaseSwitch from "../bases/BaseSwitch.vue";
import BaseCardCheck from "../bases/BaseCardCheck.vue";

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

const isSwitchDisabled = computed(() => permission.value.status === "pending")

const submitForm = () => {
	const permissions = { ...permission.value.permissions }
	const thing = props.medicalPermission.isPending()
		? { status: <MedicalAccessStatus>"pending", permissions }
		: { status: permission.value.status, permissions }
	
	emit("handled-submit", thing)
	permission.value = thing
}
</script>

<template>
	<form class="flex flex-col gap-4" @submit.prevent="submitForm">
		<label class="flex flex-col gap-1 text-textLight">
			<span class="font-medium">Status do acesso</span>
			<BaseSwitch
				label1="Ativo"
				label2="Revogado"
				:value1="<MedicalAccessStatus>'active'"
				:value2="<MedicalAccessStatus>'revoked'"
				:disabled="isSwitchDisabled"
				v-model="permission.status"
				class="m-auto"
			/>
			<p class="m-auto text-error" v-if="isSwitchDisabled">
				Status pendente, não há como mudar o acesso
			</p>
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

			<BaseCardCheck v-model="permission.permissions.prescribe_medications">
				Prescrever medicamentos
			</BaseCardCheck>

			<BaseCardCheck v-model="permission.permissions.request_exam">
				Solicitar exames
			</BaseCardCheck>

			<BaseCardCheck v-model="permission.permissions.request_appointments">
				Solicitar consultas
			</BaseCardCheck>
		</fieldset>

		<BaseButton type="submit" theme="accent">
			<i class="material-symbols-rounded text-textDark text!">save</i>
			Confirmar alterações
		</BaseButton>
	</form>
</template>
