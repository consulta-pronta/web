<script setup lang="ts">
import { useAuthStore } from "@/stores/authStore"
import { useRouter } from "vue-router"

const router = useRouter()
useAuthStore().onReady((user) => {
	if (!user) router.replace("/login")

	router.replace(
		(() => {
			switch (user.user_type) {
				case "patient":
					return "/historico-sintomas"
				case "professional":
					return "/pacientes"
				case "admin":
					return "/dashboard"
			}
		})(),
	)
})
</script>

<template>
	<main class="h-screen flex items-center justify-center bg-background">
		<p class="text-textLight material-symbols-rounded animate-spin">loop</p>
	</main>
</template>
