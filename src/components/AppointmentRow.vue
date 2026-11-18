<script setup lang="ts">
import Appointment from "@/database/appointment.model"
import { toBrazilianLocaleDate } from "@/utils"
import { computed } from "vue"

const props = defineProps<{
	appointment: Appointment
}>()

const typeIcon = computed(() => {
	switch (props.appointment.type) {
		case "preventiva":
			return "health_and_safety"
		case "sintomatica":
			return "health_metrics"
		default: {
			return "broken_image"
		}
	}
})

const date = computed(() => {
	return toBrazilianLocaleDate(props.appointment.date?.toDate())
})

const status = computed(() => {
	switch (props.appointment.status) {
		case "solicitado":
			return "Solicitado"
		case "confirmado":
			return "Confirmado"
		default:
			return "Desconhecido"
	}
})
const statusIcon = computed(() => {
	switch (props.appointment.status) {
		case "solicitado":
			return "pending"
		case "confirmado":
			return "check_circle"
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
				<p>{{ appointment.details }}</p>
			</div>
		</td>
		<td>{{ appointment.hospital }}</td>
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
