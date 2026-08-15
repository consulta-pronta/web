<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue';
import FilterOrd from '@/components/FilterOrd.vue';
import NavBar from '@/components/NavBar.vue';
import SymptomBlock from '@/components/SymptomBlock.vue';
import DescBlock from '@/components/DescBlock.vue';
import { computed, ref } from 'vue'

const sintomaSelecionado = ref<number | null>(null)

const sintomas = ref([
	{
		id: 1,
		persistente: false,
		cor: 'warning',
		intensidade: '6',
		titulo: 'Dor persistente ao levantar',
		localizacao: 'Costas',

		descBlocks: [
			{
				dia: '28',
				mes: '08',
				ano: '2025',
				titulo: 'Dor ao levantar',
				desc: 'Começou durante a manhã.',
				imagem: false,
			},
			{
				dia: '30',
				mes: '08',
				ano: '2025',
				titulo: 'Dor mais intensa',
				desc: 'A dor aumentou durante o dia.',
				imagem: true,
			},
		],
	},

	{
		id: 2,
		persistente: false,
		cor: 'error',
		intensidade: '8',
		titulo: 'Dor no braço',
		localizacao: 'Braço',

		descBlocks: [
			{
				dia: '15',
				mes: '08',
				ano: '2026',
				titulo: 'Dor no braço',
				desc: 'Descrição da primeira ocorrência.',
				imagem: true,
			},
			{
				dia: '20',
				mes: '08',
				ano: '2026',
				titulo: 'Dor no braço novamente',
				desc: 'A dor voltou após alguns dias.',
				imagem: false,
			},
		],
	},

	{
		id: 3,
		persistente: false,
		cor: 'warning',
		intensidade: '5',
		titulo: 'Dor de cabeça',
		localizacao: 'Cabeça',

		descBlocks: [
			{
				dia: '10',
				mes: '08',
				ano: '2026',
				titulo: 'Dor de cabeça',
				desc: 'Dor leve pela manhã.',
				imagem: true,
			},
		],
	},
])

const sintomaAtual = computed(() => {
	return sintomas.value.find(
		sintoma => sintoma.id === sintomaSelecionado.value
	) ?? null
})

function toggleDesc(id: number) {
	if (sintomaSelecionado.value === id) {
		sintomaSelecionado.value = null
	} else {
		sintomaSelecionado.value = id
	}
}
</script>

<template class="justify-end">

	<NavBar />

	<article class="w-[84%] h-screen ml-auto overflow-hidden">
		<div class="bg-backgroundRoxo w-full h-full flex justify-center items-center overflow-hidden">

			<div class="w-[88%] h-[85%] bg-primaryBlue rounded-3xl py-[1.5%] px-[2.5%] flex flex-col min-h-0">
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

				<!--Blocos de historicos-->
				<p class="text-textlight text-[24px]">4 sintomas registrados</p>

				<section class="flex h-[82.5%]">
					<div class="w-[40%] h-full flex flex-col gap-y-2 overflow-y-auto scrollbar-hide">
						<SymptomBlock
							v-for="sintoma in sintomas"
							:key="sintoma.id"
							:sintoma-persistente="sintoma.persistente"
							:Cor="sintoma.cor"
							:intensidade="sintoma.intensidade"
							:titulo="sintoma.titulo"
							:dia="sintoma.descBlocks[0]?.dia"
							:mes="sintoma.descBlocks[0]?.mes"
							:ano="sintoma.descBlocks[0]?.ano"
							:localizacao="sintoma.localizacao"
							@toggle="toggleDesc(sintoma.id)"
						/>
					</div>
					<!--Especificado-->
					<div class="w-[60%] h-full flex flex-col min-h-0" v-if="sintomaSelecionado !== null">
						<section class="flex justify-center items-center w-full h-[9%] relative mb-3 shrink-0">
							<span class="material-symbols-rounded absolute left-0 text-[38px]! text-textlight">
								arrow_back
							</span>
							<div class="flex justify-center w-[88%] h-full bg-surface place-items-center rounded-md">
								<span class="material-symbols-rounded text-primarydark pointer-events-none mr-1">
									edit
								</span>
								<p class="text-[18px] text-primarydark text-semibold">Editar sintomas</p>
							</div>
						</section>

						<div v-if="sintomaAtual" class="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
							<DescBlock
								v-for="desc in sintomaAtual.descBlocks"
								:key="desc.dia + desc.mes + desc.ano + desc.titulo"
								:dia="desc.dia"
								:mes="desc.mes"
								:ano="desc.ano"
								:title="desc.titulo"
								:desc="desc.desc"
								:imagem="desc.imagem"
							/>
						</div>

					</div>
				</section>

			</div>

		</div>
	</article>
</template>
