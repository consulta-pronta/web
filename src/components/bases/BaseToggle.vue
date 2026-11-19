<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		theme?: "light" | "dark"
		disabled?: boolean
	}>(),
	{
		theme: "dark"
	}
)

const status = defineModel<boolean>()

const toggle = () => {
	if (props.disabled) return
	status.value = !status.value
}
</script>

<template>
	<button
		class="flex flex-row *:grow p-1 rounded-full relative w-12 h-6 cursor-pointer"
		:class="[
			disabled ? 'opacity-80 **:cursor-no-drop!' : '',
			status? 'bg-primaryDark' : 'bg-accent'
		]"
		@click="toggle"
	>
		<div
			class="boogieman absolute w-4 h-4 z-1"
			:class="status ? 'left-1 bg-accent' : 'left-7 bg-primaryDark'"
		></div>
	</button>
</template>

<style scoped>
@reference "@/assets/main.css";

.boogieman {
	@apply rounded-full transition-[left] duration-300;
}
</style>
