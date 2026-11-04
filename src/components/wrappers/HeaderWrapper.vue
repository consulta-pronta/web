<script setup lang="ts">
defineProps<{
	title: string
}>()

</script>

<template>
	<header class="mb-16 flex flex-col gap-8">
		<h1 class="text-4xl text-textLight font-bold text-center lg:text-start">
			{{ title }}
		</h1>

		<slot></slot>
	</header>
</template>