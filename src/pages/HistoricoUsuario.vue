<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue';
import FilterOrd from '@/components/FilterOrd.vue';
import NavBar from '@/components/NavBar.vue';

const showFilters = ref(false)
const showOrd = ref(false)

</script>

<template class="justify-end">

	<NavBar />

	<article class="flex justify-end">
		<div class="bg-backgroundRoxo w-[84%] min-h-screen flex justify-center place-items-center">

			<div class="w-[88%] h-[85%] bg-primaryBlue rounded-3xl py-[1.5%] px-[2.5%]">
				<!--Barra de pesquisa-->
				<section class="flex justify-center place-items-center relative mb-3">
					<div class="relative flex items-center w-[56%] h-11 bg-surface rounded-[15px]">
						<span class="material-symbols-rounded text-primarydark absolute left-3 text-[2%] pointer-events-none">
							search
						</span>
						<input type="text" placeholder="Pesquisar" class="text-primaryDark placeholder-primarydark w-full h-full outline-none pl-10">
					</div>
					<div class="absolute right-0 w-[20%]">
						<BaseButton type="button" text="Registrar Sintoma" icon="add" :border="true" borderColor="textlight" rounded="full"/>
					</div>
				</section>


				<!--Sliders-->
				<FilterOrd />

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

				<!--Blocos de historico-->
				<section>

				</section>

			</div>

		</div>
	</article>
</template>
