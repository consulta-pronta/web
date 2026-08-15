<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue';
import FilterOrd from '@/components/FilterOrd.vue';
import NavBar from '@/components/NavBar.vue';
import SymptomBlock from '@/components/SymptomBlock.vue';
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
				<FilterOrd class="mb-3"/>
				<!--Blocos de historico-->
				<p class="text-textlight text-[24px]">4 sintomas registrados</p>

				<section class="flex h-[82.5%]">
					<div class="w-[40%] h-full flex flex-col gap-y-2 overflow-y-auto scrollbar-hide ">
						<SymptomBlock
						:sintoma-persistente="true"
						Cor="warning"
						intensidade="6"
						titulo="Dor persistente ao levantar"
						dia="28"
						mes="08"
						ano="2008"
						localizacao="Costas"
						/>
						<SymptomBlock
						:sintoma-persistente="false"
						Cor="sucess"
						intensidade="2"
						titulo="Dor quase nula"
						dia="29"
						mes="09"
						ano="2009"
						localizacao="Mindinho"
						/>
					</div>

					<div class="w-[60%]">
						a
					</div>
				</section>

			</div>

		</div>
	</article>
</template>
