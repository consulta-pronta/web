<script setup lang="ts">
import type { SortDirection } from "@/utils";
import { ref } from "vue"

export interface SortOption {
	value: string
	label: string
}

interface BaseSortProps {
	options: SortOption[]
	label?: string
}

const props = withDefaults(
	defineProps<BaseSortProps>(),
	{ label: "Ordenar" },
)

const selectedValue = defineModel<string>({ required: true })
const direction = defineModel<SortDirection>("direction", { default: "desc" })
const isOpen = ref(false)

const selectOption = (value: string) => {
	if (value !== selectedValue.value) {
		selectedValue.value = value
		direction.value = "desc"
	}
}
</script>

<template>
	<section class="relative">
		<div class="flex items-center">
			<button
				type="button"
				class="flex items-center text-accent"
				:aria-expanded="isOpen"
				@click="isOpen = !isOpen"
			>
				<span class="material-symbols-rounded text-2xl mr-1">bar_chart</span>
				<span>{{ label }}</span>
				<span class="material-symbols-rounded text-2xl ml-1">
					{{ isOpen ? "keyboard_arrow_up" : "keyboard_arrow_down" }}
				</span>
			</button>
			<button
				type="button"
				class="material-symbols-rounded ml-1 text-accent"
				:aria-label="direction === 'desc' ? 'Ordem decrescente' : 'Ordem crescente'"
				@click="direction = direction === 'desc' ? 'asc' : 'desc'"
			>
				{{ direction === "desc" ? "arrow_downward" : "arrow_upward" }}
			</button>
		</div>

		<div v-if="isOpen" class="mt-2 flex h-fit flex-wrap gap-2">
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
				@click="selectOption(option.value)"
			>
				{{ option.label }}
			</button>
		</div>
	</section>
</template>
