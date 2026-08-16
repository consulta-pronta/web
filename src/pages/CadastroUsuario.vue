<script setup lang="ts">
import { ref } from "vue"

import AuthBackground from "@/components/AuthBackground.vue"
import BaseButton from "@/components/BaseButton.vue"
import BaseLogo from "@/components/BaseLogo.vue"
import BaseInput from "@/components/BaseInput.vue"
import ToggleUser from "@/components/ToggleUser.vue"
import UserPhoto from "@/components/UserPhoto.vue"

import { useSignUpStore } from "@/stores/signUpStore"

const signUpStore = useSignUpStore()
const status = ref("paciente")
</script>
<template>
	<AuthBackground>
		<BaseLogo text complete />

		<div class="w-1/2 box-border items-center justify-center flex flex-col">
			<div class="text-[36px] text-surface font-bold mb-1">Crie uma Conta</div>
			<div class="text-[16px] text-surface mb-3">Preencha seus dados para começar.</div>

			<!--form-->
			<form
				@submit.prevent="signUpStore.submitForm"
				class="space-y-2 items-center justify-center flex flex-col w-116.25"
			>
				<UserPhoto borderColor="accent"/>

				<ToggleUser v-model="status" class="mb-4" />

				<BaseInput type="text" placeholder="Nome" icon="person" v-model="signUpStore.name" />
				<BaseInput type="text" placeholder="CPF" icon="article" v-model="signUpStore.cpf" />
				<BaseInput type="text" placeholder="E-Mail" icon="email" v-model="signUpStore.email" />
				<BaseInput type="tel" placeholder="Telefone" icon="phone" v-model="signUpStore.phone" />
				<BaseInput type="password" placeholder="Senha" icon="lock" v-model="signUpStore.password" />

				<section class="relative flex flex-row w-116.25">
					<BaseInput type="password" placeholder="Confirmar senha" icon="lock" v-model="signUpStore.confirmPassword" />

					<div class="relative flex items-center justify-center mx-1.5 group">
						<span
							class="material-symbols-rounded text-textlight text-[24px] cursor-help"
						>
							info
						</span>

						<!-- Overlay -->
						<div
							class="absolute right-0 bottom-full mb-2 w-64 p-3 bg-textlight text-primarydark text-xs rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-50"
						>
							<p class="leading-relaxed font-bold">
								A senha deve ter no mínimo 8 caracteres, contendo:<br />
								- Uma letra maiúscula <br />
								- Uma letra minúscula <br />
								- Um número <br />
							</p>
						</div>
					</div>
				</section>

				<BaseButton
					v-if="status === 'profissional'"
					type="button"
					text-color="accent"
					icon-color="accent"
					icon="article"
					path="cadastroCRM"
				>
					Enviar CRM ou E-CRM
				</BaseButton>

				<div>
					<p class="text-textlight">
						Li e aceito os <a href="" class="text-accent">Termos de Uso</a> e a
						<a href="" class="text-accent">Política de Privacidade</a>
					</p>
				</div>
				<RouterLink to="login">
					<p class="text-textlight">
						Já possui conta? <a href="" class="text-accent">Fazer Login</a>
					</p>
				</RouterLink>

				<BaseButton type="submit" bg-color="accent">Prosseguir</BaseButton>
			</form>
		</div>
	</AuthBackground>
</template>
