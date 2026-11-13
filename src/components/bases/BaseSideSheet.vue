<script setup lang="ts">
const props = defineProps<{
	title?: string
	visible?: boolean
}>()
</script>

<template>
	<Transition name="side-sheet">
		<section
			v-if="visible"
			class="fixed top-0 right-0 h-full min-w-150 z-10 bg-primary text-textLight px-10 py-8 flex flex-col gap-4 shadow-[-0.5rem_0_1rem_0_rgba(0,0,0,0.2)]"
		>
			<header class="flex flex-row justify-between">
				<h1 v-if="title" class=" text-3xl font-medium">{{ title }}</h1>

				<slot name="header-options"></slot>
			</header>

			<slot></slot>
		</section>
	</Transition>
</template>

<style>
.side-sheet-enter-active,
.side-sheet-leave-active {
	transition: transform 200ms ease;
}

.side-sheet-enter-from,
.side-sheet-leave-to {
	transform: translateX(100%);
}
</style>