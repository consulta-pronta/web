<script setup lang="ts">
import BaseButton from '@/components/bases/BaseButton.vue'
import BaseInput from "@/components/bases/BaseInput.vue"
import NavBar from '@/components/NavBar.vue'
import UserPhoto from '@/components/UserPhoto.vue'
import { ref } from 'vue';

const AddRelatorio = ref(false)

const VisuRelatorio = ref(false)

const AddRenomear = ref(false)

const AddSenha = ref(false)

const AddPermissao = ref(false)

const registers = ref(1)

const intensity = ref(6.7)

function toggleAdicao() {
	AddRelatorio.value = !AddRelatorio.value
}

function toggleVisu() {
	VisuRelatorio.value = !VisuRelatorio.value
}

function toggleName() {
	AddRenomear.value = !AddRenomear.value
}

function togglePassword() {
	AddSenha.value = !AddSenha.value
}

function togglePermissao() {
	AddPermissao.value = !AddPermissao.value
}

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

function toggle(relatorio: Relatorio) {
	relatorio.Show = !relatorio.Show
}

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
					<BaseButton type="button" theme="accent" icon="add_notes" @click="toggleAdicao" class="col-span-3 rounded-2xl">
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
							Adicionar Relatórios
						</p>
					</BaseButton>
				</section>
			</header>

			<div class="w-full max-h-[55vh] overflow-y-auto rounded-xl scrollbar-hide">
				<table class="w-full text-textDark bg-surface">
					<thead class="font-bold sticky top-0 z-10">
						<tr class="bg-surface shadow-[inset_0_-2px_0_var(--color-primaryDark)]">
							<th>Relatório</th>
							<th>ID</th>
							<th>Data</th>
							<th>Horário</th>
						</tr>
					</thead>

					<tbody>
						<template v-for="relatorio in relatorios.concat(relatorios).concat(relatorios).concat(relatorios).concat(relatorios).concat(relatorios)" :key="relatorio.id">
							<tr class="border-t border-primaryDark">
								<td class="font-bold flex justify-center items-center relative m-1.5">
									<span class="material-symbols-rounded text-base! md:text-2xl! text-primarydark absolute left-1 md:left-3">
										description
									</span>
									<p>
										{{ relatorio.nome }}
									</p>
								</td>

								<td>{{ relatorio.id }}</td>

								<td>{{ relatorio.data }}</td>

								<td>
									<div class="flex justify-center items-center relative">
										{{ relatorio.horario }}
										<button type="button" @click="toggle(relatorio)" class="absolute right-1 md:right-2 cursor-pointer">
											<span class="material-symbols-rounded text-primaryDark">
												{{ relatorio.Show ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}
											</span>
										</button>
									</div>
								</td>
							</tr>

							<tr v-if="relatorio.Show === true" class="col-span-4 text-sm">
								<td colspan="4">
									<div class="flex justify-between px-16 lg:px-8 py-4">
										<button type="button" class="flex flex-col text-primaryDark cursor-pointer">
											<span class="material-symbols-rounded text-2xl! lg:text-sm!">
												download
											</span>
											<p class="hidden lg:block text-xs">
												Baixar Relatório
											</p>
										</button>

										<button type="button" class="flex flex-col text-primaryDark cursor-pointer" @click="togglePermissao">
											<span class="material-symbols-rounded text-2xl! lg:text-sm!">
												shield_toggle
											</span>
											<p class="hidden lg:block text-xs">
												Profissionais Permitidos
											</p>
										</button>

										<button type="button" class="flex flex-col text-primaryDark cursor-pointer" @click="toggleName">
											<span class="material-symbols-rounded text-2xl! lg:text-sm!">
												edit_square
											</span>
											<p class="hidden lg:block text-2xl! lg:text-xs!">
												Renomear Relatório
											</p>
										</button>

										<button type="button" class="flex flex-col text-primaryDark cursor-pointer">
											<span class="material-symbols-rounded text-2xl! lg:text-sm!">
												delete
											</span>
											<p class="hidden lg:block text-xs">
												Apagar Relatório
											</p>
										</button>

										<button type="button" class="flex flex-col text-primaryDark cursor-pointer" @click="togglePassword">
											<span class="material-symbols-rounded text-2xl! lg:text-sm!">
												lock
											</span>
											<p class="hidden lg:block text-xs!">
												Definir Senha
											</p>
										</button>

										<button type="button" class="flex flex-col text-primaryDark cursor-pointer" @click="toggleVisu">
											<span class="material-symbols-rounded text-2xl! lg:text-sm!">
												visibility
											</span>
											<p class="hidden lg:block text-xs!">
												Visualizar Relatório
											</p>
										</button>
									</div>
								</td>
							</tr>

						</template>

					</tbody>
				</table>
			</div>

			<!--Layout Registro-->
			<section v-if="AddRelatorio === true" class="dialog">
				<form class="bg-background lg:w-[45%] h-[95%] rounded-[25px] px-15 py-5 flex flex-col place-items-center relative">
					<!--Seta de Retorno-->
					<button type="button" @click="toggleAdicao">
						<span class="material-symbols-rounded absolute left-0 text-[38px]! text-textLight ml-4 cursor-pointer">
							arrow_back
						</span>
					</button>
					<p class="text-textLight text-xl text-bold mb-2">
						Gerar Relatório
					</p>
					<p class="text-textLight text-xs text-medium">
						Gere um relatório completo do seus sintomas para compartilhar com seu médico.
					</p>
					<!--Barra de Pesquisa-->
					<div class="relative flex items-center w-full h-11 bg-surface rounded-sm mx-2 my-3">
						<span class="material-symbols-rounded text-primaryDark absolute left-3 pointer-events-none">
							content_paste
						</span>
						<input type="text" placeholder="Título do Relatório" class="text-primaryDark placeholder-primaryDark w-full h-11 outline-none pl-10 opacity-50"/>
					</div>
					<!--Data-->
					<section class="w-full bg-surface rounded-md mb-2">
						<article class="relative py-2">
							<span class="material-symbols-rounded text-primaryDark absolute left-3 pointer-events-none">
								calendar_today
							</span>
							<p class="text-primaryDark text-base text-semibold mb-1 pl-10">
								Período
							</p>
						</article>

						<article class="flex w-full mb-1 gap-2 px-2">
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
					<div class="relative w-full mb-2">
						<span class="material-symbols-rounded absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
							expand_more
						</span>
						<select name="intensidade" required class="w-full h-11 rounded-md bg-surface text-primaryDark px-4 appearance-none outline-none">
							<option value="" disabled selected>
								Profissionais que podem visualizar
							</option>
							<option value="1">Cláudio Silva</option>
						</select>
					</div>
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
					<BaseButton type="submit" theme="accent" icon="add_circle" class="mt-2 w-[80%] gap-1">Criar Relatório</BaseButton>
					<!--Criar e Baixar-->
					<BaseButton type="submit" icon="download" class="mt-2 w-[80%] bg-background! text-accent! gap-1">Criar e Baixar Relatório em PDF</BaseButton>
				</form>
			</section>
			<!--Fim Layout Registro-->


			<section v-if="VisuRelatorio === true" class="dialog">
				<form class="bg-background w-[95%] md:w-[70%] lg:w-[55%] h-[95%] rounded-[25px] px-10 py-6">
					<article class=" overflow-y-auto flex flex-col border border-textLight w-full h-full relative rounded-2xl scrollbar-hide">
						<!--Seta de Retorno-->
						<button type="button" @click="toggleVisu" class="flex justify-start sticky top-0 left z-50 self-start cursor-pointer bg-background w-full">
							<span class="material-symbols-rounded text-[30px]! w-fit text-textLight m-3 cursor-pointer">
								arrow_back
							</span>
						</button>

						<!--Textos-->
						<p class="text-textLight text-2xl font-bold mx-4">
							Dor Constante
						</p>
						<p class="text-textLight text-base font-light italic mx-4">
							Relatório: ID51966
						</p>
						<span class="flex">
							<p class="text-textLight text-base font-bold mx-4">
								Período:
							</p>
							<p class="text-textLight text-base font-normal mx-0.5">
								10 de abr 2026 a 18 abr 2026
							</p>
						</span>
						<span class="flex">
							<p class="text-textLight text-base font-bold mx-4">
								Duração:
							</p>
							<p class="text-textLight text-base font-normal mx-0.5">
								8 dias (20 dias)
							</p>
						</span>

						<!--Paciente-->
						<section class="flex just mx-3 mt-3">
							<UserPhoto/>
							<article class="flex flex-col justify-center mx-4">
								<p class="text-textLight text-base font-bold">
									Cláudio Silva
								</p>
								<p class="text-textLight text-xs">
									claudiosilva213@email.com
								</p>
								<p class="text-textLight text-xs">
									(27) 99722-3725
								</p>
							</article>
						</section>

						<!--Informações-->
						<p class="text-textLight text-xl font-bold mx-4 mt-2">
							Resumo Geral
						</p>
						<section class="grid grid-cols-2 gap-2 mx-4 mt-1 w-[95%] h-[18%] text-background">
							<div class="bg-surface rounded-xl flex flex-col p-2.5">
								<p class="text-sm font-medium">
									Sintoma mais comum:
								</p>
								<p class="text-xl font-bold">
									Dor nas costas
								</p>
								<p class="text-sm font-medium">
									2 semanas
								</p>
								<div class="flex bg-error rounded-3xl text-surface mt-1 w-[55%] md:w-[60%] lg:w-[45%] h-[30%] md:h-[35%] lg:h-[45%] items-center">
									<span class="material-symbols-rounded text-xs! mx-1.5">
										warning
									</span>
									<p class="text-xs p-2 md:p-1 lg:p-0.5">
										Prioridade Alta
									</p>
								</div>
							</div>

							<div class="flex flex-col bg-surface text-background rounded-xl p-2.5">
								<span class="flex">
									<p class="text-base font-bold mx-4">
										10/04:
									</p>
									<p class="text-error text-base font-normal mx-0.5">
										8 de intensidade
									</p>
								</span>
								<span class="flex">
									<p class="text-base font-bold mx-4">
										12/04:
									</p>
									<p class="text-sucess text-base font-normal mx-0.5">
										4 de intensidade
									</p>
								</span>
								<span class="flex">
									<p class="text-base font-bold mx-4">
										14/04:
									</p>
									<p class="text-warning text-base font-normal mx-0.5">
										5 de intensidade
									</p>
								</span>
							</div>
						</section>

						<!--Cronologia-->
						<p class="text-textLight text-xl font-bold mx-4 mt-10 md:mt-12 lg:mt-8">
							Cronologia do Sintoma
						</p>

						<section class="flex flex-col p-4 max-h-full">

							<div class="flex">
								<article class="flex flex-col justify-center items-center w-[10%]">
									<div class="flex justify-center items-center">
										<span class="material-symbols-rounded bg-primaryLight text-background rounded-full">
											vital_signs
										</span>
									</div>
									<hr class="flex-1 w-px bg-primaryLight border-0">
								</article>
								<article class="flex flex-col w-[90%] h-[90%] bg-surface text-background rounded-lg p-3">
									<p class="text-lg font-bold">
										Dor nas costas ao levantar peso
									</p>
									<p class="text-sm font-medium">
										(16 abr. 2026)
									</p>
									<p class="text-sm font-medium">
										- Intensidade 6/10; "Começa a doer um pouco despois de eu levantar, mas para de doer em pouco tempo."
									</p>
								</article>
							</div>

							<div class="flex">
								<article class="flex flex-col justify-center items-center w-[10%]">
									<div class="flex justify-center items-center">
										<span class="material-symbols-rounded bg-primaryLight text-background rounded-full">
											vital_signs
										</span>
									</div>
									<hr class="flex-1 w-px bg-primaryLight border-0">
								</article>
								<article class="flex flex-col w-[90%] h-[90%] bg-surface text-background rounded-lg p-3">
									<p class="text-lg font-bold">
										Dor nas costas ao levantar peso
									</p>
									<p class="text-sm font-medium">
										(16 abr. 2026)
									</p>
									<p class="text-sm font-medium">
										- Intensidade 6/10; "Começa a doer um pouco despois de eu levantar, mas para de doer em pouco tempo."
									</p>
								</article>
							</div>

							<div class="flex">
								<article class="flex flex-col justify-center items-center w-[10%]">
									<div class="flex justify-center items-center">
										<span class="material-symbols-rounded bg-primaryLight text-background rounded-full">
											vital_signs
										</span>
									</div>
									<hr class="flex-1 w-px bg-primaryLight border-0">
								</article>
								<article class="flex flex-col w-[90%] h-[90%] bg-surface text-background rounded-lg p-3">
									<p class="text-lg font-bold">
										Dor nas costas ao levantar peso
									</p>
									<p class="text-sm font-medium">
										(16 abr. 2026)
									</p>
									<p class="text-sm font-medium">
										- Intensidade 6/10; "Começa a doer um pouco despois de eu levantar, mas para de doer em pouco tempo."
									</p>
								</article>
							</div>

							<!--Visão geral-->
							<p class="text-textLight text-xl font-bold mx-4 mt-2">
								Visão Geral
							</p>

							<article class="flex justify-center w-full">
								<table class="w-[95%] border-separate border-spacing-0.5">
									<thead class="gap-0.5 text-background font-semibold">
										<tr>
											<th class="bg-surface">Sintoma</th>
											<th class="bg-surface">Duração</th>
											<th class="bg-surface">Ocorrência</th>
										</tr>
									</thead>
									<tbody class="gap-0.5 text-background">
										<tr>
											<th class="bg-textLight">Dor nas Costas</th>
											<th class="bg-textLight">20 dias</th>
											<th class="bg-textLight">9 Ocorrências</th>
										</tr>
										<tr>
											<th class="bg-textLight">Estômago Ardendo</th>
											<th class="bg-textLight">4 dias</th>
											<th class="bg-textLight">3 Ocorrências</th>
										</tr>
									</tbody>
								</table>
							</article>
						</section>
					</article>
				</form>
			</section>

			<!--Renomear-->
			<section v-if="AddRenomear === true" class="dialog">
				<form class="bg-primary lg:w-[45%] h-[30%] rounded-[25px] px-15 py-5 flex flex-col place-items-center relative">
					<button type="button" @click="toggleName">
						<span class="material-symbols-rounded absolute left-0 text-[38px]! text-textLight ml-4 cursor-pointer">
							arrow_back
						</span>
					</button>
					<p class="text-textLight text-2xl text-semibold mb-6">
						Renomear Relatório
					</p>

					<div class="relative flex items-center w-full h-11 bg-surface rounded-sm mx-4 mb-4">
						<span class="material-symbols-rounded text-primarydark absolute left-3 pointer-events-none">
							edit_square
						</span>
						<input type="text" placeholder="Nome" class="text-primaryDark placeholder-primaryDark w-full h-full outline-none pl-10"/>
					</div>

					<BaseButton type="submit" theme="accent" class="mt-2 w-[60%] gap-1">Mudar Nome</BaseButton>

				</form>
			</section>

			<!--Mudar Senha-->
			<section v-if="AddSenha === true" class="dialog">
				<form class="bg-primary w-[70%] lg:w-[45%] h-[35%] rounded-[25px] px-15 py-5 flex flex-col place-items-center relative">
					<button type="button" @click="togglePassword">
						<span class="material-symbols-rounded absolute left-0 text-[38px]! text-textLight ml-4 cursor-pointer">
							arrow_back
						</span>
					</button>
					<p class="text-textLight text-2xl text-semibold mb-6">
						Digite sua nova senha
					</p>

					<div class="relative flex items-center w-full h-11 bg-surface rounded-sm mx-4 mb-2">
						<span class="material-symbols-rounded text-primaryDark absolute left-3 pointer-events-none">
							lock
						</span>
						<input type="password" placeholder="Senha" class="text-primaryDark placeholder-primaryDark w-full h-full outline-none pl-10"/>
					</div>
					<div class="relative flex items-center w-full h-11 bg-surface rounded-sm mx-4 mb-4">
						<span class="material-symbols-rounded text-primaryDark absolute left-3 pointer-events-none">
							lock
						</span>
						<input type="password" placeholder="Digite Novamente" class="text-primaryDark placeholder-primaryDark w-full h-full outline-none pl-10"/>
					</div>

					<BaseButton type="submit" theme="accent" class="mt-2 w-[60%] gap-1">Mudar Senha</BaseButton>

				</form>
			</section>

			<section v-if="AddPermissao === true" class="dialog">
				<form class="bg-primary w-[70%] lg:w-[45%] h-[40%] rounded-[25px] px-10 py-5 flex flex-col place-items-center relative">
					<!-- Seta de retorno -->
					<button type="button" @click="togglePermissao">
						<span class="material-symbols-rounded absolute left-0 top-0 text-[30px]! text-textLight m-4 cursor-pointer" >
							arrow_back
						</span>
					</button>

					<!-- Título -->
					<div class="flex flex-col items-center mb-3">
						<span class="material-symbols-rounded text-[30px]! text-textLight">
							admin_panel_settings
						</span>
						<p class="text-textLight text-xl font-semibold">
							Permissões de visualização
						</p>
					</div>

					<!-- Permissões -->
					<div class="flex flex-col gap-2 w-full">
						<label class="flex items-center w-full h-11 bg-surface rounded-md px-3 cursor-pointer">
							<input type="checkbox" class="w-4 h-4 mr-3 accent-primary"/>
							<span class="text-primaryDark text-sm">
								Dra. Cláudia Leite
							</span>
						</label>

						<label class="flex items-center w-full h-11 bg-surface rounded-md px-3 cursor-pointer">
							<input type="checkbox" class="w-4 h-4 mr-3 accent-primary"/>
							<span class="text-primaryDark text-sm">
								Dr. Auzio Varella
							</span>
						</label>

					</div>

					<BaseButton type="submit" theme="accent" class="mt-4 w-[60%] gap-1">Salvar</BaseButton>

				</form>
			</section>
		</main>
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
