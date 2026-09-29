<script setup lang="ts">
interface Patient {
	name: string
	cpf: string
	photoUrl?: string
}

defineProps<{
	patients: Patient[]
}>()

const emit = defineEmits<{
	select: [patient: Patient]
}>()
</script>

<template>
	<li v-for="patient in patients" :key="patient.cpf">
		<button
			type="button"
			@click="emit('select', patient)"
			class="w-full flex rounded-md p-3 bg-textLight text-primaryDark items-center"
		>
			<UserPhoto />

			<section class="flex flex-col w-full text-start pl-6">
				<p class="font-bold text-2xl oneliner">
					{{ patient.name }}
				</p>

				<p class="oneliner text-base">
					CPF: {{ patient.cpf }}
				</p>
			</section>
		</button>
	</li>
</template>

<style scoped>
.oneliner {
	@apply whitespace-nowrap overflow-hidden text-ellipsis;
}
</style>
