<script setup lang="ts">
import { ref } from "vue"
import BaseButton from "@/components/bases/BaseButton.vue"
import FilterOrd from "@/components/FilterOrd.vue"

const dropdownExameAberto = ref(false)
const exameSelecionado = ref("")

const props = defineProps<{
	fechar: () => void
}>()

function dropExam() {
	dropdownExameAberto.value = !dropdownExameAberto.value
}

function selecionarExame() {
	exameSelecionado.value = "Heredograma"
	dropdownExameAberto.value = false
}
</script>

<template>
	<div
		class="absolute inset-0 z-50 bg-black/50 w-full h-full flex justify-center items-center"
	>
		<form
			class="bg-background w-[52%] rounded-3xl px-15 py-5 flex flex-col items-center relative"
		>
			<button
				type="button"
				@click="props.fechar()"
			>
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
					<option value="" disabled selected>
						Selecione o paciente
					</option>
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

			<div class="relative w-full h-full mt-3 mb-4">
				<button
					type="button"
					@click="dropExam"
					class="w-full h-11 bg-background text-textLight outline-none flex items-center"
				>
					<span class="material-symbols-rounded">
						{{dropdownExameAberto? "keyboard_arrow_down" : "keyboard_arrow_up"}}
					</span>

					<span class="font-bold text-lg">
						Selecione o exame
					</span>
				</button>

				<div
					v-if="dropdownExameAberto"
					class="flex flex-col z-50 mt-1 mb-4 w-full h-60 rounded-md overflow-y-scroll scrollbar-hide"
				>
					<button
						type="button"
						@click="selecionarExame"
						class="w-full px-4 py-3 flex items-center gap-3 text-left text-primaryDark cursor-pointer bg-textLight"
					>
						<span class="material-symbols-rounded">
							bloodtype
						</span>

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
						<span class="material-symbols-rounded">
							bloodtype
						</span>

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
							<p class="font-semibold">
								Eletrocardiograma
							</p>
							<p class="text-sm">Gráfico</p>
						</div>
					</button>

					<button
						type="button"
						@click="selecionarExame"
						class="w-full px-4 py-3 flex items-center gap-3 text-left text-primaryDark cursor-pointer bg-textLight"
					>
						<span class="material-symbols-rounded">
							radiology
						</span>

						<div>
							<p class="font-semibold">Raio-x</p>
							<p class="text-sm">Imagem</p>
						</div>
					</button>
				</div>

				<div class="flex w-full justify-center">
					<BaseButton type="submit" theme="accent">
						Confirmar e Solicitar Exames
					</BaseButton>
				</div>

			</div>
		</form>
	</div>
</template>
