<script setup lang="ts">
import { capitalize, ref } from "vue"

export type PrescriptionEntry = {
	id: string
	patientName: string
	frequency: string
	period: string
}

export type Medicamento = {
	name: string
	dose: string
	route: string
	prescriptions: PrescriptionEntry[]
}

defineProps<{
	medicamento: Medicamento
}>()

const emit = defineEmits<{
	(e: "delete", id: string): void
}>()

const expanded = ref(false)
</script>

<template>
	<tr class="border-t border-primaryDark *:not-first:text-center">
		<td class="font-medium">
			<div class="flex items-center gap-2">
				<span class="material-symbols-rounded">medication</span>
				{{ medicamento.name }}
			</div>
		</td>

		<td>{{ medicamento.dose }}</td>

		<td>{{ capitalize(medicamento.route) }}</td>

		<td>
			<button
				type="button"
				:aria-expanded="expanded"
				aria-label="Mostrar detalhes"
				@click="expanded = !expanded"
			>
				<span
					class="material-symbols-rounded text-primaryDark cursor-pointer transition-transform duration-200"
					:class="{ 'rotate-180': expanded }"
				>
					expand_more
				</span>
			</button>
		</td>
	</tr>

	<template v-if="expanded">
		<tr
			v-for="prescription in medicamento.prescriptions"
			:key="prescription.id"
			class="border-t border-primaryDark *:not-first:text-center"
		>
			<td class="pl-15">{{ prescription.patientName }}</td>
			<td>{{ prescription.frequency }}</td>
			<td>{{ prescription.period }}</td>
			<td>
				<button
					type="button"
					:aria-label="`Apagar prescrição de ${prescription.patientName}`"
					class="cursor-pointer"
					@click="emit('delete', prescription.id)"
				>
					<span class="material-symbols-rounded text-red-500 text-xl!"> delete </span>
				</button>
			</td>
		</tr>
	</template>
</template>
