<script setup lang="ts">
import { ref } from "vue"

export interface FilterOption {
	value: string
	label: string
}

interface BaseFilterProps {
	options: FilterOption[]
	label?: string
}

const props = withDefaults(
	defineProps<BaseFilterProps>(),
	{ label: "Filtrar" },
)

const isOpen = ref(false)

const selectedValue = defineModel<string | null>({ default: null })
</script>

<template>
	<section class="relative">
		<button
			type="button"
			class="flex items-center text-accent"
			:aria-expanded="isOpen"
			@click="isOpen = !isOpen"
		>
			<span class="material-symbols-rounded text-2xl mr-1">filter_alt</span>
			<span>{{ label }}</span>
			<span class="material-symbols-rounded text-2xl ml-1">
				{{ isOpen ? "keyboard_arrow_up" : "keyboard_arrow_down" }}
			</span>
		</button>

		<div v-if="isOpen" class="mt-2 flex h-fit flex-wrap gap-2">
			<button
				type="button"
				:aria-pressed="selectedValue === null"
				:class="[
					'rounded-4xl px-3 py-1',
					selectedValue === null ? 'bg-accent text-textDark' : 'bg-primary text-textLight',
				]"
				@click="selectedValue = null"
			>
				Todos
			</button>
			<button
				v-for="option in props.options"
				:key="option.value"
				type="button"
				:aria-pressed="selectedValue === option.value"
				:class="[
					'rounded-4xl px-3 py-1',
					selectedValue === option.value
						? 'bg-accent text-textDark'
						: 'bg-primary text-textLight',
				]"
				@click="selectedValue = option.value"
			>
				{{ option.label }}
			</button>
		</div>
	</section>
</template>
