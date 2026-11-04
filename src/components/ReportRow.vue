<script setup lang="ts">
import { computed, ref, useTemplateRef } from "vue"
import BaseDialog from "@/components/bases/BaseDialog.vue"
import BaseButton from "@/components/bases/BaseButton.vue"
import BaseInput from "@/components/bases/BaseInput.vue"
import type Report from "@/database/report.model"
import { onClickOutside } from "@vueuse/core"
import ReportExtended from "@/components/ReportExtended.vue"

const props = defineProps<{
	report: Report
}>()

const focused = ref(false)

const popup = useTemplateRef("popup")
const allowedProfessionals = useTemplateRef("allowedProfessionals")
const formRename = useTemplateRef("formRename")
const definePassword = useTemplateRef("definePassword")
const viewReport = useTemplateRef("viewReport")

const reportDateTime = computed(() => props.report.created_at?.toDate())

const toggle = () => {
	focused.value = !focused.value
}

onClickOutside(popup, () => {
	focused.value = false
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

	<Teleport to="body">
		<ReportExtended :report="report" ref="viewReport" />

		<BaseDialog title="Renomear relatório" ref="formRename">
			<form class="flex flex-col place-items-center relative gap-1">
				<BaseInput placeholder="Novo nome" icon="edit_square" class="w-full" required />

				<BaseButton type="submit" theme="accent" class="mt-1"> Mudar Nome </BaseButton>
			</form>
		</BaseDialog>

		<BaseDialog title="Definir senha" ref="definePassword">
			<form class="flex flex-col place-items-center relative gap-1">
				<BaseInput placeholder="Senha" icon="lock" class="w-full" required />
				<BaseInput
					placeholder="Confirmar senha"
					icon="lock"
					class="w-full"
					required
				/>

				<BaseButton type="submit" theme="accent" class="mt-1">
					Mudar Senha
				</BaseButton>
			</form>
		</BaseDialog>

		<BaseDialog title="Gerenciar permissões" ref="allowedProfessionals">
			<form class="flex flex-col place-items-center relative">
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

				<BaseButton type="submit" theme="accent" class="mt-4 w-[60%] gap-1">
					Salvar
				</BaseButton>
			</form>
		</BaseDialog>
	</Teleport>
</template>
