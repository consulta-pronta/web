<script setup lang="ts">
const props = defineProps<{
	title?: string
	visible?: boolean
}>()
</script>

<template>
	<section
		v-if="visible"
		class="fixed top-0 right-0 h-full min-w-150 z-10 bg-primary text-textLight px-10 py-8 flex flex-col gap-4"
	>
		<header class="flex flex-row justify-between">
			<h1 v-if="title" class=" text-3xl font-medium">{{ title }}</h1>

			<slot name="header-options"></slot>
		</header>

		<slot></slot>
	</section>
</template>