<script setup lang="ts">
import { ref } from 'vue'
import NavBar from '@/components/NavBar.vue';
import ExamsTable from '@/components/ExamsTable.vue';

interface Exame {
	nome: string
	local: string
	data: string
	resultado: string
	icone: string
	iconeResultado: string
}

const exames = ref<Exame[]>([
	{
		nome: 'Hemograma Completo',
		local: 'Hospital Meridional',
		data: '10/05/2026',
		resultado: 'Exame Concluído',
		icone: 'bloodtype',
		iconeResultado: 'check_circle'
	},
	{
		nome: 'Raio-X',
		local: 'Hospital Meridional',
		data: '12/05/2026',
		resultado: 'Exame em andamento',
		icone: 'radiology',
		iconeResultado: 'schedule'
	},
	{
		nome: 'Exame de Urina',
		local: 'Hospital Meridional',
		data: '01/05/1967',
		resultado: 'Exame em andamento',
		icone: 'colorize',
		iconeResultado: 'schedule'
	}
])

</script>

<template class="justify-end">
	<div class="flex h-screen">
		<main class="flex h-screen overflow-hidden w-full">
			<NavBar />

			<article class="bg-background w-full h-full flex justify-center items-center p-10 overflow-hidden">
				<div class="size-full flex flex-col min-h-0">

						<p class="text-4xl text-textLight font-bold h-20.25 mb-5">Meus Exames</p>

						<div class="flex flex-col items-center justify-center">
							<section class="relative mb-3 w-full flex justify-center">
								<div class="relative flex items-center w-[56%] h-11 bg-surface rounded-sm">
									<span class="material-symbols-rounded text-primaryDark absolute left-3 pointer-events-none">
										search
									</span>

									<input type="text" placeholder="Pesquisar" class="text-primarydark placeholder-primaryDark w-full h-full outline-none pl-10"/>
								</div>
							</section>

							<section class="relative flex w-[50%] min-h-11 items-center border border-textLight text-sm text-textLight rounded-[15px] mb-5 ">
								<span class="material-symbols-rounded pointer-events-none absolute left-3">
									shield
								</span>

								<div class="w-full px-12 text-center">
									<p>
										Veja os exames que já foram concluídos ou que estão em processo.
									</p>
								</div>
							</section>

							<ExamsTable :exames="exames"/>

						</div>

				</div>
			</article>
		</main>
	</div>
</template>
