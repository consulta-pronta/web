<script setup lang="ts">
import BaseButton from "@/components/bases/BaseButton.vue"
import type Report from "@/database/report.model"

interface Props {
	report: Report
}

defineProps<Props>()

function formatDate(date: Report["period_start"]) {
	return date?.toDate().toLocaleDateString("pt-BR") ?? "—"
}

const emit = defineEmits<{
	select: []
}>()
</script>

<template>
	<article class="w-full grid grid-cols-3 gap-3 border border-primaryDark rounded-xl p-2 px-4">

		<article class="flex w-full text-primaryDark items-center justify-center">

			<span class="material-symbols-rounded text-2xl!">
				description
			</span>

			<p class="text-base font-bold pl-2 oneliner">
				{{ report.title }}
			</p>

		</article>

		<article class="w-full flex items-center justify-center gap-1">

			<p class="oneliner text-sm">
				{{ formatDate(report.period_start) }}
			</p>

			<p class="oneliner text-sm">
				a {{ formatDate(report.period_end) }}
			</p>

		</article>

		<article class="flex justify-center">

			<BaseButton
				theme="primaryDark"
				mode="outline"
				type="button"
				class="rounded-4xl! border!"
				@click="emit('select')"
			>
				Visualizar
			</BaseButton>

		</article>

	</article>
</template>

<style scoped>
@reference "@/assets/main.css";

.oneliner {
	@apply whitespace-nowrap overflow-hidden text-ellipsis;
}
</style>
