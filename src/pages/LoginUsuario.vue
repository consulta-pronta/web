<script setup lang="ts">
import { ref } from "vue"

import AuthBackground from "@/components/AuthBackground.vue"
import BaseButton from "@/components/BaseButton.vue"
import BaseInput from "@/components/BaseInput.vue"
import CompleteLogo from "@/components/CompleteLogo.vue"
import ToggleUser from "@/components/ToggleUser.vue"

const status = ref("paciente")
</script>

<template>
	<AuthBackground>
		<CompleteLogo />
		<div class="w-1/2 box-border items-center justify-center flex flex-col">
			<div class="text-[36px] text-surface font-bold mb-1">Bem-Vindo</div>
			<div class="text-[16px] text-surface mb-4">
				Faça o
				<p class="text-accent inline">login</p>
				para acessar os seus dados.
			</div>

			<form
				@submit.prevent
				class="space-y-2 items-center justify-center flex flex-col"
			>
				<ToggleUser v-model="status" class="mb-4" />

				<BaseInput type="text" placeholder="Nome" icon="person" />
				<BaseInput type="password" placeholder="Senha" icon="lock" class="mb-5" />
				<BaseButton type="submit" bg-color="accent">Entrar</BaseButton>

				<RouterLink to="">
					<p class="text-textlight">Esqueceu a senha?</p>
				</RouterLink>

				<hr class="border-t-2 border-surface w-full m-4" />

				<BaseButton
					bg-color="primarydark"
					border
					border-color="accent"
					text-color="accent"
					path="cadastro"
					class="mt-2"
				>
					Cadastrar nova conta
				</BaseButton>
			</form>
		</div>
	</AuthBackground>
</template>
