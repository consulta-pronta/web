<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'

import { ref } from 'vue';

const status = ref('Paciente');

const toggleStatus = (newStatus: string) => {
    status.value = newStatus
}
</script>
<template>
	<body class="w-screen min-h-screen bg-[url(/img/BackgroundImg.jpg)] bg-cover bg-center bg-no-repeat">
		<div class="absolute inset-0 bg-linear-to-r from-transparent from-30% to-backgroundRoxo to-55% flex flex-row ">

			<div class="w-1/2 box-border p-16">
				<div class="mb-4">
					<img src="/img/LogoTemporaria.png">
				</div>
				<div>
					<p class="text-[30px] text-surface font-bold drop-shadow-[3px_3px_3px_rgba(0,0,0,1)]"> <!--Por algum motivo o "text-3x1" não está funcionando-->
						Organize seus sintomas.<br>
						Agilize sua consulta.
					</p>
				</div>
			</div>

			<div class="w-1/2 box-border items-center justify-center flex flex-col">
				<div class="text-[36px] text-surface font-bold mb-1">
					Crie uma Conta
				</div>
				<div class="text-[16px] text-surface">
					Preencha seus dados para começar.
				</div>

				<!--form-->
				<form action="" method="POST" class="space-y-2 items-center justify-center flex flex-col">

					<input type="file" accept=".jpg,.jpeg,.png" class="w-20.75 h-20.75 bg-primaryBlue rounded-full border-2 border-accent text-transparent file:hidden cursor-pointer" />

					<div class="flex flex-row bg-primarydark p-1 rounded-lg">
						<button type="button" @click="toggleStatus('Paciente')" :class="status === 'Paciente' ? 'bg-accent text-primarydark' : 'bg-primarydark text-accent'" class="w-42.25 h-8.5 rounded-lg flex items-center justify-center">
							Paciente
						</button>

						<button type="button" @click="toggleStatus('Profissional')" :class="status === 'Profissional' ? 'bg-accent text-primarydark' : 'bg-primarydark text-accent'" class="w-42.25 h-8.5 rounded-lg flex items-center justify-center">
							Profissional
						</button>
					</div>


					<!--input reservado para o cadastro do nome-->
					<input type="text" placeholder="Nome" class="bg-primaryBlue px-5 rounded-md w-125.75 h-11.75 flex items-center text-textlight placeholder:text-textlight outline-none">

					<!--div reservado para o cadastro do CPF-->
					<input v-if="status === 'Paciente'" type="text" placeholder="CPF" class="bg-primaryBlue px-5 rounded-md w-125.75 h-11.75 flex items-center text-textlight placeholder:text-textlight outline-none">
					<input v-else type="text" placeholder="E-mail" class="bg-primaryBlue px-5 rounded-md w-125.75 h-11.75 flex items-center text-textlight placeholder:text-textlight outline-none">
					<!--div reservado para o cadastro do email-->
					<input v-if="status === 'Paciente'" type="text" placeholder="E-mail" class="bg-primaryBlue px-5 rounded-md w-125.75 h-11.75 flex items-center text-textlight placeholder:text-textlight outline-none">
					<input v-else type="text" placeholder="Telefone" class="bg-primaryBlue px-5 rounded-md w-125.75 h-11.75 flex items-center text-textlight placeholder:text-textlight outline-none">
					<!--input reservado para o cadastro do telefone-->
					<input v-if="status === 'Paciente'" type="text" placeholder="Telefone" class="bg-primaryBlue px-5 rounded-md w-125.75 h-11.75 flex items-center text-textlight placeholder:text-textlight outline-none">
					<div v-else class="w-125.75 h-11.75 flex flex-row">
						<input type="text" placeholder="Confirmação da Senha" class="bg-primaryBlue px-5 rounded-md w-116.75 h-11.75 flex items-center text-textlight placeholder:text-textlight outline-none">
						<div class="flex items-center justify-center w-9 h-11.75" >
							<img src="/img/Info.png" class="w-6 h-6">
						</div>
					</div>
					<!--div reservado para o cadastro da senha-->
					<div v-if="status === 'Paciente'" class="w-125.75 h-11.75 flex flex-row">
						<input type="text" placeholder="Confirmação da Senha" class="bg-primaryBlue px-5 rounded-md w-116.75 h-11.75 flex items-center text-textlight placeholder:text-textlight outline-none">
						<div class="flex items-center justify-center w-9 h-11.75" >
							<img src="/img/Info.png" class="w-6 h-6">
						</div>
					</div>
					<input v-else type="text" placeholder="Confirmação da Senha" class="bg-primaryBlue px-5 rounded-md w-125.75 h-11.75 flex items-center text-textlight placeholder:text-textlight outline-none">

					<!--input reservado para a confirmação da senha-->
					<input v-if="status === 'Paciente'" type="text" placeholder="Confirmação da Senha" class="bg-primaryBlue px-5 rounded-md w-125.75 h-11.75 flex items-center text-textlight placeholder:text-textlight outline-none">
					<RouterLink v-else to="/CadastroWebCRM" class= "px-5 rounded-md w-125.75 h-11.75 flex items-center justify-center text-accent">
						<img src="/img/IconStart.png" class="mx-2">
						<p>Enviar CRM ou E-CRM</p>
					</RouterLink>

					<div>
						<p class="text-textlight">Li e aceito os <a href="" class="text-accent">Termos de Uso</a> e a <a href="" class="text-accent">Política de Privacidade</a></p>
					</div>
					<div>
						<p class="text-textlight">Já possuiconta? <a href="" class="text-accent">Fazer Login</a></p>
					</div>

					<BaseButton type="submit" text="Prosseguir" bg-color="accent"/>

				</form>
			</div>
		</div>
	</body>
</template>
