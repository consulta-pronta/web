<script setup lang="ts">
import { formatToNumber } from "brazilian-values"
import { computed } from "vue"

interface IntensityChipProps {
	intensity: number
	customMessage?: string
}

const props = defineProps<IntensityChipProps>()

const ranges = [
	{ min: 0, max: 4, bgColor: "sucess", color: "Dark" },
	{ min: 5, max: 7, bgColor: "warning", color: "Dark" },
	{ min: 8, max: 10, bgColor: "error", color: "Light" },
]
const current = computed(() =>
	ranges.find((r) => {
		return props.intensity >= r.min && props.intensity <= r.max
	}),
)
const backgroundColor = computed(() => "var(--color-" + current.value?.bgColor + ")")
const textColor = computed(() => "var(--color-text" + current.value?.color + ")")
</script>

<template>
	<article class="flex gap-1 px-2 py-1 rounded-xl w-fit items-center text-sm text-textDark">
		<span class="material-symbols-rounded text-base! mr-1 select-none"> vital_signs </span>
		<p class="flex justify-center items-center">
			{{ customMessage || "Intensidade:" }}
		</p>
		<p>{{ formatToNumber(props.intensity.toFixed(2)) }}/10</p>
	</article>
</template>

<style scoped>
@reference "@/assets/main.css";

article {
	background-color: v-bind(backgroundColor);
	color: v-bind(textColor);
}
</style>
