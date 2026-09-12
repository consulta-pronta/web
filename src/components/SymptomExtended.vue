<script setup lang="ts">
import type { Symptom } from "@/models/symptomModel"
import { watch } from "vue"

const symptom = defineModel<Symptom | null>()

let list: Symptom[] = []
watch(symptom, (value) => {
	if (value) {
		list = [value]
		if (value.historic) {
			list = list.concat(value.historic)
		}
	} else {
		list = []
	}
})
</script>

<template>
	<ul v-if="symptom" class="flex flex-col gap-4">
		<article
			v-for="symptom in list"
			:key="symptom.id"
			class="bg-surface text-textDark p-3 rounded-xl"
		>
			<details class="relative">
				<summary class="list-none cursor-help">
					<h2 class="text-xl font-bold">{{ symptom.title }}</h2>
				</summary>

				<section class="text-sm italic text-right">
					<p>ID: {{ symptom.id }}</p>
					<p>Registrado em: {{ symptom.created_at.toDate().toLocaleString() }}</p>
				</section>
			</details>

			<p class="flex items-center text mt-1">
				<span class="material-symbols-rounded text-base!"> calendar_month </span>
				{{ symptom?.date_time.toDate().toDateString() ?? "00/00/0000" }}
			</p>

			<hr class="mx-8 my-2" />
			<p class="italic">{{ symptom.description }}</p>
			<p>Local: {{ symptom.place }}</p>
			<p>Intensidade: {{ symptom.intensity }}/10</p>
		</article>
	</ul>
</template>
