<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue';
import FilterOrd from '@/components/FilterOrd.vue';
import NavBar from '@/components/NavBar.vue';
</script>

<template class="justify-end">

	<NavBar />

	<article class="flex justify-end">
		<div class="bg-backgroundRoxo w-[84%] min-h-screen flex justify-center place-items-center">

			<div class="w-[88%] h-[85%] bg-primaryBlue rounded-3xl py-[1.5%] px-[2.5%]">
				<!--Barra de pesquisa-->
				<section class="flex justify-center place-items-center relative mb-3">
					<div class="relative flex items-center w-[56%] h-11 bg-surface rounded-[15px]">
						<span class="material-symbols-rounded text-primarydark absolute left-3 text-[2%] pointer-events-none">
							search
						</span>
						<input type="text" placeholder="Pesquisar" class="text-primaryDark placeholder-primarydark w-full h-full outline-none pl-10">
					</div>
					<div class="absolute right-0 w-[20%]">
						<BaseButton type="button" text="Registrar Sintoma" icon="add" :border="true" borderColor="textlight" rounded="full"/>
					</div>
				</section>


				<!--Sliders-->
				<FilterOrd class="mb-3"/>
				<!--Blocos de historico-->
				<p class="text-textlight text-[24px]">4 sintomas registrados</p>

				<section class="flex h-[82.5%]">
					<div class="w-[40%] h-full flex flex-col gap-y-2 overflow-y-auto scrollbar-hide ">
						<aside class="shrink-0 h-[28%] bg-surface rounded-[10px] m-1 p-[2.5%]">
							<section class="flex w-fit justify-center items-center mb-[1.5%]">
								<p class="text-[12px] text-error mr-4">Sintoma persistente</p>
								<p class="text-[12px] flex justify-center place-items-center text-warning">
									<span class="material-symbols-rounded text-warning text-[16px]!">
										monitor_heart
									</span>
									Intensidade: 6/10
								</p>
							</section>

							<p class="text-[14px] font-bold text-primarydark mb-[2%]">Dor persistente ao levantar</p>

							<section class="flex place-items-center text-primaryBlue mb-[2.5%]">
								<span class="material-symbols-rounded text-[16px]! mr-1">
									calendar_month
								</span>
								<p class="text-[12px] mr-6">
									28/08/2008
								</p>
								<span class="material-symbols-rounded text-[16px]! mr-6">
									notes
								</span>
								<span class="material-symbols-rounded text-[16px]!">
									attach_file
								</span>
								<p class="text-[12px] mr-6">
									2
								</p>
							</section>

							<section>
								<div class="flex place-items-center text-primarydark bg-accent rounded-md w-fit p-1">
									<span class="material-symbols-rounded text-[12px]! mr-1">
										location_on
									</span>
									<p class="text-[12px]">
										Costas
									</p>
								</div>
							</section>
						</aside>

					</div>

					<div class="w-[60%]">
						a
					</div>
				</section>

			</div>

		</div>
	</article>
</template>
