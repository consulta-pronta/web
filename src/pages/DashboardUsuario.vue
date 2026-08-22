<script setup lang="ts">
import NavBar from "@/components/NavBar.vue"
import BaseButton from "@/components/BaseButton.vue"
import SymptomBlock from "@/components/SymptomBlock.vue";

// Integrar com o banco de dados
</script>

<template>
	<div class="flex h-screen">
		<NavBar />

		<main class="bg-background size-full grid grid-cols-10 grid-rows-2 gap-8 p-10">
			<section class="bg-primary rounded-2xl col-span-6 px-5 py-8 flex flex-col justify-between h-full">
				<!-- Colocar data atual aqui -->
				<div class="text-textLight font-bold flex flex-col space-y-1">
					<p class="text-4xl">Bem vindo,</p>
					<p class="text-accent text-5xl">Usuário</p>
					<p class="font-normal">Você está sentindo algum desconforto hoje? Registre!</p>
				</div>
				<BaseButton theme="dark" mode="outline" icon="edit_square" class="w-full rounded-4xl!">
					Registrar sintoma
				</BaseButton>
			</section>
			<section class="bg-primary rounded-2xl col-span-4 row-span-2 p-5 flex flex-col justify-between h-full">
				<div class="flex flex-col h-full space-y-2">
					<div class="flex justify-between">
						<p class="text-textLight font-bold text-xl">Sintomas recentes</p>
						<RouterLink to="" class="text-accent flex">
							<p>Ver todos</p>
							<span class="material-symbols-rounded text-xl!">arrow_forward</span>
						</RouterLink>
					</div>
					<SymptomBlock :sintoma-persistente="false" />
				</div>
			</section>
			<section class="bg-primary rounded-2xl col-span-3 p-5 flex flex-col justify-between items-center h-full">
				<div>
					<p class="text-textLight font-bold text-xl">Informações de saúde:</p>
				</div>
				<BaseButton theme="dark" mode="outline" icon="edit_square" class="w-full rounded-4xl!">
					Editar informações de saúde
				</BaseButton>
			</section>
			<section class="bg-primary rounded-2xl col-span-3 p-5 flex flex-col justify-between items-center h-full">
				<div>
					<p class="text-textLight font-bold text-xl">Permissões médicas:</p>
				</div>
				<BaseButton theme="dark" mode="outline" icon="edit_square" class="w-full rounded-4xl!">
					Editar permissões
				</BaseButton>
			</section>
		</main>
	</div>
</template>
