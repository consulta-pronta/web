<script setup lang="ts">

import NavBar from "@/components/NavBar.vue"
import BaseInput from "@/components/bases/BaseInput.vue"
import MedicationRow from "@/components/MedicationRow.vue"

const Medicamentos = [
	{
		nome: "Dipirona",
		quantidade: "500mg",
		periodo: "De 8 em 8 horas",
		consumo: "Oral"
	},
	{
		nome: "Paracetamol",
		quantidade: "750mg",
		periodo: "De 6 em 6 horas",
		consumo: "Oral"
	},
	{
		nome: "Ibuprofeno",
		quantidade: "600mg",
		periodo: "De 12 em 12 horas",
		consumo: "Oral"
	}
]
</script>

<template>
	<div class="flex h-screen">
		<NavBar />

		<main class="w-full h-full overflow-clip px-6 py-8">
			<header class="mb-4 flex flex-col gap-6">
				<h1 class="text-4xl text-textLight font-bold text-center lg:text-start">
					Meus Medicamentos
				</h1>

				<BaseInput
					placeholder="Pesquisar"
					icon="search"
					class="place-self-center w-full md:w-120"
				/>

				<article class="w-full flex justify-center">
					<section
						class="relative grid grid-cols-[1fr_10fr] w-[85%] md:w-[60%] lg:w-[40%] min-h-11 items-center border border-textLight text-sm text-textLight rounded-[15px]"
					>
						<span class="material-symbols-rounded text-[10px] pl-5">
							shield
						</span>

						<div class="w-full text-center text-sm lg:text-sm">
							<p>
								Marque a caixa após o uso do medicamento.
							</p>
						</div>
					</section>
				</article>
			</header>
			<section class="w-full flex justify-center place-items-center text-center min-h-0">
				<div class="w-full lg:w-[85%] max-h-[55vh] overflow-y-auto rounded-[20px] scrollbar-hide">
					<table class="bg-surface w-full">
						<thead class="text-sm text-primarydark font-bold sticky top-0 bg-surface z-10">
							<tr>
								<th class="px-4 py-3">Medicamento</th>
								<th class="px-4 py-3">Quantidade</th>
								<th class="px-4 py-3">Período</th>
								<th class="px-4 py-3">Consumo</th>
								<th class="px-4 py-3">Consumido</th>
							</tr>
						</thead>

						<tbody class="text-[10px] md:text-sm text-primarydark font-light">
							<MedicationRow
								v-for="med in Medicamentos"
								:key="med.nome"
								:nome="med.nome"
								:quantidade="med.quantidade"
								:periodo="med.periodo"
								:consumo="med.consumo"
							/>
						</tbody>
					</table>
				</div>
			</section>

		</main>
	</div>
</template>
