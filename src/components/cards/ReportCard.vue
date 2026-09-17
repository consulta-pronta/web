<script setup lang="ts">
import BaseButton from "@/components/bases/BaseButton.vue"

interface Report {
	id: string
	title: string
	startDate: string
	endDate: string
	description: string
}

interface Props {
	report: Report
}

defineProps<Props>()

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
				{{ report.startDate }}
			</p>

			<p class="oneliner text-sm">
				a {{ report.endDate }}
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
