<script setup lang="ts">
import type Medication from "@/database/medication.model";
import { capitalize, ref, computed } from "vue";
import Patient from "@/database/patient.model"
import Professional from "@/database/professional.model"
import { useAuthStore } from "@/stores/authStore"
import { ContextMenu, ContextMenuItem, type MenuOptions } from "@imengyu/vue3-context-menu"

const authStore = useAuthStore()

const props = defineProps<{
	medication: Medication
}>()

const currentUser = ref<Patient | Professional | null>(null)
const userType = computed(() => currentUser.value?.user_type)

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

const taken = ref(props.medication.isTaken(Date.now()))

const emit = defineEmits<{
    (e: "update:tomado", value: boolean): void
	(e: "update:medication", value: Medication): void
	(e: "delete:medication", value: Medication): void
}>()

function onChange(event: Event) {
    emit("update:tomado", (event.target as HTMLInputElement).checked)
}

const updateMedication = () => {
	emit("update:medication", props.medication)
}

const deleteMedication = () => {
	emit("delete:medication", props.medication)
}

authStore.onReady(async (user) => {
	if (!(user instanceof Patient || user instanceof Professional)) {
		return
	}
	currentUser.value = user
})
</script>

<template>
	<tr class="border-t border-primarydark *:not-first:text-center">
		<td class="font-medium flex items-center gap-2">
			<span class="material-symbols-rounded">medication</span>
			{{ medication.name }}
		</td>

		<td>{{ medication.getDoseString() }}</td>

		<td>A cada {{ medication.getFrequencyString() }}</td>

		<td>{{ capitalize(medication.route) }}</td>

		<!-- TODO: fix this shit -->
		<td>
			<input
				type="checkbox"
    				:checked="taken"
    				@change="onChange"
				class="h-4 w-4 appearance-none rounded border border-background bg-transparent checked:bg-background checked:border-background"
			/>
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
			<ContextMenuItem label="Atualizar medicamento" @click="updateMedication">
				<template #icon>
					<span class="material-symbols-rounded"> edit_square </span>
				</template>
			</ContextMenuItem>
			<ContextMenuItem label="Apagar medicamento" @click="deleteMedication">
				<template #icon>
					<span class="material-symbols-rounded"> delete </span>
				</template>
			</ContextMenuItem>
		</ContextMenu>
	</tr>
</template>
