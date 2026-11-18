<script setup lang="ts">
import { onMounted } from "vue"
import { signOut } from "firebase/auth"
import { useToast } from "vue-toastification"
import { auth } from "@/database/firebase"
import router from "@/router"

const toast = useToast()

onMounted(async () => {
	try {
		await signOut(auth)
		toast.success("Você saiu da sua conta.")
		await router.replace({ name: "login" })
	} catch (error) {
		console.error("Failed to sign out:", error)
		toast.error("Não foi possível sair da sua conta.")
	}
})
</script>

<template>
	<p>Encerrando sessão...</p>
</template>