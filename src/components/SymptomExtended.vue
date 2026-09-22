<script setup lang="ts">
import type { Symptom } from "@/models/symptomModel"
import { getSymptom } from "@/services/symptomService"
import { useAuthStore } from "@/stores/authStore"
import { ref, watch } from "vue"

const symptomId = defineModel<string>()
const isFetching = defineModel<boolean>("isFetching")

const authStore = useAuthStore()

const list = ref<Symptom[]>()

watch(symptomId, async (value) => {
	list.value = []

	if (!value) {
		return
	}

	isFetching.value = true

	const symptom = await getSymptom(authStore.user!.uid, value)
	list.value = [symptom]
	if (symptom.historic) {
		list.value = list.value.concat(symptom.historic)
	}

	isFetching.value = false
})
</script>

<template>
	<ul
		v-if="symptomId"
		class="flex flex-col gap-4"
		:class="isFetching ? 'h-full justify-center items-center' : ''"
	>
		<span v-if="isFetching" class="material-symbols-rounded animate-spin text-accent w-fit">
			sync
		</span>
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
