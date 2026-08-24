<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from "@/stores/authStore"


import NavBar from "@/components/NavBar.vue"
import BaseButton from "@/components/BaseButton.vue"
import SymptomCard from "@/components/SymptomCard.vue"

const authStore = useAuthStore()
const userName = ref('')
const userType = ref('')

authStore.onReady((data) => {
	userName.value = data.name
	userType.value = data.user_type
})
</script>

<template>
	<div class="flex h-screen">
		<NavBar />

		<main class="bg-background size-full grid grid-cols-16 grid-rows-5 gap-8 p-10">
			<section class="bg-primary rounded-2xl col-span-10 row-span-2 px-5 py-8 flex flex-col justify-between h-full">
				<!-- Colocar data atual aqui -->
				<div class="text-textLight font-bold flex flex-col space-y-1">
					<p class="text-4xl">Bem vindo,</p>
					<p class="text-accent text-5xl">{{ userName }}</p>
					<p v-if="userType === 'paciente'" class="font-normal">Você está sentindo algum desconforto hoje? Registre!</p>
					<p v-else class="font-normal">Alguma consulta marcada? Verifique!</p>
				</div>
				<BaseButton v-if="userType === 'paciente'" path="historico-sintomas" theme="dark" mode="outline" icon="edit_square" class="w-full rounded-4xl!">
					Registrar sintoma
				</BaseButton>
				<BaseButton v-else theme="dark" mode="outline" icon="vital_signs" class="w-full rounded-4xl!">
					Verificar consultas
				</BaseButton>
			</section>

			<section v-if="userType === 'paciente'" class="bg-primary rounded-2xl col-span-6 row-span-5 p-5 flex flex-col justify-between h-full">
				<div class="flex flex-col h-full space-y-2">
					<div class="flex justify-between">
						<p class="text-textLight font-bold text-xl">Sintomas recentes</p>
						<RouterLink to="" class="text-accent flex">
							<p>Ver todos</p>
							<span class="material-symbols-rounded text-xl!">arrow_forward</span>
						</RouterLink>
					</div>
					<!-- Colocar cards de sintomas aqui -->
					 <SymptomCard :sintoma-persistente="false" />
				</div>
			</section>
			<section v-else class="bg-primary rounded-2xl col-span-6 row-span-5 p-5 flex flex-col justify-between h-full">
				<div class="flex flex-col h-full space-y-2">
					<div class="flex justify-between">
						<p class="text-textLight font-bold text-xl">Pacientes passados</p>
						<RouterLink to="" class="text-accent flex">
							<p>Ver todos</p>
							<span class="material-symbols-rounded text-xl!">arrow_forward</span>
						</RouterLink>
					</div>
					<!-- Colocar cards de paciente aqui -->
				</div>
			</section>

			<section v-if="userType === 'paciente'" class="bg-primary rounded-2xl col-span-5 row-span-3 p-5 flex flex-col justify-between items-center h-full">
				<p class="text-textLight font-bold text-xl">Informações de saúde:</p>
				<!-- Colocar informações de saúde aqui -->
				<BaseButton theme="dark" mode="outline" icon="edit_square" class="w-full rounded-4xl!">
					Editar informações de saúde
				</BaseButton>
			</section>
			<section v-else class="bg-primary rounded-2xl col-span-6 row-span-3 p-5 flex flex-col justify-between items-center h-full">
				<p class="text-textLight font-bold text-xl">Triagens:</p>
				<!-- Colocar cards de triagem aqui -->
				<BaseButton theme="dark" mode="outline" icon="person" class="w-full rounded-4xl!">
					Verificar triagens
				</BaseButton>
			</section>

			<section v-if="userType === 'paciente'" class="bg-primary rounded-2xl col-span-5 row-span-3 p-5 flex flex-col justify-between items-center h-full">
				<p class="text-textLight font-bold text-xl">Permissões médicas:</p>
				<!-- Colocar foto de profissionais permitidos aqui -->
				<BaseButton theme="dark" mode="outline" icon="edit_square" class="w-full rounded-4xl!">
					Editar permissões
				</BaseButton>
			</section>
			<section v-else class="bg-primary rounded-2xl col-span-4 row-span-3 p-5 flex flex-col justify-between items-center h-full">
				<p class="text-textLight font-bold text-xl">Relatórios:</p>
				<!-- Colocar cards de relatórios aqui -->
				<BaseButton theme="dark" mode="outline" icon="assignment" class="w-full rounded-4xl!">
					Verificar relatórios
				</BaseButton>
			</section>
		</main>
	</div>
</template>
