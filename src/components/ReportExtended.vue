<script setup lang="ts">
import { computed, ref, useTemplateRef } from "vue"
import BaseDialog from "@/components/bases/BaseDialog.vue"
import type Report from "@/database/report.model"
import Symptom from "@/database/symptom.model"
import User from "@/database/user.model"
import { useAuthStore } from "@/stores/authStore"
import { timestampDiffDays, toCoolDate } from "@/utils"
import { formatToPhone } from "brazilian-values"
import IntensityChip from "@/components/IntensityChip.vue"

const props = defineProps<{
	report: Report
}>()

const dialog = useTemplateRef("dialog")


const user = ref<User>()
const symptoms = ref<Symptom[]>([])

const authStore = useAuthStore()

const reportDuration = computed(() => {
	const { period_start, period_end } = props.report
	if (!(period_start && period_end)) return 0

	return Math.floor(timestampDiffDays(period_start, period_end))
})

const mostAffectedArea = computed(() => {
	const areas = Object.groupBy(symptoms.value, (item) => item.place ?? "")
	const entries = Object.entries(areas)

	const [area, maxSymptoms] = entries.reduce(
		(max, item) => {
			return item[1]!.length > max.length ? item : max
		},
		["", []],
	)
	const amount = maxSymptoms?.length ?? 0

	let intensity = 0.0
	const sum =
		maxSymptoms!.reduce((sum, item) => {
			return sum + Number(item.intensity)
		}, 0) ?? 0
	intensity = sum / amount

	return { area, amount, intensity }
})

authStore.onReady(async (data) => {
	user.value = data as User
	
	const { period_start, period_end } = props.report
	if (!(period_start && period_end)) return 0

	symptoms.value = await Symptom.getBetween(period_start, period_end, data.id)
})

const show = () => dialog.value?.show()
const toggle = () => dialog.value?.toggle()

defineExpose({ show, toggle })
</script>

<template>
	<BaseDialog :title="report.title" ref="dialog">
		<form
			class="flex flex-col gap-2 overflow-y-auto max-h-[80vh] text-textLight scrollbar-track-transparent scrollbar-thumb-accent"
		>
			<section class="*:flex *:gap-1 *:*:first:font-semibold mb-2">
				<p class="font-light italic">Relatório: {{ report.id }}</p>

				<span>
					<p>Período:</p>
					<p>
						{{ toCoolDate(report.period_end?.toDate()) }}
						a
						{{ toCoolDate(report.period_start?.toDate()) }}
					</p>
				</span>
				<span>
					<p>Duração:</p>
					<p>{{ reportDuration }} dias</p>
				</span>

				<section v-if="user?.user_type === 'professional'" class="flex">
					<article class="flex flex-col text-textLight text-xs justify-center">
						<p class="text-base font-bold">{{ user.name }}</p>
						<p>{{ user.email }}</p>
						<p v-if="user.phone">{{ formatToPhone(user.phone) }}</p>
					</article>
				</section>
			</section>

			<section>
				<h2>Resumo Geral</h2>

				<div class="flex gap-3 text-textDark *:bg-surface *:grow *:p-3 *:rounded-xl">
					<article>
						<small>Área mais afetada</small>
						<h3>{{ mostAffectedArea.area }}</h3>
						<h6 class="text-sm font-medium">{{ mostAffectedArea.amount }} registros</h6>
						<IntensityChip
							:intensity="mostAffectedArea.intensity"
							custom-message="Média:"
							class="mt-3"
						/>
					</article>
				</div>
			</section>

			<section class="flex flex-col max-h-full">
				<h2>Cronologia do Sintoma</h2>

				<article
					v-for="(symptom, index) in symptoms"
					:key="symptom.id"
					class="flex flex-row gap-2 *:flex *:flex-col"
				>
					<div class="items-center">
						<span
							class="material-symbols-rounded bg-primaryLight text-background rounded-full p-1"
						>
							vital_signs
						</span>
						<hr
							v-if="index + 1 !== symptoms.length"
							class="flex-1 w-0.5 bg-textLight border-0"
						/>
					</div>

					<section class="bg-surface text-textDark rounded-lg p-3 grow mb-2">
						<div class="flex flex-row justify-between items-center">
							<h3 class="grow">{{ symptom.title }}</h3>
							<p class="text-sm">{{ toCoolDate(symptom.date_time?.toDate()) }}</p>
						</div>
						<p>Intensidade: {{ symptom.intensity }}/10</p>
						<p class="text-sm">"{{ symptom.description }}"</p>
					</section>
				</article>
			</section>
		</form>
	</BaseDialog>
</template>

<style scoped>
@reference "@/assets/main.css";

h2 {
	@apply text-textLight text-xl font-medium mb-2;
}

h3 {
	@apply font-semibold text-lg;
}
</style>
