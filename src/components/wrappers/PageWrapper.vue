<script setup lang="ts">
import NavBar from "../NavBar.vue"

defineProps<{
	custom?: boolean
	title?: string
}>()
</script>

<template>
	<div class="flex h-screen overflow-hidden">
		<NavBar />

		<template v-if="custom">
			<slot></slot>
		</template>
		<template v-else>
			<main class="size-full overflow-clip px-6 py-8">
				<slot></slot>
			</main>
		</template>
	</div>
</template>