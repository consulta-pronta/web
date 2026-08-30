<script setup lang="ts">
import BaseButton from "@/components/bases/BaseButton.vue"

import { ref } from "vue"

const showFilters = ref(false)
const showOrd = ref(false)

function toggleFilter() {
	showFilters.value = !showFilters.value

	if (showFilters.value == true) {
		showOrd.value = false
	}
}

function toggleOrd() {
	showOrd.value = !showOrd.value

	if (showOrd.value == true) {
		showFilters.value = false
	}
}
</script>

<template>
	<section class="flex justify-start items-center relative w-fit">
		<div>
			<article class="flex items-center">
				<span class="material-symbols-rounded text-[24px] text-accent mr-1">
					filter_alt
				</span>
				<p class="text-accent">Filtro</p>
				<button
					type="button"
					@click="toggleFilter"
					class="material-symbols-rounded text-[24px] text-accent mr-1 cursor-pointer"
				>
					{{ showFilters ? "keyboard_arrow_down" : "keyboard_arrow_up" }}
				</button>
			</article>
		</div>

		<div>
			<article class="flex items-center">
				<span class="material-symbols-rounded text-[24px] text-accent mr-1">
					bar_chart
				</span>
				<p class="text-accent">Ordenar</p>
				<button
					type="button"
					@click="toggleOrd"
					class="material-symbols-rounded text-[24px] text-accent mr-1 cursor-pointer"
				>
					{{ showOrd ? "keyboard_arrow_down" : "keyboard_arrow_up" }}
				</button>
			</article>
		</div>
	</section>

	<div v-if="showFilters === true" class="h-fit flex mb-3 gap-2">
		<BaseButton theme="light" mode="fill" class="rounded-4xl! h-fit p-1">Todos</BaseButton>
		<BaseButton theme="dark" mode="fill" class="text-textLight rounded-4xl! h-fit p-1"
			>Abdômen</BaseButton
		>
		<!-- Abodômen -->
		<BaseButton theme="dark" mode="fill" class="text-textLight rounded-4xl! h-fit p-1"
			>Barriga</BaseButton
		>
		<BaseButton theme="dark" mode="fill" class="text-textLight rounded-4xl! h-fit p-1"
			>Cabeça</BaseButton
		>
		<BaseButton theme="dark" mode="fill" class="text-textLight rounded-4xl! h-fit p-1"
			>Costas</BaseButton
		>
	</div>

	<div v-if="showOrd === true" class="h-fit flex mb-3 gap-2">
		<BaseButton theme="dark" mode="transparent" icon="arrow_downward" class="h-8! px-0!" />
		<BaseButton theme="light" mode="fill" class="rounded-4xl! h-fit p-1"
			>Data de início</BaseButton
		>
		<BaseButton theme="dark" mode="fill" class="text-textLight rounded-4xl! h-fit p-1"
			>Intensidade</BaseButton
		>
	</div>
</template>
