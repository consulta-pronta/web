<script setup lang="ts">
import { ref } from "vue"
import NavBar from "@/components/NavBar.vue"
import BaseInput from "@/components/bases/BaseInput.vue"
import Exam from "@/database/exam.model"
import ExamRow from "@/components/ExamRow.vue"
import { useAuthStore } from "@/stores/authStore"

const authStore = useAuthStore()

const exames = ref<Exam[]>([])

authStore.onReady(async (user) => {
	exames.value = await Exam.getAll({ scope: { userId: user.id } })
})
</script>

<template>
	<div class="flex h-screen">
		<NavBar />

		<main class="w-full h-full overflow-clip px-6 py-8">
			<header class="mb-16 flex flex-col gap-8">
				<h1 class="text-4xl text-textLight font-bold text-center lg:text-start">
					Meus Exames
				</h1>

				<BaseInput
					placeholder="Pesquisar"
					icon="search"
					class="place-self-center w-full md:w-2xl"
				/>
			</header>

			<table class="text-textDark w-full *:*:*:p-3 rounded-xs overflow-clip">
				<thead>
					<tr class="bg-surface/80 *:text-start">
						<th>Exame</th>
						<th>Local</th>
						<th>Data</th>
						<th>Status</th>
					</tr>
				</thead>
				<tbody>
					<ExamRow
						v-for="exam in exames"
						:key="exam.id"
						:exam="exam"
						class="bg-surface border-b hover:brightness-90"
					/>
				</tbody>
			</table>
		</main>
	</div>
</template>
