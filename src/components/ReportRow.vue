<script setup lang="ts">
import { computed, ref, useTemplateRef } from "vue"
import BaseDialog from "@/components/bases/BaseDialog.vue"
import BaseButton from "@/components/bases/BaseButton.vue"
import BaseInput from "@/components/bases/BaseInput.vue"
import type Report from "@/database/report.model"
import { ContextMenu, ContextMenuItem, type MenuOptions } from "@imengyu/vue3-context-menu"
import { toCoolDate } from "@/utils"

const props = defineProps<{
	report: Report
}>()
const emit = defineEmits<{
	selected: [report: Report]
}>()

const menuShow = ref(false)
const menuOptions = ref<MenuOptions>({
	theme: "cp-light",
	minWidth: 230,
	x: 0,
	y: 0,
})

const allowedProfessionals = useTemplateRef("allowedProfessionals")
const formRename = useTemplateRef("formRename")

const reportDateTime = computed(() => props.report.created_at?.toDate())
const durationDays = computed(() => props.report.getDurationDays())

const openMenu = (e: MouseEvent) => {
	menuShow.value = true
	menuOptions.value.x = e.x
	menuOptions.value.y = e.y
}
</script>

<template>
	<tr
		class="cursor-pointer transition-colors hover:bg-primaryLight/50 px-2"
		@click="emit('selected', report)"
		@contextmenu.prevent="openMenu($event)"
	>
		<td class="font-medium">
			<span class="truncate pl-3">{{ report.title }}</span>
		</td>

		<td class="text-center">
			{{
				durationDays === null
					? "—"
					: `${durationDays} ${durationDays === 1 ? "dia" : "dias"}`
			}}
		</td>

		<td class="text-center text-sm">
			<time v-if="reportDateTime" :datetime="reportDateTime.toISOString()">
				{{ toCoolDate(reportDateTime) }}
				
				<span class="block text-xs text-textDark/60">
					{{
						reportDateTime.toLocaleTimeString("pt-BR", {
							hour: "2-digit",
							minute: "2-digit",
						})
					}}
				</span>
			</time>
			<span v-else>—</span>
		</td>

		<td class="text-center">
			<button
				type="button"
				class="cursor-pointer flex justify-center items-center size-full text-primaryDark"
				@click.prevent.stop="openMenu($event)"
			>
				<span class="material-symbols-rounded rounded-full p-1 hover:bg-primaryDark/10">
					more_horiz
				</span>
			</button>
		</td>

		<ContextMenu v-model:show="menuShow" :options="menuOptions">
			<ContextMenuItem
				label="Profissionais permitidos"
				@click="allowedProfessionals?.toggle()"
			>
				<template #icon>
					<span class="material-symbols-rounded"> shield_toggle </span>
				</template>
			</ContextMenuItem>
			<ContextMenuItem label="Renomear relatório" @click="formRename?.toggle()">
				<template #icon>
					<span class="material-symbols-rounded"> edit_square </span>
				</template>
			</ContextMenuItem>
			<ContextMenuItem label="Apagar relatório" @click="console.log('da')">
				<template #icon>
					<span class="material-symbols-rounded"> delete </span>
				</template>
			</ContextMenuItem>
		</ContextMenu>
	</tr>

	<Teleport to="body">
		<BaseDialog title="Renomear relatório" ref="formRename">
			<form class="flex flex-col place-items-center relative gap-1">
				<BaseInput placeholder="Novo nome" icon="edit_square" class="w-full" required />

				<BaseButton type="submit" theme="accent" class="mt-1"> Mudar Nome </BaseButton>
			</form>
		</BaseDialog>

		<BaseDialog title="Definir senha" ref="definePassword">
			<form class="flex flex-col place-items-center relative gap-1">
				<BaseInput placeholder="Senha" icon="lock" class="w-full" required />
				<BaseInput placeholder="Confirmar senha" icon="lock" class="w-full" required />

				<BaseButton type="submit" theme="accent" class="mt-1"> Mudar Senha </BaseButton>
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
