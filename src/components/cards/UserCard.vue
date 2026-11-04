<script setup lang="ts">
import type { Symptom } from "@/services/symptomService"

interface Props {
	symptom: Symptom
	theme: "dark" | "light"
}
const props = withDefaults(defineProps<Props>(), {
	theme: "light",
})

const colors =
	props.theme === "light" ? { bg: "surface", text: "red" } : { bg: "primary", text: "textLight" }

const ranges = [
	{ min: 0, max: 4, color: "green" },
	{ min: 5, max: 7, color: "orange" },
	{ min: 8, max: 10, color: "red" },
]
const intensityColor = ranges.find((r) => {
	return props.symptom.intensity >= r.min && props.symptom.intensity <= r.max
})?.color
</script>

<template>
	<article class="rounded-md p-3" :class="`bg-${colors.bg} *:text-${colors.text}!`">
		<div class="flex items-center gap-3">
			<!-- "Avatar" circular no lugar da foto -->
			<div
				class="flex items-center justify-center w-12 h-12 rounded-full shrink-0"
				:style="{ backgroundColor: `color-mix(in srgb, ${intensityColor}, transparent)` }"
			>
				<span class="material-symbols-rounded text-xl!"> vital_signs </span>
			</div>

			<div class="min-w-0 flex-1">
				<p class="font-bold oneliner">
					{{ symptom.title ?? "Titulo" }}
				</p>
				<p class="oneliner text-sm opacity-80">
					Intensidade: {{ symptom.intensity ?? 0 }}/10
				</p>
			</div>
		</div>

		<hr class="my-2" />

		<p class="oneliner">
			<span class="material-symbols-rounded text-sm!"> calendar_month </span>
			{{ symptom?.date_time.toDate().toDateString() ?? "00/00/0000" }}
		</p>

		<p class="italic oneliner">
			{{ symptom.description ?? "Descrição AAAAAAAAAAAAAAAAAAAA" }}
		</p>

		<!-- <p class="py-1 px-2 bg-accent w-fit rounded-md">
			<span class="material-symbols-rounded text-sm!">
				location_on
			</span>
			{{ symptom?.place ?? "Local" }}
		</p> -->
	</article>
</template>

<style scoped>
@reference "@/assets/main.css";

.oneliner {
	@apply whitespace-nowrap overflow-hidden text-ellipsis;
}
</style>
