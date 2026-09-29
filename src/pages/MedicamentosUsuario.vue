<script setup lang="ts">
import NavBar from "@/components/NavBar.vue"
import BaseInput from "@/components/bases/BaseInput.vue";

</script>

<template>
	<div class="flex h-screen">
		<NavBar />

		<main class="w-full h-full overflow-clip px-6 py-8">
			<header class="mb-4 flex flex-col gap-6">
				<h1 class="text-4xl text-textLight font-bold text-center lg:text-start">
					Meus Exames
				</h1>

				<BaseInput
					placeholder="Pesquisar"
					icon="search"
					class="place-self-center w-full md:w-120"
				/>

				<article class="w-full flex justify-center">
					<section
						class="relative flex w-[85%] md:w-[70%] lg:w-[45%] min-h-11 items-center border border-textLight text-sm text-textLight rounded-[15px]"
					>
						<span class="material-symbols-rounded pointer-events-none absolute left-3">
							shield
						</span>

						<div class="w-full text-center text-sm lg:text-[13px]">
							<p>
								Controle quais profissionais da saúde podem acessar seu histórico.
							</p>
						</div>
					</section>
				</article>
			</header>
			<section class="w-full flex justify-center place-items-center text-center min-h-0">
				<div class="w-[80%] max-h-[55vh] overflow-y-auto rounded-[20px] scrollbar-hide">
					<table class="bg-surface w-full">
						<thead class="text-lg text-primarydark font-bold sticky top-0 bg-surface z-10">
							<tr>
								<th class="px-4 py-3">Meidcamento</th>
								<th class="px-4 py-3">Quantidade</th>
								<th class="px-4 py-3">Período</th>
								<th class="px-4 py-3">Consumo</th>
								<th class="px-4 py-3">Consumido</th>
							</tr>
						</thead>

						<tbody class="text-sm text-primarydark font-light">

							<tr class="border-t border-primarydark">
								<td class="px-4 py-3 font-bold flex justify-center items-center relative m-1.5">
									<span class="material-symbols-rounded text-primarydark absolute left-3">
										medication
									</span>
									Dipirona
								</td>
								<td class="px-4 py-3">500mg</td>
								<td class="px-4 py-3">De 8 em 8 horas</td>
								<td class="px-4 py-3">Oral</td>
								<td class="px-4 py-3">
									<input type="checkbox" class="h-4 w-4 appearance-none rounded border border-background bg-transparent checked:bg-background checked:border-background"/>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

		</main>
	</div>
</template>
