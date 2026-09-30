```vue
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
		<div class="w-full lg:w-[80%] max-h-[55vh] overflow-y-auto rounded-[20px] scrollbar-hide">
			<table class="bg-surface w-full">
				<thead class="text-sm text-primaryDark font-bold sticky top-0 bg-surface z-10">
					<tr>
						<th class="px-4 py-3">Exame</th>
						<th class="px-4 py-3" v-if="props.paciente === true">Paciente</th>
						<th class="px-4 py-3">Local</th>
						<th class="px-4 py-3">Data</th>
						<th class="px-4 py-3">Resultado</th>
					</tr>
				</thead>

				<tbody class="text-xs lg:text-sm text-primarydark font-light">
					<tr
						v-for="(exame, index) in props.exames"
						v-bind:key="index"
						class="border-t border-primarydark"
					>
						<td
							class="px-4 py-3 font-bold flex justify-center items-center relative m-1.5"
						>
							<span
								class="material-symbols-rounded text-primarydark absolute left-3 text-sm! md:text-base! lg:text-[18px]!"
							>
								{{ exame.icone }}
							</span>

							<div class="text-center max-w-[70%] mx-auto break-words">
								{{ exame.nome }}
							</div>
						</td>

						<td
							class="px-4 py-3 font-bold"
							v-if="props.paciente === true"
						>
							{{ exame.paciente }}
						</td>

						<td class="px-4 py-3">
							{{ exame.local }}
						</td>

						<td class="px-4 py-3">
							{{ exame.data }}
						</td>

						<td class="px-4 py-3">
							<div class="flex justify-center items-center relative">
								<span
									class="material-symbols-rounded text-primarydark absolute right-2 text-sm! md:text-base! lg:text-[18px]!"
								>
									{{ exame.iconeResultado }}
								</span>

								<div class="text-center max-w-[70%] mx-auto break-words">
									{{ exame.resultado }}
								</div>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</section>
</template>
```
