<script setup lang="ts">
import { computed, ref, useTemplateRef } from "vue"
import BaseDialog from "@/components/bases/BaseDialog.vue"
import BaseButton from "@/components/bases/BaseButton.vue"
import BaseInput from "@/components/bases/BaseInput.vue"
import type Report from "@/models/report.model"
import { onClickOutside } from "@vueuse/core"
import { useAuthStore } from "@/stores/authStore"
import { timestampDiffDays, toCoolDate } from "@/utils.ts"
import User from "@/models/user.model"
import { formatToPhone } from "brazilian-values"
import IntensityChip from "./IntensityChip.vue"
import Symptom from "@/models/symptom.model"

const props = defineProps<{
	report: Report
}>()

const focused = ref(false)
const user = ref<User>()
const symptoms = ref<Symptom[]>([])

const popup = useTemplateRef("popup")
const allowedProfessionals = useTemplateRef("allowedProfessionals")
const formRename = useTemplateRef("formRename")
const definePassword = useTemplateRef("definePassword")
const viewReport = useTemplateRef("viewReport")

const reportDateTime = computed(() => props.report.created_at?.toDate())

const authStore = useAuthStore()

const toggle = () => {
	focused.value = !focused.value
}

const mostAffectedArea = computed(() => {
	const areas = Object.groupBy(symptoms.value, (item) => item.place)
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

onClickOutside(popup, () => {
	focused.value = false
})

authStore.onReady(async (data) => {
	user.value = data as User
	symptoms.value = await Symptom.getBetween(
		props.report.period_start!,
		props.report.period_end!,
		data.id,
	)
})
</script>

<template>
	<tr class="border-t border-primaryDark">
		<td class="font-medium flex justify-center items-center relative m-1.5">
			<span
				class="material-symbols-rounded text-base! md:text-2xl! text-primarydark absolute left-1 md:left-3"
			>
				description
			</span>
			<p>
				{{ report.title }}
			</p>
		</td>

		<td class="text-center">{{ report.id }}</td>

		<td class="text-center">{{ reportDateTime?.toLocaleDateString() }}</td>

		<td class="relative">
			<div class="flex justify-center items-center">
				{{ reportDateTime?.toLocaleTimeString() }}
				<button
					type="button"
					@click="toggle()"
					class="absolute right-1 md:right-2 cursor-pointer anchor-name-[--botoeira]"
				>
					<span class="material-symbols-rounded text-primaryDark">
						{{ "more_horiz" }}
					</span>
				</button>
			</div>
		</td>

		<div
			v-if="focused"
			ref="popup"
			class="flex flex-col text-primaryDark absolute right-0 top-[anchor(top)] bg-surface z-10 outline-1 outline-primary rounded-lg p-1 position-anchor-[--botoeira]"
		>
			<BaseButton
				@click="allowedProfessionals?.toggle()"
				icon="shield_toggle"
				theme="primaryDark"
				mode="transparent"
				class="text-sm! p-2! justify-start"
			>
				Profissionais permitidos
			</BaseButton>
			<BaseButton
				@click="formRename?.toggle()"
				icon="edit_square"
				theme="primaryDark"
				mode="transparent"
				class="text-sm! p-2! justify-start"
			>
				Renomear relatório
			</BaseButton>
			<BaseButton
				icon="delete"
				theme="primaryDark"
				mode="transparent"
				class="text-sm! p-2! justify-start"
			>
				Apagar relatório
			</BaseButton>
			<BaseButton
				@click="viewReport?.toggle()"
				icon="visibility"
				theme="primaryDark"
				mode="transparent"
				class="text-sm! p-2! justify-start"
			>
				Visualizar relatório
			</BaseButton>
		</div>
	</tr>

	<BaseDialog :title="report.title" ref="viewReport">
		<form
			class="flex flex-col gap-2 overflow-y-auto max-h-[80vh] text-textLight scrollbar-track-transparent scrollbar-thumb-accent"
		>
			<section class="*:flex *:gap-1 *:*:first:font-semibold mb-2">
				<p class="font-light italic">Relatório: {{ report.id }}</p>

				<span>
					<p>Período:</p>
					<p>
						{{ toCoolDate(report.period_end!!.toDate()) }}
						a
						{{ toCoolDate(report.period_start!!.toDate()) }}
					</p>
				</span>
				<span>
					<p>Duração:</p>
					<p>
						{{
							Math.floor(
								timestampDiffDays(report.period_start!!, report.period_end!!),
							)
						}}
						dias
					</p>
				</span>

				<section class="flex just" v-if="user?.user_type === 'professional'">
					<!-- <UserPhoto/> -->
					<article class="flex flex-col text-textLight text-xs justify-center">
						<p class="text-base font-bold">{{ user.name }}</p>
						<p>{{ user.email }}</p>
						<p>{{ formatToPhone(user.phone) }}</p>
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

					<!-- TODO: se não tem gráfico no frontend, não tem como fazer o back -->
					<article v-if="false">
						<span class="flex">
							<p class="text-base font-bold">10/04:</p>
							<p class="text-error text-base font-normal mx-0.5">8 de intensidade</p>
						</span>
						<span class="flex">
							<p class="text-base font-bold">12/04:</p>
							<p class="text-sucess text-base font-normal mx-0.5">4 de intensidade</p>
						</span>
						<span class="flex">
							<p class="text-base font-bold">14/04:</p>
							<p class="text-warning text-base font-normal mx-0.5">
								5 de intensidade
							</p>
						</span>
					</article>
				</div>
			</section>

			<section class="flex flex-col max-h-full">
				<h2>Cronologia do Sintoma</h2>

				<article
					class="flex flex-row gap-2 *:flex *:flex-col"
					v-for="(symptom, index) in symptoms"
					:key="symptom.id"
				>
					<div class="items-center">
						<span
							class="material-symbols-rounded bg-primaryLight text-background rounded-full p-1"
						>
							vital_signs
						</span>
						<hr
							class="flex-1 w-0.5 bg-textLight border-0"
							v-if="index + 1 !== symptoms.length"
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

			<!-- TODO: uhhh, change how symptoms are store so that they can be groped together -->
			<section v-if="false">
				<p class="text-textLight text-xl font-bold mb-2">Visão Geral</p>

				<article class="flex justify-center w-full">
					<table class="w-full border-separate border-spacing-0.5">
						<thead class="gap-0.5 text-background font-semibold">
							<tr>
								<th class="bg-surface">Sintoma</th>
								<th class="bg-surface">Duração</th>
								<th class="bg-surface">Ocorrência</th>
							</tr>
						</thead>
						<tbody class="gap-0.5 text-background">
							<tr>
								<th class="bg-textLight">Dor nas Costas</th>
								<th class="bg-textLight">20 dias</th>
								<th class="bg-textLight">9 Ocorrências</th>
							</tr>
							<tr>
								<th class="bg-textLight">Estômago Ardendo</th>
								<th class="bg-textLight">4 dias</th>
								<th class="bg-textLight">3 Ocorrências</th>
							</tr>
						</tbody>
					</table>
				</article>
			</section>
		</form>
	</BaseDialog>

	<!--Renomear-->
	<BaseDialog title="Renomear relatório" ref="formRename">
		<form class="flex flex-col place-items-center relative gap-1">
			<BaseInput placeholder="Novo nome" icon="edit_square" class="w-full" required />

			<BaseButton type="submit" theme="accent" class="mt-1"> Mudar Nome </BaseButton>
		</form>
	</BaseDialog>

	<!--Mudar Senha-->
	<BaseDialog title="Definir senha" ref="definePassword">
		<form class="flex flex-col place-items-center relative gap-1">
			<BaseInput placeholder="Senha" icon="lock" class="w-full" required />
			<BaseInput placeholder="Confirmar senha" icon="lock" class="w-full" required />

			<BaseButton type="submit" theme="accent" class="mt-1"> Mudar Senha </BaseButton>
		</form>
	</BaseDialog>

	<BaseDialog title="Gerenciar permissões" ref="allowedProfessionals">
		<form class="flex flex-col place-items-center relative">
			<!-- Permissões -->
			<div class="flex flex-col gap-2 w-full">
				<label
					class="flex items-center w-full h-11 bg-surface rounded-md px-3 cursor-pointer"
				>
					<input type="checkbox" class="w-4 h-4 mr-3 accent-primary" />
					<span class="text-primaryDark text-sm"> Dra. Cláudia Leite </span>
				</label>

				<label
					class="flex items-center w-full h-11 bg-surface rounded-md px-3 cursor-pointer"
				>
					<input type="checkbox" class="w-4 h-4 mr-3 accent-primary" />
					<span class="text-primaryDark text-sm"> Dr. Auzio Varella </span>
				</label>
			</div>

			<BaseButton type="submit" theme="accent" class="mt-4 w-[60%] gap-1">Salvar</BaseButton>
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
