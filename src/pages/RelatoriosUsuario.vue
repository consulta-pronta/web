<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue';
import BaseInput from '@/components/BaseInput.vue'
import NavBar from '@/components/NavBar.vue';
import { ref } from 'vue';

const Show = ref(false)

const AddRelatorio = ref(false)

const registers = ref(1)

const intensity = ref(6.7)


function toggle() {
	Show.value = !Show.value
}

function toggleAdicao() {
	AddRelatorio.value = !AddRelatorio.value
}

</script>

<template class="justify-end">
	<main class="flex h-screen overflow-hidden">
		<NavBar />

		<article class="flex-1 min-w-0 h-screen overflow-hidden">
			<div class="bg-background w-full h-full  py-[1.5%] px-[2.5%] flex flex-col min-h-0">

					<p class="text-4xl text-textLight font-bold h-20.25 mb-5">Meus Relatórios</p>

					<div class="flex flex-col items-center justify-center">

						<section class="relative mb-3 w-full flex justify-center">
							<BaseButton type="button" text="Adicionar Relatórios" icon="add_notes" @click="toggleAdicao"></BaseButton>

							<div class="relative flex items-center w-[42%] h-11 bg-surface rounded-sm mx-4">
								<span class="material-symbols-rounded text-primarydark absolute left-3 pointer-events-none">
									search
								</span>

								<input type="text" placeholder="Pesquisar" class="text-primaryDark placeholder-primaryDark w-full h-full outline-none pl-10"/>
							</div>

							<BaseButton type="button" theme="dark" text="Exportar Relatórios" icon="download" class="text-textLight"></BaseButton>

						</section>

						<section class="w-full flex justify-center place-items-center text-center min-h-0">
							<div class="w-[80%] max-h-[55vh] overflow-y-auto rounded-[20px] scrollbar-hide">
								<table class="bg-surface w-full">
									<thead class="text-lg text-primaryDark font-bold sticky top-0 bg-surface z-10">
										<tr>
											<th class="px-4 py-3">Relatório</th>
											<th class="px-4 py-3">ID</th>
											<th class="px-4 py-3">Data</th>
											<th class="px-4 py-3">Horário</th>
										</tr>
									</thead>

									<tbody class="text-sm text-primaryDark font-light">

										<tr class="border-t border-primaryDark">
											<td class="px-4 py-3 font-bold flex justify-center items-center relative m-1.5">
												<span class="material-symbols-rounded text-primarydark absolute left-3">
													description
												</span>
												Dores
											</td>

											<td class="px-4 py-3">123456789/1242</td>

											<td class="px-4 py-3">01/04/2026</td>

											<td class="px-4 py-3">
												<div class="flex justify-center items-center relative">
													14:14
													<button type="button" @click="toggle"  class="absolute right-2 cursor-pointer">
														<span class="material-symbols-rounded text-primaryDark">
															{{ Show ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}
														</span>
													</button>

												</div>
											</td>
										</tr>
										<tr v-if="Show === true" class="col-span-4 text-sm">
											<td colspan="4">
												<div class="flex justify-between px-8 py-4">
													<button type="button" class="text-primaryDark cursor-pointer">
														<span class="material-symbols-rounded text-sm!">
															download
														</span>
														Baixar Relatório
													</button>
													<button type="button" class="text-primaryDark cursor-pointer">
														<span class="material-symbols-rounded text-sm!">
															shield_toggle
														</span>
														Profissionais Permitidos
													</button>
													<button type="button" class="text-primaryDark cursor-pointer">
														<span class="material-symbols-rounded text-sm!">
															edit_square
														</span>
														Renomear Relatório
													</button>
													<button type="button" class="text-primaryDark cursor-pointer">
														<span class="material-symbols-rounded text-sm!">
															delete
														</span>
														Apagar Relatório
													</button>
													<button type="button" class="text-primaryDark cursor-pointer">
														<span class="material-symbols-rounded text-sm!">
															lock
														</span>
														Definir Senha
													</button>
													<button type="button" class="text-primaryDark cursor-pointer">
														<span class="material-symbols-rounded text-sm!">
															visibility
														</span>
														Visualizar Relatório
													</button>
												</div>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</section>
				</div>
				<section v-if="AddRelatorio === true" class="dialog">
					<form class="bg-background w-[45%] h-[95%] rounded-[25px] px-15 py-5 flex flex-col place-items-center relative">
						<!--Seta de Retorno-->
						<button type="button" @click="toggleAdicao">
							<span class="material-symbols-rounded absolute left-0 text-[38px]! text-textLight ml-4 cursor-pointer">
								arrow_back
							</span>
						</button>
						<p class="text-textLight text-2xl text-semibold mb-2">
							Gerar Relatório
						</p>
						<p class="text-textLight text-sm text-medium mb-1">
							Gere um relatório completo do seus sintomas para compartilhar com seu médico.
						</p>
						<!--Barra de Pesquisa-->
						<div class="relative flex items-center w-full h-11 bg-surface rounded-sm mx-4 my-3">
							<span class="material-symbols-rounded text-primaryDark absolute left-3 pointer-events-none">
								content_paste
							</span>
							<input type="text" placeholder="Título do Relatório" class="text-primaryDark placeholder-primaryDark w-full h-full outline-none pl-10 opacity-50"/>
						</div>
						<!--Data-->
						<section class="w-full bg-surface rounded-md mb-4">
							<article class="relative py-3">
								<span class="material-symbols-rounded text-primaryDark absolute left-3 pointer-events-none">
									calendar_today
								</span>
								<p class="text-primaryDark text-base text-semibold mb-1 pl-10">
									Período
								</p>
							</article>

							<article class="flex w-full mb-1 gap-2 p-2">
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
						<div class="relative w-full mb-4">
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
						<BaseButton type="button" theme="dark" text="Visualizar Sintomas Incluídos" class="bg-primary w-full text-textLight mb-4 rounded-[25px]"/>
						<!--Resumo do Período-->
						<section class="grid grid-cols-2 gap-4 w-full text-textLight">
							<div class="col-span-2">
								<p class="text-textLight text-base font-bold">
									Resumo do Período
								</p>
							</div>

							<div class="flex flex-col border border-textLight rounded-md p-5 text-center ">

								<article class="flex justify-center text-center gap-1">
									<span class="material-symbols-rounded">
										book_4
									</span>
									<p>
										{{ registers }}
									</p>
								</article>
								<p class="text-base font-bold">
									Registros
								</p>

							</div>

							<div class="flex flex-col border border-textLight rounded-md p-5 text-center">
								<article class="flex justify-center text-center gap-1">
									<span class="material-symbols-rounded text-warning">
										vital_signs
									</span>
									<p>
										{{ intensity }}
									</p>

								</article>
								<p class="text-base font-bold">
									Intensidade Média
								</p>
							</div>

							<div class="flex border border-textLight rounded-md p-3 col-span-2 justify-center gap-0.5">
								<span class="flex material-symbols-rounded text-4xl! text-center text-sucess">
									location_on
								</span>
								<article class="flex flex-col">
									<p class="text-xs">
										Área mais afetada
									</p>
									<p class="text-base font-bold">
										Cabeça
									</p>
								</article>
							</div>
						</section>
						<!--Botão-->
						<BaseButton type="submit" icon="add_circle" class="mt-4 w-[80%] gap-1">Criar Relatório</BaseButton>
						<!--Criar e Baixar-->
						<BaseButton type="submit" icon="download" class="mt-4 w-[80%] bg-background! text-accent! gap-1">Criar e Baixar Relatório em PDF</BaseButton>

					</form>
				</section>
			</div>
		</article>
	</main>
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
</style>
