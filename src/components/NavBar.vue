<script setup lang="ts">
import { ref } from 'vue'

import BaseLogo from "@/components/BaseLogo.vue"
import BaseButton from "@/components/BaseButton.vue"

const malfermita = ref(true)
const malfermi = () => {
	malfermita.value = !malfermita.value
}
</script>

<template>
	<aside :class="[
		'absolute h-full bg-primaryBlue flex flex-col items-center transition-all',
		malfermita ? 'w-67' : 'w-20'
	]">
		<section class="w-full flex flex-col">
			<BaseLogo />
			<nav>
				<BaseButton
					type="nav"
					icon="home"
					theme="dark"
					mode="transparent"
					path="dashboard"
				>
					<p v-if="malfermita" class="text-xl ml-8">Início</p>
				</BaseButton>
				<BaseButton
					type="nav"
					icon="browse_activity"
					theme="dark"
					mode="transparent"
					path="historico-sintomas"
				>
					<p v-if="malfermita" class="text-xl ml-8">Histórico</p>
				</BaseButton>
				<BaseButton
					type="nav"
					icon="home_health"
					theme="dark"
					mode="transparent"
				>
					<p v-if="malfermita" class="text-xl ml-8">Hospitais</p>
				</BaseButton>
				<BaseButton
					type="nav"
					icon="settings"
					theme="dark"
					mode="transparent"
				>
					<p v-if="malfermita" class="text-xl ml-8">Configurações</p>
				</BaseButton>
			</nav>

			<hr class="border-t-3 border-primarydark w-1/4 my-4 rounded-full opacity-70 mx-auto" />

			<nav class="opacity-75">
				<BaseButton
					type="nav"
					icon="stethoscope"
					theme="dark"
					mode="transparent"
				>
					<p v-if="malfermita" class="text-xl ml-8">Exames</p>
				</BaseButton>
				<BaseButton
					type="nav"
					icon="pill"
					theme="dark"
					mode="transparent"
				>
					<p v-if="malfermita" class="text-xl ml-8">Medicamentos</p>
				</BaseButton>
				<BaseButton
					type="nav"
					icon="medical_services"
					theme="dark"
					mode="transparent"
				>
					<p v-if="malfermita" class="text-xl ml-8">Consultas</p>
				</BaseButton>
				<BaseButton
					type="nav"
					icon="assignment"
					theme="dark"
					mode="transparent"
				>
					<p v-if="malfermita" class="text-xl ml-8">Relatórios</p>
				</BaseButton>
			</nav>
		</section>

		<section class="absolute bottom-0 w-full">
			<div @click="malfermi()" class="w-10 h-10 bg-primarydark absolute -top-10 -right-5"></div>
			<BaseButton
				type="nav"
				icon="notifications"
				theme="dark"
				mode="transparent"
			>
				<p v-if="malfermita" class="text-xl ml-8">Notificações</p>
			</BaseButton>
		</section>
	</aside>
</template>
