<script setup lang="ts">
import { ref } from "vue";

interface IntensityChipProps {
	intensity: number,
	customMessage?: string
}

const props = defineProps<IntensityChipProps>()

const ranges = [
	{ min: 0, max: 4, bgColor: "sucess" },
	{ min: 5, max: 7, bgColor: "warning" },
	{ min: 8, max: 10, bgColor: "error" },
]
const current = ref(ranges.find((r) => {
	return props.intensity >= r.min && props.intensity <= r.max
}))
const backgroundColor = "var(--color-" + current.value?.bgColor + ")"

</script>

<template>
	<article class="flex gap-1 px-2 py-1 rounded-xl w-fit items-center text-sm text-textDark">
		<span class="material-symbols-rounded text-base! mr-1 select-none"> vital_signs </span>
		<p class="flex justify-center items-center">
			{{ customMessage || "Intensidade:" }}
		</p>
		<p>{{ props.intensity }}/10</p>
	</article>
</template>

<style scoped>
@reference "@/assets/main.css";

article	{
	background-color: v-bind(backgroundColor);
}
</style>
