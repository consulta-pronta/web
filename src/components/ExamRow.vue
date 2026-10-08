<script setup lang="ts">
import Exam from "@/models/exam.model"
import { DATE_NOT_PROVIDED, toBrazilianLocaleDate } from "@/utils"
import { computed } from "vue"

const props = defineProps<{
	exam: Exam
}>()

const typeIcon = computed(() => {
	switch (props.exam.type) {
		case "hemograma":
			return "bloodtype"
		case "radiografia":
			return "radiology"
		case "urina":
			return "colorize"
		default:
			return "broken_image"
	}
})

const date = computed(() => {
	const date = props.exam.date?.toDate()
	if (!date) return DATE_NOT_PROVIDED

	return toBrazilianLocaleDate(date)
})

const status = computed(() => {
	switch (props.exam.status) {
		case "solicitado":
			return "Agendado"
		case "triagem":
			return "Em andamento"
		case "liberado":
			return "Resultado liberado"
		case "pendente":
			return "Ação pendente"
		default:
			return "Desconhecio"
	}
})
const statusIcon = computed(() => {
	switch (props.exam.status) {
		case "solicitado":
			return "pending"
		case "triagem":
			return "" //"schedule"
		case "liberado":
			return "check_circle"
		case "pendente":
			return "pending_actions"
		default:
			return "question_mark"
	}
})
</script>

<template>
	<tr>
		<td>
			<div class="flex gap-2">
				<span class="material-symbols-rounded select-none">
					{{ typeIcon }}
				</span>
				<p>{{ exam.name }}</p>
			</div>
		</td>
		<td>{{ exam.place }}</td>
		<td>{{ date }}</td>
		<td>
			<div class="flex gap-2">
				<p>{{ status }}</p>
				<span class="material-symbols-rounded select-none">
					{{ statusIcon }}
				</span>
			</div>
		</td>
	</tr>
</template>
