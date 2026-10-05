<script setup lang="ts">
// import type { Patient } from "@/models/symptomModel"
// import { getPatient } from "@/services/symptomService"
import { useAuthStore } from "@/stores/authStore"
import { ref, watch } from "vue"

const patientId = defineModel<string>()
const isFetching = defineModel<boolean>("isFetching")

const authStore = useAuthStore()

const list = ref<unknown[]>()

// watch(patientId, async (value) => {
// 	list.value = []

// 	if (!value) {
// 		return
// 	}

// 	isFetching.value = true

// 	const patient = await getPatient(authStore.user!.uid, value)
// 	list.value = [patient]
// 	if (patient.historic) {
// 		list.value = list.value.concat(patient.historic)
// 	}

// 	isFetching.value = false
// })
</script>

<template>
	<ul
		class="flex flex-col gap-4"
		:class="false ? 'h-full justify-center items-center' : ''"
	>
		<span v-if="false" class="material-symbols-rounded animate-spin text-accent w-fit">
			sync
		</span>
		<article class="bg-surface text-textDark p-3 rounded-xl">
			<section>
				<h2 class="text-xl font-bold">Cláudio Silva</h2>
			</section>
		</article>
		<div class="flex flex-col gap-5 w-full">
			<div class="flex flex-col md:flex-row gap-5">
				<!-- Dados pessoais -->
				<section class="bg-surface text-textDark w-full rounded-2xl p-5 flex flex-col gap-4 font-bold">
					<p class="text-xl">Dados pessoais</p>

					<div class="grid grid-cols-2 gap-5">
						<div>
							<p>45 anos</p>
							<p class="font-normal opacity-70">Idade</p>
						</div>
						<div>
							<p>12/03/1981</p>
							<p class="font-normal opacity-70">Data de nascimento</p>
						</div>
						<div>
							<p>Masculino</p>
							<p class="font-normal opacity-70">Gênero</p>
						</div>
						<div>
							<p>Masculino</p>
							<p class="font-normal opacity-70">Sexo biológico</p>
						</div>
						<div>
							<p>321.654.987-01</p>
							<p class="font-normal opacity-70">CPF</p>
						</div>
						<div>
							<p>Rua das Flores, 123 - Serra, ES</p>
							<p class="font-normal opacity-70">Endereço</p>
						</div>
					</div>
				</section>

				<!-- Meios de contato -->
				<section class="bg-surface text-textDark w-full rounded-2xl p-5 flex flex-col gap-4 font-bold">
					<p class="text-xl">Meios de contato</p>

					<div class="flex flex-col gap-5">
						<div>
							<p>(27) 99999-9999</p>
							<p class="font-normal opacity-70">Telefone</p>
						</div>
						<div>
							<p>claudio.silva@email.com</p>
							<p class="font-normal opacity-70">Email</p>
						</div>

						<hr class="h-0.5 border-0 bg-textDark w-full rounded-full opacity-70" />

						<p>Aplicativos conectados</p>
						<div>
							<p>(27) 99999-9999</p>
							<p class="font-normal opacity-70">Whatsapp</p>
						</div>
					</div>
				</section>
			</div>

			<!-- Informações de saúde -->
			<section class="bg-surface text-textDark rounded-2xl p-5 flex flex-col gap-4">
				<p class="text-xl font-bold">Informações de saúde</p>

				<div class="grid grid-cols-3 gap-5 font-bold">
					<div>
						<p>O+</p>
						<p class="font-normal opacity-70">Tipo sanguíneo</p>
					</div>
					<div>
						<p>1,78 m</p>
						<p class="font-normal opacity-70">Altura</p>
					</div>
					<div>
						<p>82 kg</p>
						<p class="font-normal opacity-70">Peso</p>
					</div>
				</div>

				<hr class="h-0.5 border-0 bg-textDark w-full rounded-full opacity-70" />

				<div class="grid grid-cols-2 gap-5 font-bold">
					<div>
						<p>Penicilina</p>
						<p>Látex</p>
						<p>Poeira</p>
						<p class="font-normal opacity-70">Alergias</p>
					</div>
					<div>
						<p>Pai: Hipertensão</p>
						<p>Mãe: Diabetes</p>
						<p>Avó: Colesterol alto</p>
						<p class="font-normal opacity-70">Histórico familiar</p>
					</div>
				</div>
			</section>
		</div>
	</ul>
</template>
