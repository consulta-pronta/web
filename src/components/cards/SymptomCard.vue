<script setup lang="ts">
import type Symptom from "@/database/symptom.model"
import { toCoolDate } from "@/utils"
import IntensityChip from "../IntensityChip.vue"

defineProps<{ symptom: Symptom }>()
</script>

<template>
	<article class="rounded-md p-3 bg-surface text-textDark">
		<p>
			<span class="material-symbols-rounded text-sm!"> calendar_month </span>
			{{ toCoolDate(symptom.date_time?.toDate()) }}
		</p>

		<p class="font-bold twoliner">
			{{ symptom.title ?? "Titulo" }}
		</p>

		<p class="italic twoliner h-[2lh]">
			{{ symptom.description ?? "Descrição AAAAAAAAAAAAAAAAAAAA" }}
		</p>

		<hr class="my-2" />

		<IntensityChip :intensity="symptom.intensity" class="opacity-90" />
	</article>
</template>

<style scoped>
@reference "@/assets/main.css";

.twoliner {
	@apply line-clamp-2 overflow-hidden text-ellipsis;
}
</style>
