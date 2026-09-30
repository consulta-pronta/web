<script setup lang="ts">
import { ref } from "vue"
import NavBar from "@/components/NavBar.vue"
import ExamsTable from "@/components/deprecated/ExamsTable.vue"
import BaseButton from "@/components/bases/BaseButton.vue"
import OverlayRequest from "@/components/forms/OverlayRequest.vue"

const solicitacao = ref(false)

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
</script>

<template>
	<main class="flex h-screen overflow-hidden">
		<NavBar />

		<article
			class="bg-background w-full h-full flex justify-center items-center overflow-hidden"
		>
			<div
				class="w-full h-full py-[1.5%] px-[2.5%] flex flex-col min-h-0"
			>
				<header class="mb-4 flex flex-col gap-8">
					<h1
						class="text-4xl text-textLight font-bold text-center lg:text-start"
					>
						Meus Exames
					</h1>

				</header>

				<div class="flex flex-col items-center justify-center">
					<section
						class="flex justify-center items-center relative mb-3 w-full"
					>
						<div
							class="relative flex items-center w-[56%] h-11 bg-surface rounded-md"
						>
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

						<div class="absolute right-0 w-[20%]">
							<BaseButton
								type="button"
								text="Registrar Exame"
								icon="add"
								@click="toggleSolicitacao"
							/>
						</div>
					</section>

					<ExamsTable
						:exames="exames"
						:paciente="true"
					/>

					<OverlayRequest
						v-if="solicitacao"
						:fechar="toggleSolicitacao"
					/>
				</div>
			</div>
		</article>
	</main>
</template>
