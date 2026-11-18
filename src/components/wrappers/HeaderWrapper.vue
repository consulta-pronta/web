<script setup lang="ts">
defineProps<{
	title: string
}>()
</script>

<template>
	<header class="mb-16 flex flex-col gap-8">
		<div class="flex flex-row justify-between">
			<h1 class="text-4xl w-fit text-textLight font-bold text-center lg:text-start">
				{{ title }}
			</h1>
			<slot name="side"></slot>
		</div>

		<slot></slot>
	</header>
</template>
