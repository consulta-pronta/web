<script setup lang="ts">
import { ref } from "vue"
import { useNavbarStore } from "@/stores/navbarStore"
import { useAuthStore } from "@/stores/authStore"
import BaseLogo from "@/components/bases/BaseLogo.vue"
import BaseLink from "@/components/bases/BaseLink.vue"
import BaseButton, { type BaseButtonProps } from "@/components/bases/BaseButton.vue"
import { auth } from "@/database/firebase"
import { signOut } from "firebase/auth"
import type { UserType } from "@/utils"
import router from "@/router/index"

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
				<BaseLink
					v-if="userType === 'patient'"
					to="/historico-sintomas"
					class="nav-link"
				>
					<span class="material-symbols-rounded select-none text-3xl!">
						browse_activity
					</span>
					<p>Histórico</p>
				</BaseLink>
				<BaseLink
					v-else-if="userType === 'professional'"
					to="/pacientes"
					class="nav-link"
				>
					<span class="material-symbols-rounded select-none text-3xl!">group</span>
					<p>Pacientes</p>
				</BaseLink>

				<BaseLink
					v-if="userType !== 'admin'"
					to="/relatorios"
					class="nav-link"
				>
					<span class="material-symbols-rounded select-none text-3xl!">assignment</span>
					<p>Relatórios</p>
				</BaseLink>

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

				<!-- <hr class="h-1 border-0 bg-primaryDark w-1/4 m-auto rounded-full opacity-70" /> -->

				<BaseLink
					v-if="userType !== 'admin'"
					to="/exames"
					class="nav-link"
				>
					<span class="material-symbols-rounded select-none text-3xl!">stethoscope</span>
					<p>Exames</p>
				</BaseLink>

				<BaseButton
					v-if="userType !== 'admin'"
					v-bind="sharedAttributes"
					icon="medical_services"
					goto="#"
				>
					<p>Consultas</p>
				</BaseButton>

				<BaseLink
					v-if="userType === 'patient'"
					to="permissoes"
					class="nav-link"
				>
					<span class="material-symbols-rounded select-none text-3xl!">how_to_reg</span>
					<p>Permissões</p>
				</BaseLink>

				<BaseButton
					v-else-if="userType === 'professional'"
					v-bind="sharedAttributes"
					goto="#"
					icon="shelves"
				>
					<p>Recursos</p>
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

				<BaseLink
					v-if="userType != 'admin'"
					to="perfil"
					class="nav-link"
				>
					<span class="material-symbols-rounded select-none text-3xl!">person</span>
					<p>Perfil</p>
				</BaseLink>

				<BaseLink
					to="logout"
					class="nav-link text-error!"
				>
					<span class="material-symbols-rounded select-none text-3xl!">logout</span>
					<p>Sair</p>
				</BaseLink>
			</nav>
		</section>
	</aside>
</template>

<style scoped>
@reference "@/assets/main.css";

p {
	@apply text-xl ml-8;
}

.nav-link {
	@apply px-5 rounded-md h-11 flex flex-row items-center justify-start text-textLight cursor-pointer hover:brightness-90;
}

.nav-link.router-link-active {
	@apply text-accent;
}

nav {
	@apply w-full flex flex-col gap-2 [button]:w-full [&>a]:w-full overflow-clip;
}
</style>
