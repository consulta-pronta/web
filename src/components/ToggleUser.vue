<script setup lang="ts">
import type { UserType } from "@/utils"

const status = defineModel<UserType>({ default: "patient" })

const toggleStatus = (newStatus: UserType) => {
	status.value = newStatus
}
</script>

<template>
	<div class="flex flex-row bg-primaryDark p-1 gap-4 rounded-lg relative">
		<div
			class="boogieman absolute bg-accent z-0"
			:class="status === 'patient' ? 'left-1' : 'left-[calc(100%-0.25rem-10rem)]'"
		></div>

		<button
			type="button"
			@click="toggleStatus('patient')"
			class="boogieman"
			:class="status === 'patient' ? 'active' : ''"
		>
			Paciente
		</button>

		<button
			type="button"
			@click="toggleStatus('professional')"
			class="boogieman"
			:class="status === 'professional' ? 'active' : ''"
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
