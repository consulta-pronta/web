<script setup lang="ts">
import Exam from "@/database/exam.model"
import { toBrazilianLocaleDate } from "@/utils"
import { computed, ref } from "vue"
import { ContextMenu, ContextMenuItem, type MenuOptions } from "@imengyu/vue3-context-menu"
import Patient from "@/database/patient.model"
import Professional from "@/database/professional.model"
import { useAuthStore } from "@/stores/authStore"

const authStore = useAuthStore()

const props = defineProps<{
	exam: Exam
}>()

const emit = defineEmits<{
	(e: "update:exam", value: Exam): void
	(e: "delete:exam", value: Exam): void
}>()

const currentUser = ref<Patient | Professional | null>(null)
const userType = computed(() => currentUser.value?.user_type)

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

const menuShow = ref(false)
const menuOptions = ref<MenuOptions>({
	theme: "cp-light",
	minWidth: 230,
	x: 0,
	y: 0,
})

const openMenu = (e: MouseEvent) => {
	menuShow.value = true
	menuOptions.value.x = e.x
	menuOptions.value.y = e.y
}

const updateExam = () => {
	emit("update:exam", props.exam)
}

const deleteExam = () => {
	emit("delete:exam", props.exam)
}

authStore.onReady(async (user) => {
	if (!(user instanceof Patient || user instanceof Professional)) {
		return
	}
	currentUser.value = user
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
		<td>
			<button v-if="userType === 'patient'"
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
			<ContextMenuItem label="Atualizar exame" @click="updateExam">
				<template #icon>
					<span class="material-symbols-rounded"> edit_square </span>
				</template>
			</ContextMenuItem>
			<ContextMenuItem label="Apagar exame" @click="deleteExam">
				<template #icon>
					<span class="material-symbols-rounded"> delete </span>
				</template>
			</ContextMenuItem>
		</ContextMenu>
	</tr>
</template>
