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
    <tr class="border-t border-primarydark">
        <td class="px-4 py-3 font-bold flex justify-center items-center relative m-1.5">
            <span class="material-symbols-rounded text-primarydark absolute left-3 text-base!">
                medication
            </span>

            {{ nome }}
        </td>

        <td class="px-4 py-3">
            {{ quantidade }}
        </td>

        <td class="px-4 py-3">
            {{ consumo }}
        </td>

        <td class="px-4 py-3">
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
	<template v-if="aberto">
		<tr v-for="paciente in pacientes" :key="paciente" class="border-t border-primaryDark">
			<td class="px-4 py-3">
				{{ paciente }}
			</td>
			<td colspan="2" class="px-4 py-3">
				{{ periodo }}
			</td>
			<td class="px-4 py-3">
				01/01/2001 até 02/02/2002
			</td>
			<td class="px-4 py-3">
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
</template>
