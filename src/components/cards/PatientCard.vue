<script setup lang="ts">
import type Patient from "@/database/patient.model"

defineProps<{
	patient: Patient
}>()

const emit = defineEmits<{
	selected: [patient: Patient]
}>()
</script>

<template>
	<button
		type="button"
		@click="emit('selected', patient)"
		class="w-full flex rounded-md p-3 bg-surface text-primaryDark items-center hover:brightness-95 cursor-pointer"
	>
		<section class="flex flex-col w-full text-start pl-6">
			<p class="font-medium text-2xl oneliner">
				{{ patient.name }}
			</p>

			<p class="oneliner text-sm">CPF: {{ patient.cpf }}</p>
		</section>
	</button>
</template>

<style scoped>
.oneliner {
	@apply whitespace-nowrap overflow-hidden text-ellipsis;
}
</style>
