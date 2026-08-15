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

	<div v-if="showFilters === true" class="h-[4.88%] flex">
		<BaseButton text="Todos" bg-color="backgroundRoxo" text-color="textlight" w="fit" rounded="full" class="mr-1"/>
		<BaseButton text="Abodômen" bg-color="backgroundRoxo" text-color="textlight" w="fit" rounded="full" class="mr-1"/>
		<BaseButton text="Barriga" bg-color="backgroundRoxo" text-color="textlight" w="fit" rounded="full" class="mr-1"/>
		<BaseButton text="Cabeça" bg-color="backgroundRoxo" text-color="textlight" w="fit" rounded="full" class="mr-1"/>
		<BaseButton text="Costas" bg-color="backgroundRoxo" text-color="textlight" w="fit" rounded="full" class="mr-1"/>
	</div>

	<div v-if="showOrd === true" class="h-[4.88%] flex">
		<BaseButton icon="arrow_downward" iconColor="accent" w="fit" class="mr-1"/>
		<BaseButton text="Data de início" bg-color="Transparent" text-color="textlight" w="fit" rounded="full" class="mr-1"/>
		<BaseButton text="Intensidade" bg-color="Transparent" text-color="textlight" w="fit" rounded="full" class="mr-1"/>
	</div>

</template>
