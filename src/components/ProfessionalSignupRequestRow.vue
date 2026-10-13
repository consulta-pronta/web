<script setup lang="ts">
import BaseButton from "@/components/bases/BaseButton.vue"
import type Professional from "@/database/professional.model"
import { formatToCPF } from "brazilian-values"

defineProps<{
	request: Professional
}>()

const emit = defineEmits<{
	approve: [id: string]
}>()
</script>

<template>
	<tr class="bg-surface border-b hover:brightness-90">
		<td>{{ request.name }}</td>
		<td>{{ request.email }}</td>
		<td>{{ formatToCPF(request.cpf) }}</td>
		<td>{{ request.professional_data?.crm }}/{{ request.professional_data?.uf }}</td>
		<td>{{ request.professional_data?.operation_area }}</td>
		<td class="flex flex-row gap-3 *:w-full">
			<BaseButton theme="primary" @click="emit('approve', request.id)">Aprovar</BaseButton>
		</td>
	</tr>
</template>
