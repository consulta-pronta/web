<script setup lang="ts">
import { ref } from "vue"
import { useNavbarStore } from "@/stores/navbarStore"
import { useAuthStore } from "@/stores/authStore"
import BaseLogo from "@/components/bases/BaseLogo.vue"
import BaseButton, { type BaseButtonProps } from "@/components/bases/BaseButton.vue"
import { auth } from "@/config/firebase"
import { signOut } from "firebase/auth"
import type { UserType } from "@/utils"
import router from "@/router/index.ts"

const navbarStore = useNavbarStore()
const authStore = useAuthStore()

const userType = ref<UserType | null>(null)
const openedMobile = ref(false)

const sharedAttributes = <BaseButtonProps>{
	theme: "textLight",
	mode: "transparent",
}

const openMobile = () => {
	openedMobile.value = !openedMobile.value
}

const logout = async () => {
	try {
		console.log(auth)
		await signOut(auth)
		router.push("/login")
	} catch (error) {
		console.error(error)
	}
}

authStore.onReady((data) => {
	userType.value = data.user_type
})
</script>

<template>
	<button
		@click="openMobile()"
		type="button"
		class="flex justify-center items-center size-12 bg-primary rounded-4xl absolute z-50 cursor-pointer shadow-xl/20 m-2 lg:hidden"
	>
		<span v-if="openedMobile" class="material-symbols-rounded text-3xl! text-textLight"
			>close</span
		>
		<span v-else class="material-symbols-rounded text-3xl! text-textLight">menu</span>
	</button>

	<aside
		class="h-screen bg-primary flex-col items-center justify-between transition-[width] duration-500 shrink-0 py-4 lg:sticky z-49 shadow-[5px_0_10px_-2px_rgba(0,0,0,0.3)] *:w-full *:flex *:flex-col"
		:class="[
			navbarStore.malfermita ? 'w-67' : 'w-17',
			openedMobile ? 'absolute flex' : 'hidden lg:flex',
		]"
	>
		<section>
			<BaseLogo
				class="mx-auto mt-10 lg:mt-0 transition-all object-cover duration-600 h-25"
				:class="navbarStore.malfermita ? 'w-30 lg:w-50' : 'w-10'"
			/>

			<nav>
				<BaseButton v-bind="sharedAttributes" icon="home" goto="/dashboard">
					<p>Início</p>
				</BaseButton>

				<BaseButton
					v-if="userType === 'patient'"
					v-bind="sharedAttributes"
					icon="browse_activity"
					goto="/historico-sintomas"
				>
					<p>Histórico</p>
				</BaseButton>
				<BaseButton
					v-else-if="userType === 'professional'"
					v-bind="sharedAttributes"
					icon="group"
					goto="#"
				>
					<p>Pacientes</p>
				</BaseButton>

				<BaseButton
					v-if="userType === 'patient'"
					v-bind="sharedAttributes"
					icon="pill"
					goto="#"
				>
					<p>Medicamentos</p>
				</BaseButton>
				<BaseButton
					v-else-if="userType === 'professional'"
					v-bind="sharedAttributes"
					icon="pill"
					goto="#"
				>
					<p>Farmácia</p>
				</BaseButton>

				<BaseButton
					v-if="userType !== 'admin'"
					v-bind="sharedAttributes"
					icon="assignment"
					goto="/relatorios"
				>
					<p>Relatórios</p>
				</BaseButton>

				<hr class="h-1 border-0 bg-primaryDark w-1/4 m-auto rounded-full opacity-70" />

				<BaseButton
					v-if="userType !== 'admin'"
					v-bind="sharedAttributes"
					icon="stethoscope"
					goto="/exames"
				>
					<p>Exames</p>
				</BaseButton>

				<BaseButton
					v-if="userType !== 'admin'"
					v-bind="sharedAttributes"
					icon="medical_services"
					goto="#"
				>
					<p>Consultas</p>
				</BaseButton>

				<BaseButton
					v-if="userType === 'patient'"
					v-bind="sharedAttributes"
					icon="home_health"
					goto="#"
				>
					<p>Hospitais</p>
				</BaseButton>

				<BaseButton
					v-else-if="userType === 'professional'"
					v-bind="sharedAttributes"
					goto="#"
					icon="shelves"
				>
					<p>Recursos</p>
				</BaseButton>

				<BaseButton v-bind="sharedAttributes" goto="#" icon="person">
					<p>Perfil</p>
				</BaseButton>
			</nav>
		</section>

		<section class="relative">
			<button
				@click="navbarStore.malfermi()"
				type="button"
				class="w-10 h-10 lg:flex items-center justify-center bg-primaryDark rounded-3xl cursor-pointer select-none absolute -right-5 bottom-full"
			>
				<span class="material-symbols-rounded text-textLight text-3xl!">
					<template v-if="navbarStore.malfermita">arrow_back</template>
					<template v-else>arrow_forward</template>
				</span>
			</button>

			<nav>
				<BaseButton v-bind="sharedAttributes" goto="#" icon="notifications">
					<p>Notificações</p>
				</BaseButton>

				<BaseButton v-bind="sharedAttributes" icon="settings" goto="#">
					<p>Configurações</p>
				</BaseButton>

				<BaseButton
					theme="error"
					mode="transparent"
					icon="logout"
					class="justify-start!"
					@click="logout()"
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
	@apply text-xl ml-8;
}

nav {
	@apply w-full flex flex-col gap-2 [button]:w-full overflow-clip;
}
</style>
