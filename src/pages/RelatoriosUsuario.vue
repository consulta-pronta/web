<script setup lang="ts">
import BaseButton from '@/components/bases/BaseButton.vue'
import BaseInput from "@/components/bases/BaseInput.vue"
import NavBar from '@/components/NavBar.vue'
import ReportRow from '@/components/ReportRow.vue'
import BaseDialog from '@/components/bases/BaseDialog.vue'
import { ref, useTemplateRef } from 'vue'
import BaseSelect from '@/components/bases/BaseSelect.vue'

interface Relatorio {
	id: string
	nome: string
	data: string
	horario: string
	Show: boolean
}

const relatorios = ref<Relatorio[]>([
	{
		id: '123456789/1242',
		nome: 'Dores',
		data: '01/04/2026',
		horario: '14:14',
		Show: false
	},
	{
		id: '987654321/5678',
		nome: 'Dor Constante',
		data: '10/04/2026',
		horario: '09:30',
		Show: false
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
			<form class="flex flex-col place-items-center relative gap-2">
				<p class="text-textLight text-lg text-medium text-center">
					Gere um relatório completo do seus sintomas para compartilhar com seu médico.
				</p>
				<!--Barra de Pesquisa-->
				<div class="relative flex items-center w-full h-11 bg-surface rounded-sm">
					<span class="material-symbols-rounded text-primaryDark absolute left-3 pointer-events-none">
						content_paste
					</span>
					<input type="text" placeholder="Título do Relatório" class="text-primaryDark placeholder-primaryDark w-full h-11 outline-none pl-10"/>
				</div>
				<!--Data-->
				<section class="w-full bg-surface rounded-md p-2">
					<article class="relative">
						<span class="material-symbols-rounded text-primaryDark absolute left-3 pointer-events-none">
							calendar_today
						</span>
						<p class="text-primaryDark text-base text-semibold mb-1 pl-10">
							Período
						</p>
					</article>

					<article class="flex w-full gap-2 text-textDark">
						<span class="flex-1 flex-col">
							<p>
								De:
							</p>
							<BaseInput type="date" name="data" theme="dark" class="brightness-80 rounded-lg" />
						</span>
						<span class="flex-1 flex-col">
							<p>
								Até:
							</p>
							<BaseInput type="time" name="horario" theme="dark" class="brightness-80 rounded-lg" />
						</span>
					</article>
				</section>
				<!--Permissão de visualização-->
				<BaseSelect
					theme="light"
					icon="person"
					defaultValue="Profissionais que podem visualizar"
					required
					class="w-full"
				>
					<option value="1">Cláudio Silva</option>
				</BaseSelect>
				<!--Visualizar sintomas incluídos-->
				<div class="flex w-full h-11">
					<BaseButton type="button" theme="primary" class="bg-primary w-full h-11! text-textLight mb-3 rounded-[25px]">Visualizar Sintomas Incluídos</BaseButton>
				</div>
				<!--Resumo do Período-->
				<section class="grid grid-cols-2 gap-2 w-full text-textLight">
					<div class="col-span-2">
						<p class="text-textLight text-base font-bold">
							Resumo do Período
						</p>
					</div>

					<div class="flex flex-col border border-textLight rounded-md p-3 text-center ">

						<article class="flex justify-center text-center gap-1">
							<span class="material-symbols-rounded">
								book_4
							</span>
							<p>
								{{ registers }}
							</p>
						</article>
						<p class="text-sm font-bold">
							Registros
						</p>

					</div>

					<div class="flex flex-col border border-textLight rounded-md p-3 text-center">
						<article class="flex justify-center text-center gap-1">
							<span class="material-symbols-rounded text-warning">
								vital_signs
							</span>
							<p>
								{{ intensity }}
							</p>

						</article>
						<p class="text-sm font-bold">
							Intensidade Média
						</p>
					</div>

					<div class="flex border border-textLight rounded-md p-2 col-span-2 justify-center gap-0.5">
						<span class="flex material-symbols-rounded text-3xl! text-center text-sucess">
							location_on
						</span>
						<article class="flex flex-col">
							<p class="text-[10px]">
								Área mais afetada
							</p>
							<p class="text-sm font-bold">
								Cabeça
							</p>
						</article>
					</div>
				</section>
				<!--Botão-->
				<BaseButton type="submit" theme="accent" icon="add_circle" class="w-full">Criar Relatório</BaseButton>
				<!--Criar e Baixar-->
				<BaseButton type="submit" icon="download" class="w-full bg-background! text-accent! gap-1">Criar e Baixar Relatório em PDF</BaseButton>
			</form>
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
