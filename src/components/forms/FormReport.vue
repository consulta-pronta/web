<script setup lang="ts">
import BaseSelect from "@/components/bases/BaseSelect.vue"
import BaseButton, { type ButtonState } from "@/components/bases/BaseButton.vue"
import BaseInput from "@/components/bases/BaseInput.vue"
import { computed, ref, useTemplateRef } from "vue"
import Report from "@/models/report.model"
import { Timestamp } from "firebase/firestore"
import { inputDateToDate } from "@/utils"
import Symptom from "@/models/symptom.model"
import { useAuthStore } from "@/stores/authStore"
import BaseDialog from "../bases/BaseDialog.vue"

const authStore = useAuthStore()

const dialogSymptoms = useTemplateRef("symptoms")

const reportRef = ref(new Report())
const periodStartInput = ref("")
const periodEndInput = ref("")
const symptoms = ref<Symptom[]>([])
const buttonState = ref<ButtonState>("enabled")

const periodStart = computed(() => Timestamp.fromDate(inputDateToDate(periodStartInput.value)))
const periodEnd = computed(() => Timestamp.fromDate(inputDateToDate(periodEndInput.value)))

const emit = defineEmits(["handled-submit"])

const loadSymptoms = async () => {
	const id = authStore.userData?.id
	if (id == null) {
		return
	}
	if (periodStartInput.value.length === 0 || periodEndInput.value.length === 0) {
		return
	}

	symptoms.value = await Symptom.getBetween(periodStart.value, periodEnd.value, id)

	dialogSymptoms.value?.show()
}

const submitForm = async () => {
	reportRef.value.period_start = periodStart.value
	reportRef.value.period_end = periodEnd.value

	buttonState.value = "sync"

	const data = reportRef.value.toMap()
	await authStore.onReady(async (user) => {
		await Report.set(data, { scope: { userId: user.id } })
	})

	emit("handled-submit")
	buttonState.value = "enabled"
}
</script>

<template>
	<form
		@submit.prevent="submitForm"
		class="flex flex-col place-items-center relative gap-2 *:w-full"
	>
		<p class="text-textLight text-lg text-medium text-center">
			Gere um relatório completo do seus sintomas para compartilhar com seu médico.
		</p>

		<BaseInput
			placeholder="Título do Relatório"
			icon="content_paste"
			required
			v-model="reportRef.title"
		/>

		<fieldset class="bg-surface rounded-md p-4 text-primaryDark flex flex-col gap-3">
			<div class="flex flex-row gap-2">
				<span class="material-symbols-rounded"> calendar_today </span>

				<p>Período</p>
			</div>

			<div class="w-full grid grid-cols-2 gap-2">
				<p>De:</p>
				<p>Até:</p>

				<BaseInput type="date" theme="dark" required v-model="periodStartInput" />
				<BaseInput type="date" theme="dark" required v-model="periodEndInput" />
			</div>
		</fieldset>

		<BaseSelect
			theme="light"
			icon="person"
			defaultValue="Profissionais que podem visualizar"
			class="hidden"
		>
			<!-- required -->
			<!-- TODO: Add this functionality when that shit is implemented -->
		</BaseSelect>

		<BaseButton type="button" theme="accent" mode="transparent" @click="loadSymptoms">
			Visualizar sintomas incluídos
		</BaseButton>

		<p class="font-bold">Resumo do período</p>

		<section class="grid grid-cols-2 gap-2 *:border *:border-textLight *:rounded-md *:p-3">
			<div class="flex flex-col text-center">
				<div class="flex flex-row justify-center gap-2">
					<span class="material-symbols-rounded"> book_4 </span>
					<p>{{ "TODO TODO TODO" }}</p>
				</div>
				<p class="text-sm">Registros</p>
			</div>

			<div class="flex flex-col text-center">
				<div class="flex flex-row justify-center gap-2">
					<span class="material-symbols-rounded"> vital_signs </span>
					<p>{{ "TODO TODO TODO" }}</p>
				</div>
				<p class="text-sm">Intensidade Média</p>
			</div>

			<div class="flex border col-span-2 justify-center gap-1">
				<span class="material-symbols-rounded text-3xl! text-center text-sucess">
					location_on
				</span>
				<article>
					<p class="text-sm">Área mais afetada</p>
					<p class="font-bold">{{ "TODO TODO TODO" }}</p>
				</article>
			</div>
		</section>

		<br />

		<BaseButton type="submit" theme="accent" icon="add_circle" :state="buttonState">
			Criar relatório
		</BaseButton>

		<BaseDialog title="Sintomas incluídos no periodo" theme="light" ref="symptoms">
			<ul class="list-inside list-disc">
				<li v-for="symptom in symptoms" :key="symptom.id">
					{{ symptom.title }}
				</li>
			</ul>
		</BaseDialog>
	</form>
</template>
