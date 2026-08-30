<script setup lang="ts">
import { ref } from "vue"
import { useNavbarStore } from "@/stores/navbarStore"
import { useAuthStore } from "@/stores/authStore";
import BaseLogo from "@/components/BaseLogo.vue"
import BaseButton from "@/components/BaseButton.vue"
import { auth } from "@/config/firebase"
import { signOut } from "firebase/auth"


const navbarStore = useNavbarStore()
const authStore = useAuthStore()


const userType = ref('')


// Weird syntax is for v-bind to recognize these as valid
const sharedAttributes = <{ theme: "textLight", mode: "transparent" }>{
	theme: "textLight",
	mode: "transparent"
}


authStore.onReady((data) => {
	userType.value = data.user_type
})
</script>

<template>
	<aside class="h-screen bg-primary flex flex-col items-center justify-between transition-[width] duration-500 shrink-0 py-4 sticky"
		:class="navbarStore.malfermita ? 'w-67' : 'w-17'"
	>
		<section class="w-full flex flex-col overflow-hidden">
			<BaseLogo class="mx-auto transition-all object-cover duration-600 h-25"
				:class="navbarStore.malfermita ? 'w-50' : 'w-10'" 
			/>
			<nav class="button:w-full flex flex-col gap-2">
				<BaseButton v-bind="sharedAttributes"
					icon="home"
					goto="/dashboard"
				>
					<p>Início</p>
				</BaseButton>

				<template v-if="userType === 'paciente'">
					<BaseButton v-bind="sharedAttributes"
						icon="browse_activity"
						goto="/historico-sintomas"
					>
						<p>Histórico</p>
					</BaseButton>

					<BaseButton v-bind="sharedAttributes"
						icon="home_health"
						goto="#"
					>
						<p>Hospitais</p>
					</BaseButton>
				</template>

				<template v-else>
					<BaseButton v-bind="sharedAttributes"
						icon="group"
						goto="#"
					>
						<p>Pacientes</p>
					</BaseButton>
					<BaseButton v-bind="sharedAttributes"
						icon="pill"
						goto="#"
					>
						<p>Farmácia</p>
					</BaseButton>
				</template>
				<BaseButton v-bind="sharedAttributes"
					icon="settings"
						goto="#"
				>
					<p>Configurações</p>
				</BaseButton>

				<hr class="h-1 border-0 bg-primaryDark w-1/4 m-auto rounded-full opacity-70" />

				<BaseButton v-bind="sharedAttributes"
					icon="stethoscope"
					goto="#"
				>
					<p>Exames</p>
				</BaseButton>
				<BaseButton v-bind="sharedAttributes"
					v-if="userType === 'paciente'"
					goto="#"
					icon="pill"
				>
					<p>Medicamentos</p>
				</BaseButton>
				<BaseButton v-bind="sharedAttributes"
					v-else
					goto="#"
					icon="shelves"
				>
					<p>Recursos</p>
				</BaseButton>
				<BaseButton v-bind="sharedAttributes"
					goto="#"					
					icon="medical_services"
				>
					<p>Consultas</p>
				</BaseButton>
				<BaseButton v-bind="sharedAttributes"
					goto="#"					
					icon="assignment"
				>
					<p>Relatórios</p>
				</BaseButton>
			</nav>
		</section>

		<section class="w-full flex flex-col gap-2 bottom-0 relative">
			<button @click="navbarStore.malfermi()" type="button"
				class="
					w-10 h-10 flex items-center justify-center
					bg-primaryDark rounded-3xl cursor-pointer select-none
					absolute -right-5 bottom-full
				"
			>
				<span class="material-symbols-rounded text-textLight text-3xl!">
					<template v-if="navbarStore.malfermita">arrow_back</template>
					<template v-else>arrow_forward</template>
				</span>
			</button>

			<nav class="button:w-full flex flex-col gap-2 overflow-clip">
				<BaseButton v-bind="sharedAttributes"
					goto="#"
					icon="notifications"
				>
					<p>Notificações</p>
				</BaseButton>

				<BaseButton v-bind="sharedAttributes"
					icon="person"
					goto="#"
				>
					<p>Perfil</p>
				</BaseButton>

				<BaseButton
					theme="error"
					mode="transparent"
					icon="logout"
					class="justify-start!"
					@click="signOut(auth)"
				>
					<p>Sair</p>
				</BaseButton>
			</nav>
		</section>
	</aside>
</template>

<style scoped>
	@reference "@/assets/main.css";

	p {
		@apply text-xl ml-8
	}
</style>
