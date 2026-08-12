<script setup lang="ts">
const status = defineModel<string>()

const toggleStatus = (newStatus: string) => {
	status.value = newStatus
}
</script>

<template>
	<div class="flex flex-row bg-primarydark p-1 rounded-lg">
		<button
			type="button"
			@click="toggleStatus('paciente')"
			:class="
				status === 'paciente' ? 'bg-accent text-primarydark' : 'bg-primarydark text-accent'
			"
			class="w-42.25 h-8.5 rounded-lg flex items-center justify-center"
		>
			Paciente
		</button>

		<button
			type="button"
			@click="toggleStatus('profissional')"
			:class="
				status === 'profissional'
					? 'bg-accent text-primarydark'
					: 'bg-primarydark text-accent'
			"
			class="w-42.25 h-8.5 rounded-lg flex items-center justify-center"
		>
			Profissional
		</button>
	</div>
</template>
