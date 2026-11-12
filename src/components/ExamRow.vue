<script setup lang="ts">
import Exam from "@/database/exam.model"
import { toBrazilianLocaleDate } from "@/utils"
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
		default: {
			switch (props.exam.category) {
				case "laboratorial":
					return "bloodtype"
				case "imagem":
					return "radiology"
				case "funcional":
					return "monitor_heart"
				case "preventivo":
					return "health_and_safety"
				default:
					return "broken_image"
			}
		}
	}
})

const date = computed(() => {
	return toBrazilianLocaleDate(props.exam.date?.toDate())
})

const status = computed(() => {
	switch (props.exam.status) {
		case "solicitado":
			return "Solicitado"
		case "triagem":
			return "Em triagem"
		case "liberado":
			return "Resultado liberado"
		case "pendente":
			return "Ação pendente"
		default:
			return "Desconhecido"
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
	<tr class="*:py-2 *:px-3 *:text-center hover:bg-primaryLight/50">
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
			<div class="flex gap-1 justify-center">
				<p>{{ status }}</p>
				<span class="material-symbols-rounded select-none">
					{{ statusIcon }}
				</span>
			</div>
		</td>
		<td></td>
	</tr>
</template>
