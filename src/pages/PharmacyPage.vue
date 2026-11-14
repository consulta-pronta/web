<script setup lang="ts">
import { ref, useTemplateRef } from "vue"

import NavBar from "@/components/NavBar.vue"
import BaseInput from "@/components/bases/BaseInput.vue"
import FarmaciaRow from "@/components/FarmaciaRow.vue"
import BaseButton from "@/components/bases/BaseButton.vue"
import FormMedicamento from "@/components/forms/FormMedicamento.vue"
import BaseDialog from "@/components/bases/BaseDialog.vue"
import PageWrapper from "@/components/wrappers/PageWrapper.vue"
import HeaderWrapper from "@/components/wrappers/HeaderWrapper.vue"
import DefaultContentWrapper from "@/components/wrappers/DefaultContentWrapper.vue"
import BaseTable from "@/components/bases/BaseTable.vue"

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

const handleSubmit = async () => { }
</script>

<template>
	<PageWrapper>
		<HeaderWrapper title="Farmácia">
			<div class="flex flex-row gap-2 justify-center *:h-[stretch]">
				<BaseButton
					type="button"
					theme="accent"
					icon="prescriptions"
					@click="formRegister?.toggle()"
					class="col-span-3 rounded-2xl"
				>
					<p class="hidden lg:block">Prescrever medicamento</p>
				</BaseButton>

				<!-- v-model="searchQuery" -->
				<BaseInput
					placeholder="Pesquisar"
					icon="search"
					class="place-self-center w-full md:w-120"
				/>
			</div>
		</HeaderWrapper>

		<DefaultContentWrapper>
			<BaseTable>
				<template #header>
					<th class="w-120">Medicamento</th>
					<th class="w-40">Quantidade</th>
					<th class="w-40">Consumo</th>
					<th class="w-12"></th>
				</template>

				<template #default>
					<FarmaciaRow
						v-for="farmacia in farmacias"
						:key="farmacia.nome"
						:nome="farmacia.nome"
						:quantidade="farmacia.quantidade"
						:periodo="farmacia.periodo"
						:consumo="farmacia.consumo"
						:pacientes="farmacia.pacientes"
					/>
				</template>
			</BaseTable>
		</DefaultContentWrapper>

		<BaseDialog title="Registrar Medicamento" ref="formRegister">
			<FormMedicamento @handled-submit="handleSubmit" />
		</BaseDialog>

		<BaseDialog title="Atualizar Medicamento" ref="formUpdate">
			<FormMedicamento @handled-submit="handleSubmit" :prescricaoId="currentPrescricaoId" />
		</BaseDialog>
	</PageWrapper>
</template>
