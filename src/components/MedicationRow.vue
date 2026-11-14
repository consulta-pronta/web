<script setup lang="ts">
import type Medication from "@/database/medication.model";
import { isMedicationTaken } from "@/database/medication.model";
import { ref } from "vue";

const props = defineProps<{
	medication: Medication
}>()

const taken = ref(isMedicationTaken(props.medication, Date.now()))

const emit = defineEmits<{
    (e: "update:tomado", value: boolean): void
}>()

function onChange(event: Event) {
    emit("update:tomado", (event.target as HTMLInputElement).checked)
}
</script>

<template>
	<tr class="border-t border-primarydark *:not-first:text-center">
		<td class="font-medium flex items-center gap-2">
			<span class="material-symbols-rounded">medication</span>
			{{ medication.title }}
		</td>

		<td>{{ medication.getDoseString() }}</td>

		<td>{{ medication.getFrequencyString() }}</td>

		<td>{{ medication.route }}</td>

		<!-- TODO: fix this shit -->
		<td>
			<input
				type="checkbox"
    				:checked="taken"
    				@change="onChange"
				class="h-4 w-4 appearance-none rounded border border-background bg-transparent checked:bg-background checked:border-background"
			/>
		</td>

		<!-- TODO: more_horiz functionality -->
		<td></td>
	</tr>
</template>
