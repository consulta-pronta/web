<script setup lang="ts">
interface Props {
	Cor?: string
	intensidade?: string
}

const props = withDefaults(defineProps<Props>(), {
	Cor: 'warning',
})
</script>

<template>
	<aside :class="[`flex w-fit justify-center items-center`, `text-${props.Cor}`]">
		<p class="text-[12px] flex justify-center items-center">
			<span
				class="material-symbols-rounded text-[16px]! mr-1">
				monitor_heart
			</span>
			Intensidade:
			<span class="ml-1">
				{{ props.intensidade }}/10
			</span>
		</p>
	</aside>
</template>
