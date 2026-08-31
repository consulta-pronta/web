<script setup lang="ts">
import { computed } from "vue"

interface Props {
	Cor?: string
	intensidade?: string
}

const props = withDefaults(defineProps<Props>(), {
	Cor: "warning",
})

const intensidadeClass = computed(() => {
	switch (props.Cor) {
		case "sucess":
			return "text-sucess"
		case "error":
			return "text-error"
		case "warning":
			return "text-warning"
		default:
			return "text-textLight"
	}
})
</script>

<template>
	<aside :class="['flex w-fit justify-center items-center', intensidadeClass]">
		<p class="text-xs flex justify-center items-center">
			<span class="material-symbols-rounded text-base! mr-1"> monitor_heart </span>
			Intensidade:
			<span class="ml-1"> {{ props.intensidade }}/10 </span>
		</p>
	</aside>
</template>
