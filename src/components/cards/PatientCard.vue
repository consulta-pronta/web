<script setup lang="ts">
import BaseButton from '@/components/bases/BaseButton.vue'

interface Props {
	patient: unknown //mudar
	theme: "dark" | "light"
}
const props = withDefaults(defineProps<Props>(), {
	theme: "light",
})

const colors =
	props.theme === "light" ? { bg: "surface", text: "red" } : { bg: "primary", text: "textLight" }

const ranges = [
	{ min: 0, max: 4, color: "green" },
	{ min: 5, max: 7, color: "orange" },
	{ min: 8, max: 10, color: "red" },
]
const priorityColor = ranges.find((r) => {
	return props.patient.priority >= r.min && props.patient.priority <= r.max
})?.color
</script>

<template>
	<article class="rounded-md p-3 bg-surface *:text-textDark">
		<div class="flex items-center justify-between">
			<div>
				<p class="font-bold oneliner">
					{{ "Nomeeeeeeeee" }}
				</p>

				<p>
					{{ "CPF: 000.000.000-00" }}
				</p>
			</div>

			<div class="flex items-center text-center">
				<p class="flex tenten py-1 px-3 rounded-2xl text-center">
					<span class="material-symbols-rounded text-lg!">
						warning
					</span>
					{{ patient.priority ?? "Média" }}
				</p>

				<BaseButton
					theme="primary"
					mode="transparent"
					class="p-0!"
				>
					<span class="material-symbols-rounded select-none text-shadow-md!">
						edit_square
					</span>
				</BaseButton>
			</div>
		</div>


		<hr class="my-2 opacity-30" />

		<div class="flex items-center justify-between">
			<div>
				<p class="font-bold oneliner">
					Próxima consulta:
				</p>

				<p>
					{{ "-" }}
				</p>
			</div>

			<BaseButton
				theme="primary"
				mode="transparent"
				class="text-sm! font-semibold opacity-90 pr-0!"
			>
				Abrir prontuário
				<span class="material-symbols-rounded select-none text-lg!">
					open_in_new
				</span>
			</BaseButton>
		</div>
	</article>
</template>

<style scoped>
@reference "@/assets/main.css";

.oneliner {
	@apply whitespace-nowrap overflow-hidden text-ellipsis;
}

.tenten {
	background-color: color-mix(in srgb, v-bind(priorityColor), transparent);
}
</style>
