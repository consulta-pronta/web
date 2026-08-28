<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'

import { ref } from 'vue'

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
	<div>
		<section class="flex justify-start items-center relative w-fit">
			<div>
				<article class="flex items-center">
					<span class="material-symbols-rounded text-[24px] text-accent mr-1">
						filter_alt
					</span>
					<p class="text-accent">
						Filtro
					</p>
					<button type="button" @click="toggleFilter" class="material-symbols-rounded text-[24px] text-accent mr-1 cursor-pointer">
						{{ showFilters ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}
					</button>
				</article>
			</div>
			<div>
				<article class="flex items-center">
					<span class="material-symbols-rounded text-[24px] text-accent mr-1">
						bar_chart
					</span>
					<p class="text-accent">
						Ordenar
					</p>
					<button type="button" @click="toggleOrd" class="material-symbols-rounded text-[24px] text-accent mr-1 cursor-pointer">
						{{ showOrd ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}
					</button>
				</article>
			</div>
		</section>
		<div v-if="showFilters === true" class="h-[4.88%] flex mb-5">
			<BaseButton theme="primaryDark" class="mr-1">Todos</BaseButton>
			<BaseButton theme="primaryDark" class="mr-1">Abdômen</BaseButton> <!-- Abodômen -->
			<BaseButton theme="primaryDark" class="mr-1">Barriga</BaseButton>
			<BaseButton theme="primaryDark" class="mr-1">Cabeça</BaseButton>
			<BaseButton theme="primaryDark" class="mr-1">Costas</BaseButton>
		</div>
		<div v-if="showOrd === true" class="h-[4.88%] flex mb-5">
			<BaseButton icon="arrow_downward" iconColor="accent" w="fit" class="mr-1"/>
			<BaseButton theme="primaryDark" class="mr-1">Data de início</BaseButton>
			<BaseButton theme="primaryDark" class="mr-1">Intensidade</BaseButton>
		</div>
	</div>
</template>
