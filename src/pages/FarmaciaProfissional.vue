<script setup lang="ts">
import { ref, useTemplateRef } from "vue"

import NavBar from "@/components/NavBar.vue"
import BaseInput from "@/components/bases/BaseInput.vue"
import FarmaciaRow from "@/components/FarmaciaRow.vue"
import BaseButton from "@/components/bases/BaseButton.vue"
import FormMedicamento from "@/components/forms/FormMedicamento.vue"
import BaseDialog from "@/components/bases/BaseDialog.vue"

const farmacias = [
	{
		nome: "Dipirona",
		quantidade: "500mg",
		periodo: "De 8 em 8 horas",
		consumo: "Oral",
		pacientes: ["João da Silva", "Maria Oliveira", "Carlos Souza"]
	},
	{
		nome: "Paracetamol",
		quantidade: "750mg",
		periodo: "De 6 em 6 horas",
		consumo: "Oral",
		pacientes: ["Ana Costa", "Pedro Lima"]
	},
	{
		nome: "Ibuprofeno",
		quantidade: "600mg",
		periodo: "De 12 em 12 horas",
		consumo: "Oral",
		pacientes: ["Fernanda Rocha", "Rafael Almeida", "Patrícia Lima"]
	}
]

const formRegister = useTemplateRef("formRegister")
const formUpdate = useTemplateRef("formUpdate")
const currentPrescricaoId = ref<string>("")
</script>

<template>
	<div class="flex h-screen">
		<NavBar />

		<main class="w-full h-full overflow-clip px-6 py-8">
			<header class="mb-4 flex flex-col gap-6">
				<h1 class="text-4xl text-textLight font-bold text-center lg:text-start">
					Farmácia
				</h1>

				<div class="flex justify-center items-center gap-4">
					<BaseInput
						placeholder="Pesquisar"
						icon="search"
						class="place-self-center w-full md:w-120"
					/>

					<BaseButton
						theme="accent"
						icon="add"
						iconPosition="right"
						@click="formRegister?.toggle()"
					>
						Prescrever medicamento
					</BaseButton>
				</div>

				<article class="w-full flex justify-center">
					<section
						class="relative grid grid-cols-[1fr_10fr] w-[85%] md:w-[60%] lg:w-[40%] min-h-11 items-center border border-textLight text-sm text-textLight rounded-[15px]"
					>
						<span class="material-symbols-rounded text-[10px] pl-5">
							shield
						</span>

						<div class="w-full text-center text-sm lg:text-sm">
							<p>
								Selecione os pacientes que receberão os medicamentos.
							</p>
						</div>
					</section>
				</article>
			</header>
			<section class="w-full flex justify-center place-items-center text-center min-h-0">
				<div class="w-full lg:w-[85%] max-h-[55vh] overflow-y-auto rounded-[20px] scrollbar-hide">
					<table class="bg-surface w-full">
						<thead>
							<tr>
								<th class="w-1/4 p-2">Medicamento</th>
								<th class="w-1/4 p-2">Quantidade</th>
								<th class="w-1/4 p-2">Consumo</th>
								<th class="w-1/4 p-2"></th>
							</tr>
						</thead>

						<tbody class="text-[10px] md:text-sm text-primarydark font-light">
							<FarmaciaRow
								v-for="farmacia in farmacias"
								:key="farmacia.nome"
								:nome="farmacia.nome"
								:quantidade="farmacia.quantidade"
								:periodo="farmacia.periodo"
								:consumo="farmacia.consumo"
								:pacientes="farmacia.pacientes"
							/>
						</tbody>
					</table>
				</div>
			</section>
		</main>

		<BaseDialog title="Registrar Medicamento" ref="formRegister">
			<FormMedicamento @handled-submit="handleSubmit" />
		</BaseDialog>

		<BaseDialog title="Atualizar Medicamento" ref="formUpdate">
			<FormMedicamento @handled-submit="handleSubmit" :prescricaoId="currentPrescricaoId" />
		</BaseDialog>
	</div>
</template>
