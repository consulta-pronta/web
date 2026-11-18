<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
	defineProps<{
		icon: string
		theme?: "bright" | "light" | "dark"
		mode?: "round" | "square"
	}>(),
	{
		theme: "light",
		mode: "round"
	}
)

const buttonStyle = computed(() => {
	switch (props.theme) {
		case "bright":
			return "text-textLight"
		case "light":
			return "text-primaryLight"
		case "dark":
			return "text-primaryDark"
		default:
			return ""
	}
})

const iconStyle = computed(() => {
	switch (props.theme) {
		case "bright":
			return "hover:bg-textLight/20"
		case "light":
			return "hover:bg-primaryLight/10"
		case "dark":
			return "hover:bg-primaryDark/10"
		default:
			return ""
	}
})
</script>

<template>
	<button
		type="button"
		class="cursor-pointer w-fit h-fit flex justify-center items-center size-full select-none p-1"
		:class="[buttonStyle, iconStyle, mode === 'round' ? 'rounded-full' : 'rounded']"
	>
		<span class="material-symbols-rounded">
			{{ icon }}
		</span>
	</button>
</template>