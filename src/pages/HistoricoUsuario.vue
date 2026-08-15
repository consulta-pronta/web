<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue';
import FilterOrd from '@/components/FilterOrd.vue';
import IntensityComp from '@/components/IntensityComp.vue';
import LocationTag from '@/components/LocationTag.vue';
import NavBar from '@/components/NavBar.vue';
import SymptomBlock from '@/components/SymptomBlock.vue';
import UserPhoto from '@/components/UserPhoto.vue';
import { ref } from 'vue';

const Show = ref(false)

function toggle() {
	Show.value = !Show.value
}
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

				<!--Blocos de historicos-->
				<p class="text-textlight text-[24px]">4 sintomas registrados</p>

				<section class="flex h-[82.5%]">
					<div class="w-[40%] h-full flex flex-col gap-y-2 overflow-y-auto scrollbar-hide">
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
					<!--Especificado-->
					<div class="w-[60%] h-full flex flex-col m-2 overflow-y-auto scrollbar-hide">
						<section class="flex justify-center place-items-center w-full h-[9%] relative mb-3">
							<span class="material-symbols-rounded absolute left-0 text-[38px]! text-textlight">
								arrow_back
							</span>
							<div class="flex justify-center w-[88%] h-full bg-surface place-items-center rounded-md">
								<span class="material-symbols-rounded text-primarydark pointer-events-none mr-1">
									edit
								</span>
								<p class="text-[18px] text-primarydark text-semibold">Editar sintomas</p>
							</div>
						</section>

						<section>
							<div class="w-full h-fit bg-surface rounded-[15px] p-2">

								<section class="flex justify-between">
									<article class="text-primarydark flex justify-center">
										<span class="material-symbols-rounded text-[28px]! mr-1">
											calendar_month
										</span>
										<p class="text-[16px]">
											dia/mes/ano
										</p>
									</article>

									<button type="button" @click="toggle">
										<span class="material-symbols-rounded text-[32px]! mr-1 text-primarydark">
											{{ Show ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}
										</span>
									</button>
								</section>

								<section  v-if="Show === true" class="border border-primarydark rounded-lg p-2">
									<IntensityComp Cor="warning" intensidade="6" class="mb-2"/>

									<p class="text-primatydark font-bold text-[16px] mb-2">
										Dor nas
									</p>

									<p class="text-primatydark font-light text-[12px] mb-2">
										Descrição
									</p>

									<LocationTag localizacao="Perna" bgcolor="primarydark" textcolor="surface" class="mb-2"/>

									<section class="border-t border-primarydark p-2">
										<UserPhoto rounded="0" :circle="false" borderColor="primarydark"/>
									</section>

								</section>
							</div>
						</section>

					</div>
				</section>

			</div>

		</div>
	</article>
</template>
