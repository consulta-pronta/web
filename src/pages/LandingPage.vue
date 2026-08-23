<script setup lang="ts">
import { auth } from '@/config/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'vue-router'


const router = useRouter()
onAuthStateChanged(auth, (user) => {
	router.push(user ? "/dashboard" : "/cadastro")
})
</script>

<template>
	<main class="h-screen flex items-center justify-center bg-background">
		<p class="text-textLight material-symbols-rounded animate-spin">loop</p>
	</main>
</template>
