<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
	nome: string
	quantidade: string
	periodo: string
	consumo: string
	pacientes: Array<string>
}>()

const aberto = ref(false)
</script>

<template>
	<tr class="border-t border-primarydark *:not-first:text-center">
		<td class="font-medium flex items-center gap-2">
			<span class="material-symbols-rounded">medication</span>
			{{ nome }}
		</td>

		<td>{{ quantidade }}</td>

		<td>{{ consumo }}</td>

		<td>
			<button
				type="button"
				:aria-expanded="aberto"
				aria-label="Mostrar detalhes"
				@click="aberto = !aberto"
			>
				<span
					class="material-symbols-rounded text-primarydark transition-transform duration-200 cursor-pointer"
					:class="{ 'rotate-180': aberto }"
				>
					expand_more
				</span>
			</button>
		</td>
	</tr>
	<tr
		v-if="aberto"
		v-for="paciente in pacientes"
		:key="paciente"
		class="border-t border-primaryDark *:not-first:text-center"
	>
		<td class="pl-15">{{ paciente }}</td>
		<td>{{ periodo }}</td>
		<!-- TODO: fuck -->
		<td>01/01/2001 até 02/02/2002</td>
		<td>
			<div class="flex items-center justify-center gap-3">
				<button
					type="button"
					:aria-label="`Editar prescrição de ${paciente.nome}`"
					class="cursor-pointer"
				>
					<span class="material-symbols-rounded text-primarydark text-xl!">
						edit
					</span>
				</button>

				<button
					type="button"
					:aria-label="`Apagar prescrição de ${paciente.nome}`"
					class="cursor-pointer"
				>
					<span class="material-symbols-rounded text-red-500 text-xl!">
						delete
					</span>
				</button>
			</div>
		</td>
	</tr>
</template>
