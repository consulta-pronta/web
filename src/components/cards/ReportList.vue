<script setup lang="ts">
import ReportCard from "@/components/cards/ReportCard.vue"
import type Report from "@/database/report.model"

interface Props {
	reports: Report[]
}

defineProps<Props>()

const emit = defineEmits<{
	select: [report: Report]
}>()
</script>

<template>
	<ul class="w-full flex flex-col gap-2">
		<ReportCard
			v-for="report in reports"
			:key="report.id"
			:report="report"
			@select="emit('select', report)"
		/>

		<p
			v-if="!reports.length"
			class="text-center text-primaryDark py-10"
		>
			Este paciente não possui relatórios.
		</p>

	</ul>
</template>
