<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
import UserPhoto from '@/components/UserPhoto.vue'

import { ref } from "vue"
import { useAuthStore } from "@/stores/authStore"
import { type UserType } from "@/components/ToggleUser.vue"

const authStore = useAuthStore()
const userName = ref("")
const userType = ref<UserType>()

authStore.onReady(async (data) => {
	userName.value = data.name
	userType.value = data.user_type
})
</script>

<template>
	<div class="flex h-screen overflow-hidden">
		<NavBar />

		<main
			class="bg-background size-full flex flex-col gap-10 lg:gap-12 xl:gap-15 p-5 lg:p-7 xl:p-10 overflow-y-auto"
		>
			<h1 class="text-4xl text-textLight font-bold text-center lg:text-start">
				Meu perfil
			</h1>

			<article class="flex justify-center">
				<div class="flex flex-col w-200 gap-10">
					<div class="flex gap-2">
						<UserPhoto />
						<div class="flex flex-col justify-center">
							<p class="text-2xl text-textLight font-bold">{{ userName }}</p>
							<p class="text-xl text-textLight font-medium opacity-80">Email</p>
						</div>
					</div>

					<hr class="h-1 border-0 bg-textLight w-full m-auto rounded-full opacity-70" />

					<section class="h-full grid grid-cols-2 grid-rows-2 gap-5">
						<div class="bg-primary rounded-2xl md:col-span-1 p-5 flex flex-col h-full gap-4 text-textLight font-bold">
							<p class="text-xl">Dados pessoais</p>
							<div class="grid grid-cols-2 gap-5">
								<div class="grid col-span-1">
									<p>{{ userName }} anos</p>
									<p class="font-normal opacity-70">Idade</p>
								</div>
								<div class="grid col-span-1">
									<p>{{ userName }}</p>
									<p class="font-normal opacity-70">Data de nascimento</p>
								</div>
								<div class="grid col-span-1">
									<p>{{ userName }}</p>
									<p class="font-normal opacity-70">Gênero</p>
								</div>
								<div class="grid col-span-1">
									<p>{{ userName }}</p>
									<p class="font-normal opacity-70">Sexo biológico</p>
								</div>
								<div class="grid col-span-1">
									<p>{{ userName }}</p>
									<p class="font-normal opacity-70">CPF</p>
								</div>
								<div class="grid col-span-1">
									<p>{{ userName }}</p>
									<p class="font-normal opacity-70">Local</p>
								</div>
							</div>
						</div>

						<div class="bg-primary rounded-2xl md:col-span-1 p-5 flex flex-col h-full gap-4 text-textLight font-bold">
							<p class="text-xl text-textLight font-bold">Meios de contato</p>
							<div class="flex flex-col gap-5">
								<div>
									<p>{{ userName }}</p>
									<p class="font-normal opacity-70">Telefone</p>
								</div>
								<div>
									<p>{{ userName }}</p>
									<p class="font-normal opacity-70">Email</p>
								</div>

								<hr class="h-0.5 border-0 bg-textLight w-full m-auto rounded-full opacity-70" />

								<p>Aplicativos conectados</p>
								<div>
									<p>{{ userName }}</p>
									<p class="font-normal opacity-70">Whatsapp</p>
								</div>
							</div>
						</div>

						<div class="bg-primary rounded-2xl md:col-span-2 p-5 flex flex-col justify-between h-full gap-4">
							<p class="text-xl text-textLight font-bold">Informações de saúde</p>

						</div>
					</section>
				</div>
			</article>
		</main>
	</div>
</template>
