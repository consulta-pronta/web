<script setup lang="ts">
import { auth } from "@/database/firebase"
import { useAuthStore } from "@/stores/authStore"
import { onAuthStateChanged } from "firebase/auth"
import { useRouter } from "vue-router"

const router = useRouter()
onAuthStateChanged(auth, (user) => {
	if (!user) router.replace("/login")

	useAuthStore().onReady((user) => {
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
})
</script>

<template>
	<main class="h-screen flex items-center justify-center bg-background">
		<p class="text-textLight material-symbols-rounded animate-spin">loop</p>
	</main>
</template>
