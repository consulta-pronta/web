<script setup lang="ts">
import { ref } from "vue"
import NavBar from "@/components/NavBar.vue"
import FilterOrd from "@/components/FilterOrd.vue";
import BaseButton from "@/components/bases/BaseButton.vue";

</script>

<template>
	<div class="flex h-screen">
		<NavBar />

		<main class="w-full h-full overflow-y-auto px-6 py-8">
			<header class="mb-8 flex flex-col gap-8">
				<h1 class="text-4xl text-textLight font-bold text-center lg:text-start">
					Consultas
				</h1>
			</header>

			<article>
				<section class="grid grid-cols-1 gap-4">
					<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
						<div class="border border-textLight rounded-xl p-6 flex flex-col text-center">
							<p class="text-base text-textLight font-bold text-start">
								Próxima Consulta
							</p>

							<div class="flex flex-col items-center gap-2 mt-4">
								<h2 class="text-2xl text-textLight font-bold">Cláudio Silva</h2>

								<span class="flex items-center gap-2 text-sm text-textLight">
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
										<rect x="4" y="5" width="16" height="16" rx="2" stroke="currentColor" stroke-width="1.8" />
										<path d="M8 3v4M16 3v4M4 10h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
									</svg>
									18 de jun. de 2026
								</span>

								<span class="flex items-center gap-2 text-sm text-textLight">
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
										<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8" />
										<path d="M12 7v5l3.5 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
									</svg>
									14:30
								</span>

								<span class="flex items-center gap-2 text-sm font-bold text-green-400">
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
										<circle cx="12" cy="12" r="10" fill="currentColor" />
										<path d="m7.5 12.5 3 3 6-6.5" stroke="#1c1840" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
									</svg>
									Confirmado
								</span>
							</div>

							<button
								class="mt-6 self-center bg-[#e6d5b0] text-[#1c1840] text-sm font-medium rounded-full px-8 py-2 hover:opacity-90 transition-opacity"
							>
								Iniciar Consulta
							</button>
						</div>

						<div class="border border-textLight rounded-xl p-6 flex flex-col">
							<p class="text-base text-textLight font-bold text-start">
								Solicitações de Consulta
							</p>

							<article class="relative mt-4 flex-1 min-h-40 border border-textLight rounded-2xl">
								<section class="absolute inset-0 overflow-y-auto scrollbar-hide">
									<div class="flex items-center gap-3 px-3 py-2 border-b border-textLight">
										<div
											class="w-10 h-10 rounded-full border border-textLight flex-shrink-0 flex items-center justify-center text-sm font-bold text-textLight"
										>
											C
										</div>

										<div class="flex-1 min-w-0 flex flex-col">
											<span class="text-sm text-textLight font-bold">Cláudio Silva</span>
											<span class="text-xs text-textLight">Local: Hospital Dorio Silva</span>
											<span class="text-xs text-[#e6d5b0]">
												Solicitado para o dia 08/10/2026 às 16:00
											</span>
										</div>

										<button
											class="flex-shrink-0 border border-textLight text-textLight text-sm rounded-full px-5 py-1.5 hover:bg-white/10 transition-colors"
										>
											Visualizar
										</button>
									</div>
								</section>
							</article>
						</div>
					</div>

					<div class="border border-textLight rounded-xl p-6">
						<div class="flex justify-between">
							<p class="text-base text-textLight font-bold text-start">
								Consultas
							</p>
							<FilterOrd :filter="false" />
						</div>

						<div class="w-full flex flex-col items-center">
							<div class="w-full mt-3 border border-textLight rounded-[20px] overflow-hidden text-textLight text-sm">

								<div class="grid grid-cols-4 py-1.5 font-bold text-center">
									<span>Paciente</span>
									<span>Data</span>
									<span>Horário</span>
									<span>Local</span>
								</div>

								<div class="max-h-[15vh] overflow-y-auto scrollbar-hide">

									<div class="grid grid-cols-4 items-center border-t border-textLight px-2 py-3 text-center">
										<div class="flex items-center gap-3">
											<div class="w-9 h-9 rounded-full border border-textLight flex-shrink-0 flex items-center justify-center font-bold">
												J
											</div>
											<span class="font-bold">Joana Neto</span>
										</div>
										<span>01/10/2026</span>
										<span>16:00</span>
										<span>Local: Hospital Dório Silva</span>
									</div>

									<div class="grid grid-cols-4 items-center border-t border-textLight px-2 py-3 text-center">
										<div class="flex items-center gap-3">
											<div class="w-9 h-9 rounded-full border border-textLight flex-shrink-0 flex items-center justify-center font-bold">
												R
											</div>
											<span class="font-bold">Ronald Jr.</span>
										</div>
										<span>02/11/2026</span>
										<span>06:00</span>
										<span>Local: Hospital Dório Silva</span>
									</div>

								</div>
							</div>

							<BaseButton
								theme="textLight"
								mode="outline"
								icon="add_circle_outline"
								icon-position="right"
								class="h-7 rounded-full! border px-3 text-base mt-3"
							>
								Propor nova consulta
							</BaseButton>
						</div>
					</div>
				</section>
			</article>
		</main>
	</div>
</template>
