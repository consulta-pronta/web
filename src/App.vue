<script setup lang="ts">
import { onMounted, onUnmounted } from "vue"

const notifyOffline = () => {
	window.alert("Você está offline. Algumas funcionalidades podem não funcionar.")
}

onMounted(() => {
	window.addEventListener("offline", notifyOffline)
	if (!navigator.onLine) {
		notifyOffline()
	}
})

onUnmounted(() => {
	window.removeEventListener("offline", notifyOffline)
})
</script>

<template>
	<RouterView :key="$route.name" />
</template>
