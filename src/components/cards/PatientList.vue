<script setup lang="ts">
import type Patient from "@/database/patient.model"
import PatientCard from "./PatientCard.vue";

defineProps<{
	patients: Patient[]
}>()

const emit = defineEmits<{
	selected: [patient: Patient]
}>()
</script>

<template>
	<ul class="w-full flex flex-col gap-2">
		<li v-for="patient in patients" :key="patient.cpf">
			<PatientCard :patient="patient" @selected="emit('selected', patient)"/>
		</li>
	</ul>
</template>
