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
	<button type="button" @click="emit('toggle')" class="shrink-0 w-full h-[24%] bg-surface rounded-[10px] p-[2.5%] cursor-pointer">
		<section class="flex w-fit justify-center mb-[1%]">
			<p
				v-if="props.sintomaPersistente"
				class="text-xs text-error mr-4"
			>
				Sintoma persistente
			</p>
			<aside :class="[`flex w-fit justify-center items-center`, `text-${props.Cor}`]">
				<p class="text-xs flex justify-center items-center">
					<span
						class="material-symbols-rounded text-base!">
						monitor_heart
					</span>
					Intensidade:
					<span>
						{{ props.intensidade }}/10
					</span>
				</p>
			</aside>

		</section>

		<p class="text-sm font-bold text-primaryDark text-left my-[1%]">
			{{ props.titulo }}
		</p>

		<section class="flex items-center text-primary my-[1%]">
			<span class="material-symbols-rounded text-base! mr-1">
				calendar_month
			</span>

			<p class="text-xs mr-6">
				{{ props.dia }}/{{ props.mes }}/{{ props.ano }}
			</p>

			<span class="material-symbols-rounded text-base! mr-6">
				notes
			</span>

			<span class="material-symbols-rounded text-base!">
				attach_file
			</span>

			<p class="text-xs mr-6">
				2
			</p>
		</section>

		<section class="my-[1%]">
			<div
				class="flex items-center text-primaryDark bg-accent rounded-md w-fit p-1"
			>
				<span class="material-symbols-rounded text-xs! mr-1">
					location_on
				</span>

				<p class="text-">
					{{ props.localizacao }}
				</p>
			</div>
		</section>
	</button>
</template>
