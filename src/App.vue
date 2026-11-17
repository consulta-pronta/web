<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue"
import { useRoute } from "vue-router"
import { POSITION, useToast } from "vue-toastification"
import type { ToastOptions } from "vue-toastification/dist/types/types"

const toast = useToast()
const route = useRoute()

const notifyOffline = () => {
	toast.warning(
		"Você está offline. \nAlgumas funcionalidades podem não funcionar.",
		<ToastOptions>{ timeout: false, position: POSITION.BOTTOM_RIGHT, }
	)
}
const dismissOfflineToast = () => {
	toast.clear()
}

onMounted(() => {
	window.addEventListener("offline", notifyOffline)
	window.addEventListener("online", dismissOfflineToast)
})

onUnmounted(() => {
	window.removeEventListener("offline", notifyOffline)
	window.removeEventListener("online", dismissOfflineToast)
})
</script>

<template>
	<RouterView :key="route.name" />
</template>
