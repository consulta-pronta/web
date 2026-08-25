<script setup lang="ts">
import { ref } from 'vue'
import { useNavbarStore } from "@/stores/navbarStore"
import { useAuthStore } from "@/stores/authStore";

import BaseLogo from "@/components/BaseLogo.vue"
import BaseButton from "@/components/BaseButton.vue"
import { auth } from "@/config/firebase";
import { signOut } from "firebase/auth";

const navbarStore = useNavbarStore()

const authStore = useAuthStore()
const userType = ref('')

authStore.onReady((data) => {
	userType.value = data.user_type
})
</script>

<template>
	<aside :class="[
		'h-screen bg-primary flex flex-col items-center justify-between transition-all duration-500 shrink-0',
		navbarStore.malfermita ? 'w-67' : 'w-20'
	]">
		<section class="w-full flex flex-col overflow-hidden">
			<BaseLogo class="mx-auto transition-all object-cover duration-500"
				:class="navbarStore.malfermita ? 'w-50 my-6' : 'w-10 my-10'"
			/>
			<nav class="*:w-full">
				<BaseButton
					type="nav"
					icon="home"
					theme="dark"
					mode="transparent"
					path="dashboard"
				>
					<p class="text-xl ml-8">Início</p>
				</BaseButton>

				<template v-if="userType === 'paciente'">
					<BaseButton
						type="nav"
						icon="browse_activity"
						theme="dark"
						mode="transparent"
						path="historico-sintomas"
					>
						<p class="text-xl ml-8">Histórico</p>
					</BaseButton>
					<BaseButton
						type="nav"
						icon="home_health"
						theme="dark"
						mode="transparent"
					>
						<p class="text-xl ml-8">Hospitais</p>
					</BaseButton>
				</template>

				<template v-else>
					<BaseButton
						type="nav"
						icon="group"
						theme="dark"
						mode="transparent"
					>
						<p class="text-xl ml-8">Pacientes</p>
					</BaseButton>
					<BaseButton
						type="nav"
						icon="pill"
						theme="dark"
						mode="transparent"
					>
						<p class="text-xl ml-8">Farmácia</p>
					</BaseButton>
				</template>
				<BaseButton
					type="nav"
					icon="settings"
					theme="dark"
					mode="transparent"
				>
					<p class="text-xl ml-8">Configurações</p>
				</BaseButton>
			</nav>

			<hr class="border-t-3 border-primaryDark w-1/4 my-4 rounded-full opacity-70 mx-auto" />

			<nav class="opacity-75 *:w-full">
				<BaseButton
					type="nav"
					icon="stethoscope"
					theme="dark"
					mode="transparent"
				>
					<p class="text-xl ml-8">Exames</p>
				</BaseButton>
				<BaseButton
					v-if="userType === 'paciente'"
					type="nav"
					icon="pill"
					theme="dark"
					mode="transparent"
				>
					<p class="text-xl ml-8">Medicamentos</p>
				</BaseButton>
				<BaseButton
					v-else
					type="nav"
					icon="shelves"
					theme="dark"
					mode="transparent"
				>
					<p class="text-xl ml-8">Recursos</p>
				</BaseButton>
				<BaseButton
					type="nav"
					icon="medical_services"
					theme="dark"
					mode="transparent"
				>
					<p class="text-xl ml-8">Consultas</p>
				</BaseButton>
				<BaseButton
					type="nav"
					icon="assignment"
					theme="dark"
					mode="transparent"
				>
					<p class="text-xl ml-8">Relatórios</p>
				</BaseButton>
			</nav>
		</section>

		<section class="w-full flex flex-col bottom-0 relative">
			<button @click="navbarStore.malfermi()" type="button" class="w-10 h-10 bg-primaryDark absolute rounded-3xl flex items-center justify-center cursor-pointer -right-5 bottom-20">
				<span class="material-symbols-rounded text-textLight text-3xl!">
					<p v-if="navbarStore.malfermita">arrow_back</p>
					<p v-else>arrow_forward</p>

				</span>
			</button>

			<div class="overflow-hidden">
				<BaseButton
					type="nav"
					icon="notifications"
					theme="dark"
					mode="transparent"
				>
					<p class="text-xl ml-8">Notificações</p>
				</BaseButton>

				<BaseButton
					type="nav"
					icon="person"
					theme="dark"
					mode="transparent"
				>
					<p class="text-xl ml-8">Perfil</p>
				</BaseButton>

				<BaseButton
					type="nav"
					icon="logout"
					theme="dark"
					mode="transparent"
					exit
					@click="signOut(auth)"
				>
					<p class="text-xl ml-8">Sair</p>
				</BaseButton>
			</div>
		</section>
	</aside>
</template>
