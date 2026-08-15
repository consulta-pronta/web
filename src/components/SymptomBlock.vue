<script setup lang="ts">
interface Props {
	sintomaPersistente?: boolean
	Cor?: string
	intensidade?: string
	titulo?: string
	dia?: string
	mes?: string
	ano?: string
	localizacao?: string
}

const props = withDefaults(defineProps<Props>(), {
	sintomaPersistente: true,
	Cor: 'warning',
	intensidade: '5',
	titulo: 'Dor',
	dia: '01',
	mes: '01',
	ano: '2000',
	localizacao: 'Costas',
})

const emit = defineEmits<{
	(e: 'toggle'): void
}>()
</script>

<template>
	<button type="button" @click="emit('toggle')" class="shrink-0 w-full h-[28%] bg-surface rounded-[10px] m-1 p-[2.5%] cursor-pointer">
		<section class="flex w-fit justify-center items-center mb-[1.5%]">
			<p
				v-if="props.sintomaPersistente"
				class="text-[12px] text-error mr-4"
			>
				Sintoma persistente
			</p>
			<aside :class="[`flex w-fit justify-center items-center`, `text-${props.Cor}`]">
				<p class="text-[12px] flex justify-center items-center">
					<span
						class="material-symbols-rounded text-[16px]!">
						monitor_heart
					</span>
					Intensidade:
					<span>
						{{ props.intensidade }}/10
					</span>
				</p>
			</aside>

		</section>

		<p class="text-[14px] font-bold text-primarydark mb-[2%] text-left">
			{{ props.titulo }}
		</p>

		<section class="flex items-center text-primaryBlue mb-[2.5%]">
			<span class="material-symbols-rounded text-[16px]! mr-1">
				calendar_month
			</span>

			<p class="text-[12px] mr-6">
				{{ props.dia }}/{{ props.mes }}/{{ props.ano }}
			</p>

			<span class="material-symbols-rounded text-[16px]! mr-6">
				notes
			</span>

			<span class="material-symbols-rounded text-[16px]!">
				attach_file
			</span>

			<p class="text-[12px] mr-6">
				2
			</p>
		</section>

		<section>
			<div
				class="flex items-center text-primarydark bg-accent rounded-md w-fit p-1"
			>
				<span class="material-symbols-rounded text-[12px]! mr-1">
					location_on
				</span>

				<p class="text-[12px]">
					{{ props.localizacao }}
				</p>
			</div>
		</section>
	</button>
</template>
