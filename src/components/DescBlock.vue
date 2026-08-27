<script setup lang="ts">
import IntensityComp from '@/components/IntensityComp.vue'
import LocationTag from '@/components/LocationTag.vue'
import UserPhoto from '@/components/UserPhoto.vue'
import { ref } from 'vue'

const Show = ref(false)


function toggle() {
	Show.value = !Show.value
}

interface Props {
	dia?: string
	mes?: string
	ano?: string
	intensidade?: string
	Cor?: string
	title?: string
	desc?: string
	imagem?: boolean
	localizacao?: string
}

const props = withDefaults(defineProps<Props>(), {
	dia: '01',
	mes: '01',
	ano: '2000',
	intensidade: '6',
	Cor: 'warning',
	title: 'Dor',
	desc: 'descrição',
	imagem: false,
	localizacao: 'Perna',
})
</script>

<template>
	<section>
		<div class="w-[95%] h-fit bg-surface rounded-[15px] p-2 m-1">

			<section class="flex justify-between">
				<article class="text-primaryDark flex justify-center">
					<span class="material-symbols-rounded text-[28px]! mr-1">
						calendar_month
					</span>

					<p class="text-[16px]">
						{{ props.dia }}/{{ props.mes }}/{{ props.ano }}
					</p>
				</article>

				<button type="button" @click="toggle">
					<span class="material-symbols-rounded text-[32px]! mr-1 text-primaryDark">
						{{ Show ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}
					</span>
				</button>
			</section>

			<section v-if="Show === true" class="border border-primaryDark rounded-lg p-2">

				<IntensityComp
					Cor="warning"
					:intensidade="props.intensidade"
					class="mb-2"
				/>

				<p class="text-primaryDark font-bold text-[16px] mb-2">
					{{ props.title }}
				</p>

				<p class="text-primaryDark font-light text-[12px] mb-2">
					{{ props.desc }}
				</p>

				<LocationTag
					:localizacao="props.localizacao"
					bgcolor="primaryDark"
					textcolor="surface"
					class="mb-2"
				/>

				<section
					v-if="props.imagem"
					class="border-t border-primaryDark p-2"
				>
					<UserPhoto
						rounded="0"
						:circle="false"
						borderColor="primaryDark"
					/>
				</section>

			</section>
		</div>
	</section>
</template>
