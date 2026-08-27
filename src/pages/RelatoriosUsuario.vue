<script setup lang="ts">
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

		<article class="w-[84%] h-screen ml-auto overflow-hidden">
			<div class="bg-background w-full h-full  py-[1.5%] px-[2.5%] flex flex-col min-h-0">

					<p class="text-4xl text-textlight font-bold h-20.25 mb-5">Meus Exames</p>

					<div class="flex flex-col items-center justify-center">
						<section class="relative mb-3 w-full flex justify-center">
							<div class="relative flex items-center w-[56%] h-11 bg-surface rounded-sm">
								<span class="material-symbols-rounded text-primarydark absolute left-3 pointer-events-none">
									search
								</span>

								<input type="text" placeholder="Pesquisar" class="text-primarydark placeholder-primarydark w-full h-full outline-none pl-10"/>
							</div>
						</section>

						<section class="relative flex w-[50%] min-h-11 items-center border border-textlight text-sm text-textlight rounded-[15px] mb-5 ">
							<span class="material-symbols-rounded pointer-events-none absolute left-3">
								shield
							</span>

							<div class="w-full px-12 text-center">
								<p>
									Veja os exames que já foram concluídos ou que estão em processo.
								</p>
							</div>
						</section>

						<section class="w-full flex justify-center place-items-center text-center min-h-0">
							<div class="w-[80%] max-h-[55vh] overflow-y-auto rounded-[20px] scrollbar-hide">
								<table class="bg-surface w-full">
									<thead class="text-lg text-primarydark font-bold sticky top-0 bg-surface z-10">
										<tr>
											<th class="px-4 py-3">Relatório</th>
											<th class="px-4 py-3">ID</th>
											<th class="px-4 py-3">Data</th>
											<th class="px-4 py-3">Horário</th>
										</tr>
									</thead>

									<tbody class="text-sm text-primarydark font-light">

										<tr class="border-t border-primarydark">
											<td class="px-4 py-3 font-bold flex justify-center items-center relative m-1.5">
												<span class="material-symbols-rounded text-primarydark absolute left-3">
													description
												</span>
												Dores
											</td>

											<td class="px-4 py-3">123456789/1242</td>

											<td class="px-4 py-3">01/04/2026</td>

											<td class="px-4 py-3">
												<div class="justify-center items-center relative">
													<button type="button" @click="toggle">
														<span class="material-symbols-rounded text-primarydark absolute right-2">
															{{ Show ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}
														</span>
													</button>
													14:14
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
