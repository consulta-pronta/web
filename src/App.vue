<script setup lang="ts">
import { auth } from './config/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'vue-router'


const router = useRouter()
onAuthStateChanged(auth, (user) => {
	router.push(user ? "/dashboard" : "/cadastro")
})
</script>

<template>
	<RouterView />
</template>
