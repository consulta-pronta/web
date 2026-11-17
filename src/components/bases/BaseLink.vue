<script setup lang="ts">
import { RouterLink, type RouteLocationRaw } from "vue-router"

defineProps<{
	to: RouteLocationRaw
}>()
</script>

<template>
	<RouterLink :to="to">
		<slot></slot>
	</RouterLink>
</template>
