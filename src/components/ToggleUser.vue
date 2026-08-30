<script setup lang="ts">
export type UserType = "paciente" | "profissional"

const status = defineModel<UserType>({ default: "paciente" })

const toggleStatus = (newStatus: UserType) => {
	status.value = newStatus
}
</script>

<template>
	<div class="flex flex-row bg-primaryDark p-1 gap-4 rounded-lg relative">
		<div
			class="boogieman absolute bg-accent z-0"
			:class="status === 'paciente' ? 'left-1' : 'left-[calc(100%-0.25rem-10rem)]'"
		></div>

		<button
			type="button"
			@click="toggleStatus('paciente')"
			class="boogieman"
			:class="status === 'paciente' ? 'active' : ''"
		>
			Paciente
		</button>

		<button
			type="button"
			@click="toggleStatus('profissional')"
			class="boogieman"
			:class="status === 'profissional' ? 'active' : ''"
		>
			Profissional
		</button>
	</div>
</template>

<style scoped>
@reference "@/assets/main.css";

button {
	@apply cursor-pointer z-1 text-accent;
}

.boogieman {
	@apply w-40 h-8 rounded-lg transition-all duration-300;
}

.active {
	@apply text-textDark cursor-default;
}
</style>
