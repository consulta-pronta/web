<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue';
import NavBar from '@/components/NavBar.vue';
import { ref } from 'vue';

const Show = ref(false)


function toggle() {
	Show.value = !Show.value
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
							<BaseButton type="button" text="Adicionar Relatórios" icon="add_notes"></BaseButton>

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

			</div>
		</article>
	</main>
</template>
