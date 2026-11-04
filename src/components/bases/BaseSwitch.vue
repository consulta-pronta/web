<script setup lang="ts">

const props = defineProps<{
	value1: unknown,
	label1: string,
	value2: unknown,
	label2: string,
	disabled?: boolean
}>()

const status = defineModel<unknown>()

const isFirst = () => status.value === props.value1
const toggle = () => {
	if (props.disabled) { return }
	status.value = isFirst() ? props.value2 : props.value1
}
</script>

<template>
	<div
		class="flex flex-row bg-primaryDark p-1 gap-4 rounded-lg relative w-fit"
		:class="disabled ? 'opacity-80 **:cursor-no-drop!' : ''"
	>
		<div
			class="boogieman absolute bg-accent z-0"
			:class="isFirst() ? 'left-1' : 'left-[calc(100%-0.25rem-10rem)]'"
		></div>

		<button
			type="button"
			@click="toggle"
			class="boogieman"
			:class="isFirst() ? 'active' : ''"
		>
			{{ label1 }}
		</button>

		<button
			type="button"
			@click="toggle"
			class="boogieman"
			:class="!isFirst() ? 'active' : ''"
		>
			{{ label2 }}
		</button>
	</div>
</template>

<style scoped>
@reference "@/assets/main.css";

button {
	@apply cursor-pointer z-1 text-accent;
}

.boogieman {
	@apply w-40 h-8 rounded-lg transition-all duration-300;
}

.active {
	@apply text-textDark cursor-default;
}
</style>
