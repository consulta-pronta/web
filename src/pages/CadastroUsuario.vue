<script setup lang="ts">
import AuthBackground from "@/components/AuthBackground.vue"
import BaseButton from "@/components/BaseButton.vue"
import BaseInput from "@/components/BaseInput.vue"
import ToggleUser from "@/components/ToggleUser.vue"

import { ref } from "vue"

const status = ref("paciente")
</script>
<template>
	<AuthBackground>
		<div class="w-1/2 box-border p-16">
			<div class="mb-4">
				<img src="/img/LogoTemporaria.png" />
			</div>
			<div>
				<p
					class="text-[30px] text-surface font-bold drop-shadow-[3px_3px_3px_rgba(0,0,0,1)]"
				>
					<!--Por algum motivo o "text-3x1" não está funcionando-->
					Organize seus sintomas.<br />
					Agilize sua consulta.
				</p>
			</div>
		</div>

		<div class="w-1/2 box-border items-center justify-center flex flex-col">
			<div class="text-[36px] text-surface font-bold mb-1">Crie uma Conta</div>
			<div class="text-[16px] text-surface mb-4" >Preencha seus dados para começar.</div>

			<!--form-->
			<form
				@submit.prevent
				class="space-y-2 items-center justify-center flex flex-col"
			>
				<input
					type="file"
					accept=".jpg,.jpeg,.png"
					class="w-20.75 h-20.75 bg-primaryBlue rounded-full border-2 border-accent text-transparent file:hidden cursor-pointer"
				/>

				<ToggleUser v-model="status" class="mb-4" />

				<BaseInput type="text" placeholder="Nome" icon="person" />


				<!--INPUT reservado para o cadastro do CPF-->
				<BaseInput type="text" placeholder="CPF" icon="article" />

				<!--div reservado para o cadastro do email-->
				<BaseInput type="text" placeholder="E-Mail" icon="email"/>

				<!--input reservado para o cadastro do telefone-->

				<BaseInput type="number" placeholder="Telefone" icon="phone"/>
				<!--div reservado para o cadastro da senha-->

				<BaseInput type="text" placeholder="Senha" icon="lock"/>
				<!--input reservado para a confirmação da senha-->

				<BaseInput type="text" placeholder="Confirmar senha" icon="lock"/>

				<RouterLink
					v-if="status === 'profissional'"
					to="/CadastroWebCRM"
					class="px-5 rounded-md w-125.75 h-11.75 flex items-center justify-center text-accent"
				>
					<img src="/img/IconStart.png" class="mx-2" />
					<p>Enviar CRM ou E-CRM</p>
				</RouterLink>

				<div>
					<p class="text-textlight">
						Li e aceito os <a href="" class="text-accent">Termos de Uso</a> e a
						<a href="" class="text-accent">Política de Privacidade</a>
					</p>
				</div>
				<div>
					<p class="text-textlight">
						Já possui conta? <a href="" class="text-accent">Fazer Login</a>
					</p>
				</div>

				<BaseButton type="submit" bg-color="accent">Prosseguir</BaseButton>
			</form>
		</div>
	</AuthBackground>
</template>
