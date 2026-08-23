<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'

import { ref } from 'vue'

const showFilters = ref(false)
const showOrd = ref(false)

interface Props {
	filter?: boolean,
	order?: boolean,
	status?: 'location' | 'typing',
}

const props = withDefaults(defineProps<Props>(), {
	filter: true,
	order: true,
	status: "location",
})

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
		<div v-if="props.filter">
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

		<div v-if="props.order">
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

	<div v-if="props.filter && showFilters" class="h-[4.88%] flex mb-5">
		<article v-if="props.status === 'location' " class="flex">
			<BaseButton text="Todos" bg-color="background" text-color="textLight" w="fit" rounded="full" class="mr-1"/>
			<BaseButton text="Abdômen" bg-color="background" text-color="textLight" w="fit" rounded="full" class="mr-1"/>
			<BaseButton text="Barriga" bg-color="background" text-color="textLight" w="fit" rounded="full" class="mr-1"/>
			<BaseButton text="Cabeça" bg-color="background" text-color="textLight" w="fit" rounded="full" class="mr-1"/>
			<BaseButton text="Costas" bg-color="background" text-color="textLight" w="fit" rounded="full" class="mr-1"/>
		</article>

		<article v-if="props.status === 'typing' " class="flex">
			<BaseButton text="Todos" bg-color="background" text-color="textLight" w="fit" rounded="full" class="mr-1"/>
			<BaseButton text="laboratariais" bg-color="background" text-color="textLight" w="fit" rounded="full" class="mr-1"/>
			<BaseButton text="imagem" bg-color="background" text-color="textLight" w="fit" rounded="full" class="mr-1"/>
			<BaseButton text="clínico" bg-color="background" text-color="textLight" w="fit" rounded="full" class="mr-1"/>
		</article>

	</div>

	<div v-if="props.order && showOrd" class="h-[4.88%] flex mb-5">
		<BaseButton icon="arrow_downward" iconColor="accent" w="fit" class="mr-1"/>
		<BaseButton text="Data de início" bg-color="Transparent" text-color="textLight" w="fit" rounded="full" class="mr-1"/>
		<BaseButton text="Intensidade" bg-color="Transparent" text-color="textLight" w="fit" rounded="full" class="mr-1"/>
	</div>

</template>
