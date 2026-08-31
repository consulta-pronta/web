<script setup lang="ts">
import { ref } from "vue"
import NavBar from "@/components/NavBar.vue"
import BaseInput from "@/components/bases/BaseInput.vue"
import { type Exam } from "@/models/examModel"
import { Timestamp } from "firebase/firestore"
import ExamRow from "@/components/ExamRow.vue"


const exames = ref<Exam[]>([
	{
		id: "1",
		name: "Hemograma Completo",
		category: "laboratorial",
		type: "hemograma",
		place: "Hospital Meridional",
		date: Timestamp.fromMillis(Date.parse("10/05/2026")),
		status: "liberado",
	},
	{
		id: "2",
		name: "Raio-X",
		category: "imagem",
		type: "radiografia",
		place: "Hospital Meridional",
		date: Timestamp.fromMillis(Date.parse("12/05/2026")),
		status: "triagem",
	},
	{
		id: "3",
		name: "Exame de Urina",
		category: "laboratorial",
		type: "urina",
		place: "Hospital Meridional",
		date: Timestamp.fromMillis(Date.parse("01/05/1967")),
		status: "triagem",
	},
])
</script>

<template>
	<div class="flex h-screen">
		<NavBar />

		<main class="w-full h-full overflow-clip px-6 py-8">
			<header class="mb-16 flex flex-col gap-8">
				<h1 class="text-4xl text-textLight font-bold text-center lg:text-start">Meus Exames</h1>
				
				<BaseInput placeholder="Pesquisar" icon="search" class="place-self-center w-full md:w-120" />
			</header>

			<table class="text-textDark w-full *:*:*:p-3 rounded-xs overflow-clip">
				<thead>
					<tr class="bg-surface/80 *:text-start">
						<!-- <th><input type="checkbox" name="" id=""></th> Selecionar -->
						<th>Exame</th>
						<th>Local</th>
						<th>Data</th>
						<th>Status</th>
						<!-- <th>&nbsp;</th> Mais -->
					</tr>
				</thead>
				<tbody>
					<template v-for="(exame) in exames" :key="exame.id">
						<ExamRow
							:exam="exame"
							class="bg-surface border-b hover:brightness-90"
						/>
					</template>
				</tbody>
			</table>
		</main>
	</div>
</template>
