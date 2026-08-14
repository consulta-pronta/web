<script setup lang="ts">
import BaseLogo from "@/components/BaseLogo.vue"
import BaseButton from "@/components/BaseButton.vue"
</script>

<template>
	<aside class="absolute w-1/8 h-full bg-primaryBlue flex flex-col items-center">
		<section class="w-full flex flex-col items-center">
			<BaseLogo />
				<nav>
					<BaseButton type="nav" icon="home" text-color="accent" icon-color="accent" justify="start">
						<p class="text-xl ml-8">Início</p>
					</BaseButton>
					<BaseButton type="nav" icon="browse_activity" text-color="textlight" justify="start">
						<p class="text-xl ml-8">Histórico</p>
					</BaseButton>
					<BaseButton type="nav" icon="home_health" text-color="textlight" justify="start">
						<p class="text-xl ml-8">Hospitais</p>
					</BaseButton>
					<BaseButton type="nav" icon="settings" text-color="textlight" justify="start">
						<p class="text-xl ml-8">Configurações</p>
					</BaseButton>
				</nav>

				<hr class="border-t-3 border-primarydark w-1/4 m-4 rounded-full opacity-70" />

				<nav class="opacity-75">
					<BaseButton type="nav" icon="stethoscope" text-color="textlight" justify="start">
						<p class="text-xl ml-8">Exames</p>
					</BaseButton>
					<BaseButton type="nav" icon="pill" text-color="textlight" justify="start">
						<p class="text-xl ml-8">Medicamentos</p>
					</BaseButton>
					<BaseButton type="nav" icon="medical_services" text-color="textlight" justify="start">
						<p class="text-xl ml-8">Consultas</p>
					</BaseButton>
					<BaseButton type="nav" icon="assignment" text-color="textlight" justify="start">
						<p class="text-xl ml-8">Relatórios</p>
					</BaseButton>
				</nav>
		</section>

		<section class="absolute bottom-0 w-full">
			<BaseButton type="nav" icon="notifications" text-color="textlight" justify="start">
				<p class="text-xl ml-8">Notificações</p>
			</BaseButton>
		</section>
	</aside>
</template>
