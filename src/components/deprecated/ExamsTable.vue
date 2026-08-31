<script setup lang="ts">
interface Exame {
	nome: string
	local: string
	data: string
	resultado: string
	icone: string
	iconeResultado: string
	paciente?: string
}

interface Props {
	exames: Exame[]
	paciente?: boolean
}

const props = defineProps<Props>()
</script>

<template>
	<section class="w-full flex justify-center place-items-center text-center min-h-0">
		<div class="w-[90%] max-h-[55vh] overflow-y-auto rounded-[20px] scrollbar-hide">
			<table class="bg-surface w-full">
				<thead class="text-lg text-primaryDark font-bold sticky top-0 bg-surface z-10">
					<tr>
						<th class="px-4 py-3">Exame</th>
						<th class="px-4 py-3" v-if="props.paciente === true">Paciente</th>
						<th class="px-4 py-3">Local</th>
						<th class="px-4 py-3">Data</th>
						<th class="px-4 py-3">Resultado</th>
					</tr>
				</thead>

				<tbody class="text-sm text-primarydark font-light">
					<tr
						v-for="(exame, index) in props.exames"
						v-bind:key="index"
						class="border-t border-primarydark"
					>
						<td
							class="px-4 py-3 font-bold flex justify-center items-center relative m-1.5"
						>
							<span class="material-symbols-rounded text-primarydark absolute left-3">
								{{ exame.icone }}
							</span>
							{{ exame.nome }}
						</td>

						<td class="px-4 py-3 font-bold" v-if="props.paciente === true">
							{{ exame.paciente }}
						</td>

						<td class="px-4 py-3">{{ exame.local }}</td>

						<td class="px-4 py-3">{{ exame.data }}</td>

						<td class="px-4 py-3">
							<div class="justify-center items-center relative">
								<span
									class="material-symbols-rounded text-primarydark absolute right-2"
								>
									{{ exame.iconeResultado }}
								</span>
								{{ exame.resultado }}
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</section>
</template>
