<script setup lang="ts">
import MedicalPermission from "@/database/medicalPermission.model";
import BaseCardCheck from "./bases/BaseCardCheck.vue";

defineProps<{
	permission: MedicalPermission
}>()
</script>

<template>
	<article class="flex flex-col gap-3">
		<legend class="mb-2 font-medium text-textLight">Permissões</legend>

		<BaseCardCheck
			:default="permission.permissions.prescribe_medications"
			disabled
		>
			Prescrever medicamentos
		</BaseCardCheck>

		<BaseCardCheck
			:default="permission.permissions.request_exam"
			disabled
		>
			Solicitar exames
		</BaseCardCheck>

		<BaseCardCheck
			:default="permission.permissions.request_appointments"
			disabled
		>
			Solicitar consultas
		</BaseCardCheck>
	</article>
</template>