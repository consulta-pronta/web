<script setup lang="ts">
import { ref } from "vue"
import NavBar from "@/components/NavBar.vue"
import ExamsTable from "@/components/ExamsTable.vue"
import BaseButton from "@/components/BaseButton.vue"
import FilterOrd from "@/components/deprecated/FilterOrd.vue"

const solicitacao = ref(false)
const dropdownExameAberto = ref(false)
const exameSelecionado = ref("")

interface Exame {
	nome: string
	local: string
	data: string
	resultado: string
	icone: string
	iconeResultado: string
	paciente?: string
}

const exames = ref<Exame[]>([
	{
		nome: "Raio-X",
		local: "Hospital Meridional",
		data: "12/05/2026",
		resultado: "Exame em andamento",
		icone: "radiology",
		iconeResultado: "schedule",
		paciente: "Cláudio Silva",
	},
	{
		nome: "Exame de Urina",
		local: "Hospital Meridional",
		data: "01/05/1967",
		resultado: "Exame em andamento",
		icone: "colorize",
		iconeResultado: "schedule",
		paciente: "Cláudio Silva",
	},
])

function toggleSolicitacao() {
	solicitacao.value = !solicitacao.value
}

function dropExam() {
	dropdownExameAberto.value = !dropdownExameAberto.value
}

function selecionarExame() {
	exameSelecionado.value = "Heredograma"
	dropdownExameAberto.value = false
}
</script>

<template class="justify-end">
	<main class="flex h-screen overflow-hidden">
		<NavBar />

		<article
			class="bg-background w-full h-full flex justify-center items-center overflow-hidden"
		>
			<div class="w-full h-full py-[1.5%] px-[2.5%] flex flex-col min-h-0">
				<p class="text-4xl text-textLight font-bold h-20.25 mb-5">Meus Exames</p>

				<div class="flex flex-col items-center justify-center">
					<!--Barra de pesquisa-->
					<section class="flex justify-center place-items-center relative mb-3 w-full">
						<div class="relative flex items-center w-[56%] h-11 bg-surface rounded-md">
							<!--Não existe um padrão para 15px-->
							<span
								class="material-symbols-rounded text-primaryDark absolute left-3 pointer-events-none"
							>
								search
							</span>
							<input
								type="text"
								placeholder="Pesquisar"
								class="text-primaryDark placeholder-primaryDark w-full h-full outline-none pl-10"
							/>
						</div>
						<!--Botão de registrar exame-->
						<div class="absolute right-0 w-[20%]">
							<BaseButton
								type="button"
								text="Registrar Exame"
								icon="add"
								@click="toggleSolicitacao"
							/>
						</div>
					</section>

					<ExamsTable :exames="exames" :paciente="true" />

					<div
						v-if="solicitacao === true"
						class="absolute inset-0 z-50 bg-black/50 w-full h-full flex justify-center place-items-center"
					>
						<form
							class="bg-background w-[52%] rounded-3xl px-15 py-5 flex flex-col place-items-center relative"
						>
							<button type="button" @click="toggleSolicitacao">
								<span
									class="material-symbols-rounded absolute left-0 text-4xl! text-textLight ml-14 cursor-pointer"
								>
									arrow_back
								</span>
							</button>

							<p class="text-textLight text-2xl text-semibold mb-2">
								Solicitar Exame
							</p>

							<div class="relative w-full mt-3">
								<span
									class="material-symbols-rounded text-primaryDark absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
								>
									person
								</span>

								<select
									name="paciente"
									required
									class="w-full h-11 rounded-md bg-textLight text-primaryDark px-4 pl-10 appearance-none outline-none"
								>
									<option value="" disabled selected>Selecione o paciente</option>
									<option value="1">Cláudio Silva</option>
									<option value="2">The Robert</option>
								</select>
							</div>

							<span class="mt-3 w-full">
								<FilterOrd :order="false" status="typing" class="absolute left" />
							</span>

							<p class="text-textLight text-base text-semibold mt-2 w-full">
								Pesquisar e Selecionar exames
							</p>

							<section class="relative mt-3 w-full flex justify-center">
								<div
									class="relative flex items-center w-full h-11 bg-textLight rounded-md"
								>
									<span
										class="material-symbols-rounded text-primaryDark absolute left-3 pointer-events-none"
									>
										search
									</span>

									<input
										type="text"
										placeholder="Ex. Hemograma"
										class="text-primaryDark placeholder-primaryDark w-full h-full outline-none pl-10"
									/>
								</div>
							</section>

							<div class="relative w-full h-full mt-3">
								<button
									type="button"
									@click="dropExam"
									class="w-full h-11 bg-background text-textLight outline-none flex items-center"
								>
									<span class="material-symbols-rounded">
										{{
											dropdownExameAberto
												? "keyboard_arrow_down"
												: "keyboard_arrow_up"
										}}
									</span>
									<span class="font-bold text-lg"> Selecione o exame </span>
								</button>

								<div
									v-if="dropdownExameAberto"
									class="flex flex-col z-50 mt-1 w-full h-60 rounded-md overflow-y-scroll scrollbar-hide"
								>
									<!--problema futuro quanto a responsividade-->
									<button
										type="button"
										@click="selecionarExame"
										class="w-full px-4 py-3 flex items-center gap-3 text-left text-primaryDark cursor-pointer bg-textLight"
									>
										<span class="material-symbols-rounded"> bloodtype </span>
										<div>
											<p class="font-semibold">Heredograma</p>
											<p class="text-sm">Laboratorial</p>
										</div>
									</button>

									<button
										type="button"
										@click="selecionarExame"
										class="w-full px-4 py-3 flex items-center gap-3 text-left text-primaryDark cursor-pointer bg-textLight"
									>
										<span class="material-symbols-rounded"> bloodtype </span>
										<div>
											<p class="font-semibold">Glicemia em jejum</p>
											<p class="text-sm">Laboratorial</p>
										</div>
									</button>

									<button
										type="button"
										@click="selecionarExame"
										class="w-full px-4 py-3 flex items-center gap-3 text-left text-primaryDark cursor-pointer bg-textLight"
									>
										<span class="material-symbols-rounded">
											monitor_heart
										</span>
										<div>
											<p class="font-semibold">Eletrocardiograma</p>
											<p class="text-sm">Gráfico</p>
										</div>
									</button>

									<button
										type="button"
										@click="selecionarExame"
										class="w-full px-4 py-3 flex items-center gap-3 text-left text-primaryDark cursor-pointer bg-textLight"
									>
										<span class="material-symbols-rounded"> radiology </span>
										<div>
											<p class="font-semibold">Raio-x</p>
											<p class="text-sm">Imagem</p>
										</div>
									</button>
								</div>

								<BaseButton
									type="submit"
									text="Confirmar e Solicitar Exame"
									class="w-full mt-2"
								/>
							</div>
						</form>
					</div>
				</div>
			</div>
		</article>
	</main>
</template>
