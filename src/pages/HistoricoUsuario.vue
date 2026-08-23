<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue';
import FilterOrd from '@/components/FilterOrd.vue';
import NavBar from '@/components/NavBar.vue';
import SymptomBlock from '@/components/SymptomBlock.vue';
import DescBlock from '@/components/DescBlock.vue';
import { computed, ref } from 'vue'
import BaseInput from '@/components/BaseInput.vue';

const sintomaSelecionado = ref<number | null>(null)
const sobre = ref(false)
const editar = ref(false)

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
		cor: 'sucess',
		intensidade: '2',
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

function toggleSobre() {
	sobre.value = !sobre.value
}
function toggleEditar() {
	editar.value = !editar.value
}

function registrarSintoma(event: Event) {
	const form = event.target as HTMLFormElement
	const dados = new FormData(form)

	console.log(dados.get('resumo'))
	console.log(dados.get('descricao'))
	console.log(dados.get('data'))
	console.log(dados.get('horario'))
	console.log(dados.get('localizacao'))
	console.log(dados.get('intensidade'))
	console.log(dados.get('arquivo'))
}

</script>

<template>
	<main class="flex h-screen overflow-hidden">
		<NavBar />

		<div class="bg-background w-full h-full flex justify-center items-center overflow-hidden">

			<div class="w-[88%] h-[85%] bg-primary rounded-3xl py-[1.5%] px-[2.5%] flex flex-col min-h-0">
				<!--Barra de pesquisa-->
				<section class="flex justify-center place-items-center relative mb-3">
					<div class="relative flex items-center w-[56%] h-11 bg-surface rounded-[15px]"> <!--Não existe um padrão para 15px-->
						<span class="material-symbols-rounded text-primaryDark absolute left-3 pointer-events-none">
							search
						</span>
						<input type="text" placeholder="Pesquisar" class="text-primaryDark placeholder-primaryDark w-full h-full outline-none pl-10">
					</div>
					<!--Botão de registrar sintoma-->
					<div class="absolute right-0 w-[20%]">
						<BaseButton type="button" text="Registrar Sintoma" icon="add" :border="true" borderColor="textLight" rounded="full" @click="toggleSobre" textColor="textLight"/>
					</div>
				</section>

				<div v-if="sobre === true" class="absolute inset-0 z-50 bg-black/50 w-full h-full flex justify-center place-items-center">
					<form class="bg-background w-[35%] h-[95%] rounded-3xl px-15 py-5 flex flex-col place-items-center relative" @submit.prevent="registrarSintoma">
						<button type="button" @click="toggleSobre">
							<span class="material-symbols-rounded absolute left-0 text-4xl! text-textLight ml-4 cursor-pointer">
								arrow_back
							</span>
						</button>
						<p class="text-textLight text-2xl text-semibold mb-2">
							Registrar Sintoma
						</p>
						<p class="text-textLight text-sm text-medium mb-1">
							O que você está sentindo?
						</p>
						<BaseInput type="text" name="resumo" placeholder="Resuma seus sintomas" bgColor="textLight" textColor="primaryDark" />
						<p class="text-textLight text-sm text-medium mb-1">
							Explique com mais detalhes
						</p>
						<BaseInput type="text" name="descricao" placeholder="Descreva seus sintomas com mais detalhes" bgColor="textLight" textColor="primaryDark" />
						<p class="text-textLight text-sm text-medium mb-1">
							Quando começou?
						</p>
						<section class="flex w-full mb-1">
							<span class="flex-1">
								<BaseInput type="date" name="data" bgColor="textLight" textColor="primaryDark" px="0" class="pr-2 m-0" />
							</span>
							<span class="flex-1">
								<BaseInput type="time" name="horario" bgColor="textLight" textColor="primaryDark" px="0" />
							</span>
						</section>
						<p class="text-textLight text-sm text-medium mb-1">
							Em qual parte do corpo?
						</p>
						<div class="relative w-full mb-1">
							<span class="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-xl pointer-events-none">
								location_on
							</span>

							<select name="localizacao" required class="w-full h-11 rounded-md bg-textLight text-primaryDark pl-10 pr-8 appearance-none outline-none">
								<option value="" disabled selected>
									Localização
								</option>
								<option value="Costas">Costas</option>
								<option value="Braço">Braço</option>
								<option value="Cabeça">Cabeça</option>
							</select>

							<span class="material-symbols-rounded absolute right-3 top-1/2 -translate-y-1/2 text-xl pointer-events-none">
								expand_more
							</span>
						</div>
						<p class="text-textLight text-sm text-medium mb-1">
							Qual a intensidade do sintoma?
						</p>
						<div class="relative w-full mb-1">
							<span class="material-symbols-rounded absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
								expand_more
							</span>

							<select name="intensidade" required class="w-full h-11 rounded-md bg-textLight text-primaryDark px-4 appearance-none outline-none">
								<option value="" disabled selected>
									Selecione a intensidade
								</option>
								<option value="1">1</option>
								<option value="2">2</option>
								<option value="3">3</option>
								<option value="4">4</option>
								<option value="5">5</option>
								<option value="6">6</option>
								<option value="7">7</option>
								<option value="8">8</option>
								<option value="9">9</option>
								<option value="10">10</option>
							</select>
						</div>
						<p class="text-textLight text-2xl text-medium">
							Foto
						</p>
						<div class="flex flex-col items-center justify-center w-full h-full">
							<label for="arquivo" class="w-full h-[70%] border border-dashed border-surface flex flex-col items-center justify-center cursor-pointer" >
								<span class="material-symbols-rounded text-textLight">
									photo_camera
								</span>
								<p class="text-textLight text-sm text-medium">
									Tirar foto ou enviar anexo
								</p>
							</label>

							<input id="arquivo" name="arquivo" type="file" accept=".jpg,.jpeg,.png,.pdf" class="hidden"/>
						</div>

						<BaseButton type="submit" h="11" w="full" bgColor="accent" text="Registrar Sintoma" rounded="md" class="p-2 text-primaryDark"/>
					</form>
				</div>


				<div v-if="editar === true" class="absolute inset-0 z-50 bg-black/50 w-full h-full flex justify-center place-items-center">
					<form class="bg-primary w-[45%] h-[95%] rounded-[25px] px-15 py-5 flex flex-col place-items-center relative" @submit.prevent="registrarSintoma">
						<button type="button" @click="toggleEditar">
							<span class="material-symbols-rounded absolute left-0 text-[38px]! text-textLight ml-4 cursor-pointer">
								arrow_back
							</span>
						</button>
						<p class="text-textLight text-2xl text-semibold mb-2">
							Editar Sintoma
						</p>
						<p class="text-textLight text-sm text-medium mb-1">
							O que você está sentindo?
						</p>
						<BaseInput type="text" name="resumo" placeholder="Resuma seus sintomas" bgColor="textLight" textColor="primaryDark" />
						<p class="text-textLight text-sm text-medium mb-1">
							Explique com mais detalhes
						</p>
						<BaseInput type="text" name="descricao" placeholder="Descreva seus sintomas com mais detalhes" bgColor="textLight" textColor="primaryDark" />
						<p class="text-textLight text-sm text-medium mb-1">
							Quando começou?
						</p>
						<section class="flex w-full mb-1">
							<span class="flex-1">
								<BaseInput type="date" name="data" bgColor="textLight" textColor="primaryDark" px="0" class="pr-2 m-0" />
							</span>
							<span class="flex-1">
								<BaseInput type="time" name="horario" bgColor="textLight" textColor="primaryDark" px="0" />
							</span>
						</section>
						<p class="text-textLight text-sm text-medium mb-1">
							Em qual parte do corpo?
						</p>
						<div class="relative w-full mb-1">
							<span class="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-xl pointer-events-none">
								location_on
							</span>

							<select name="localizacao" required class="w-full h-11 rounded-md bg-textLight text-primaryDark pl-10 pr-8 appearance-none outline-none">
								<option value="" disabled selected>
									Localização
								</option>
								<option value="Costas">Costas</option>
								<option value="Braço">Braço</option>
								<option value="Cabeça">Cabeça</option>
							</select>

							<span class="material-symbols-rounded absolute right-3 top-1/2 -translate-y-1/2 text-xl pointer-events-none">
								expand_more
							</span>
						</div>
						<p class="text-textLight text-sm text-medium mb-1">
							Qual a intensidade do sintoma?
						</p>
						<div class="relative w-full mb-1">
							<span class="material-symbols-rounded absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
								expand_more
							</span>

							<select name="intensidade" required class="w-full h-11 rounded-md bg-textLight text-primaryDark px-4 appearance-none outline-none">
								<option value="" disabled selected>
									Selecione a intensidade
								</option>
								<option value="1">1</option>
								<option value="2">2</option>
								<option value="3">3</option>
								<option value="4">4</option>
								<option value="5">5</option>
								<option value="6">6</option>
								<option value="7">7</option>
								<option value="8">8</option>
								<option value="9">9</option>
								<option value="10">10</option>
							</select>
						</div>
						<p class="text-textLight text-sm text-medium">
							Foto
						</p>
						<div class="flex flex-col items-center justify-center w-full h-full">
							<label for="arquivo" class="w-full h-[70%] border border-dashed border-surface flex flex-col items-center justify-center cursor-pointer" >
								<span class="material-symbols-rounded text-textLight">
									photo_camera
								</span>
								<p class="text-textLight text-sm text-medium">
									Tirar foto ou enviar anexo
								</p>
							</label>

							<input id="arquivo" name="arquivo" type="file" accept=".jpg,.jpeg,.png,.pdf" class="hidden"/>
						</div>

						<BaseButton type="submit" h="11" w="full" bgColor="accent" text="Editar Sintoma" rounded="md" class="p-2" textColor="primaryDark"/>
					</form>
				</div>

				<!--Sliders-->
				<FilterOrd class="mb-3"/>

			<!--Blocos de historicos-->

				<!--Texto-->
				<p class="text-textLight text-2xl">{{ sintomas.length }} sintomas registrados</p>

				<!--Área inferior-->
				<section class="flex h-[82.5%] gap-x-4">
					<!--Card Sintoma-->
					<div class="w-[38%] h-full flex flex-col gap-y-2 overflow-y-auto scrollbar-hide">
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

					<!--Card Especificado-->
					<div class="w-[60%] h-full flex flex-col min-h-0" v-if="sintomaSelecionado !== null">
						<section class="flex justify-center items-center w-[96%] h-[9%] relative mb-3 shrink-0">
							<button button @click="sintomaSelecionado = null" class="cursor-pointer absolute left-0 ">
								<span class="material-symbols-rounded text-4xl! text-textLight">
									arrow_back
								</span>
							</button>
							<button @click="toggleEditar" type="button" class="flex justify-center w-[25%] h-11 bg-surface place-items-center rounded-2xl cursor-pointer absolute right-1">
								<span class="material-symbols-rounded text-primaryDark pointer-events-none mr-1">
									edit
								</span>
								<p class="text-lg text-primaryDark text-semibold">Editar sintomas</p>
							</button>
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
	</main>
</template>
