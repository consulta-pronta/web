<script setup lang="ts">
import BaseButton from '@/components/bases/BaseButton.vue'
import BaseInput from "@/components/bases/BaseInput.vue"
import NavBar from '@/components/NavBar.vue'
import ReportRow from '@/components/ReportRow.vue'
import BaseDialog from '@/components/bases/BaseDialog.vue'
import { ref, useTemplateRef } from 'vue'
import FormReport from '@/components/forms/FormReport.vue'

interface Relatorio {
	id: string
	nome: string
	data: string
	horario: string
	show: boolean
}

const relatorios = ref<Relatorio[]>([
	{
		id: '123456789/1242',
		nome: 'Dores',
		data: '01/04/2026',
		horario: '14:14',
		show: false
	},
	{
		id: '987654321/5678',
		nome: 'Dor Constante',
		data: '10/04/2026',
		horario: '09:30',
		show: false
	}
])

const formRegister = useTemplateRef("formRegister")

const registers = ref(1)
const intensity = ref(6.7)

</script>

<template>
	<div class="flex h-screen">
		<NavBar />

		<main class="w-full h-full overflow-clip px-6 py-8">
			<header class="mb-16 flex flex-col gap-8">
				<h1 class="text-4xl text-textLight font-bold text-center lg:text-start">
					Meus Relatórios
				</h1>

				<section class="flex flex-row gap-2 justify-center *:h-[stretch]">
					<BaseButton type="button" theme="accent" icon="add_notes" @click="formRegister?.toggle()" class="col-span-3 rounded-2xl">
						<p class="hidden lg:block">
							Adicionar Relatórios
						</p>
					</BaseButton>

					<BaseInput
						placeholder="Pesquisar"
						icon="search"
						class="place-self-center w-full md:w-120"
					/>

					<BaseButton type="button" theme="primary" icon="download" class="col-span-3 rounded-2xl">
						<p class="hidden lg:block">
							Exportar lista
						</p>
					</BaseButton>
				</section>
			</header>

			<div class="w-full max-h-[55vh] overflow-y-auto rounded-xl scrollbar-hide">
				<table class="w-full text-textDark bg-surface">
					<thead class="font-bold sticky top-0 z-1">
						<tr class="bg-surface shadow-[inset_0_-2px_0_var(--color-primaryDark)]">
							<th>Relatório</th>
							<th>ID</th>
							<th>Data</th>
							<th>Horário</th>
						</tr>
					</thead>

					<tbody>
						<template v-for="relatorio in relatorios" :key="relatorio.id">
							<ReportRow :report="relatorio" />
						</template>

					</tbody>
				</table>
			</div>
		</main>

		<!--Form Registro-->
		<BaseDialog title="Gerar Relatório" ref="formRegister">
			<FormReport :registers="registers" :intensity="intensity" />
		</BaseDialog>
		<!--Fim Form Registro-->
	</div>
</template>

<style scoped>
	@reference "@/assets/main.css";

	.dialog {
		@apply
			absolute inset-0 w-full h-full
			bg-black/80
			flex justify-center place-items-center
			z-50
	}

	td, th {
		@apply p-3 text-center
	}
</style>
