<script setup lang="ts">
import Patient from "@/database/patient.model"
import { ref, watch } from "vue"
import { formatToCPF, formatToPhone } from 'brazilian-values'
import { toBrazilianLocaleDate, timestampDiffYears, stringToTimestamp } from '@/utils'

const patientId = defineModel<string>()
	const patient = ref<Patient | null>(null)

watch(patientId, async (value) => {
	if (!value) {
		return
	}

	if (patientId.value) {
		patient.value = await Patient.get(patientId.value)
	}
})
</script>

<template>
	<ul
		v-if="patient"
		class="flex flex-col gap-4"
		:class="false ? 'h-full justify-center items-center' : ''"
	>
		<span v-if="false" class="material-symbols-rounded animate-spin text-accent w-fit">
			sync
		</span>
		<article class="bg-surface text-textDark p-3 rounded-xl">
			<section>
				<h2 class="text-xl font-bold">{{ patient.name }}</h2>
			</section>
		</article>
		<div class="flex flex-col gap-5 w-full">
			<div class="grid grid-cols-2 md:flex-row gap-5">
				<!-- Dados pessoais -->
				<section class="bg-surface text-textDark w-full rounded-2xl p-5 col-span-2 2xl:col-span-1 flex flex-col gap-4 font-bold">
					<p class="text-xl">Dados pessoais</p>

					<div class="grid grid-cols-2 gap-5">
						<div>
							<p>{{ Math.floor(timestampDiffYears(stringToTimestamp(patient.birth_date), stringToTimestamp(new Date().toISOString()))) }} anos</p>
							<p class="font-normal opacity-70">Idade</p>
						</div>
						<div>
							<p>{{ toBrazilianLocaleDate(new Date(patient.birth_date)) }}</p>
							<p class="font-normal opacity-70">Data de nascimento</p>
						</div>
						<div>
							<p>{{ patient.gender }}</p>
							<p class="font-normal opacity-70">Gênero</p>
						</div>
						<div>
							<p>{{ patient.biological_sex }}</p>
							<p class="font-normal opacity-70">Sexo biológico</p>
						</div>
						<div>
							<p>{{ formatToCPF(patient.cpf) }}</p>
							<p class="font-normal opacity-70">CPF</p>
						</div>
						<div>
							<p>{{ patient.address }}</p>
							<p class="font-normal opacity-70">Endereço</p>
						</div>
					</div>
				</section>

				<!-- Meios de contato -->
				<section class="bg-surface text-textDark w-full rounded-2xl p-5 col-span-2 2xl:col-span-1 flex flex-col gap-4 font-bold">
					<p class="text-xl">Meios de contato</p>

					<div class="grid grid-cols-1 gap-5">
						<div>
							<p>{{ formatToPhone(patient.phone) }}</p>
							<p class="font-normal opacity-70">Telefone</p>
						</div>
						<div>
							<p>{{ patient.email }}</p>
							<p class="font-normal opacity-70">Email</p>
						</div>
					</div>
				</section>
			</div>

			<!-- Informações de saúde -->
			<section class="bg-surface text-textDark rounded-2xl p-5 flex flex-col gap-4">
				<p class="text-xl font-bold">Informações de saúde</p>

				<div class="grid grid-cols-3 gap-5 font-bold">
					<div>
						<p>{{ patient.patient_data?.blood_type }}</p>
						<p class="font-normal opacity-70">Tipo sanguíneo</p>
					</div>
					<div>
						<p>{{ patient.patient_data?.height }} cm</p>
						<p class="font-normal opacity-70">Altura</p>
					</div>
					<div>
						<p>{{ patient.patient_data?.weight }} kg</p>
						<p class="font-normal opacity-70">Peso</p>
					</div>
				</div>
			</section>
		</div>
	</ul>
</template>
