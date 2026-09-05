<script setup lang="ts">
import BaseButton from "@/components/bases/BaseButton.vue"
</script>

<template>
	<section
		class="h-screen w-screen bg-background flex flex-col justify-center items-center gap-4"
	>
		<h1 class="text-9xl font-extrabold text-textLight">404 :(</h1>
		<p class="text-2xl text-textLight">Página não encontrada!</p>
		<BaseButton path="/">Voltar</BaseButton>
	</section>
</template>
