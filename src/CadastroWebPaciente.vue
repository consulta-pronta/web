<script setup lang="ts">
import buttonAccent from '@/components/ButtonAccent.vue'
</script>
<!--@click="$router.push(to)-->
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

					<div>
						<img src="/img/PerfilFoto.png">
					</div>

					<div class="flex flex-row bg-primarydark p-1 rounded-lg">
						<button class="bg-accent w-42.25 h-8.5 rounded-lg"><a href="" class=" text-primarydark">Paciente</a></button>
						<button class="bg-primarydark w-42.25 h-8.5 rounded-lg"><a href="" class=" text-accent">Profissional</a></button>
					</div>

					<!--input reservado para o cadastro do nome-->
					<input type="text" placeholder="Nome" class="bg-primaryBlue px-5 rounded-md w-125.75 h-11.75 flex items-center text-textlight placeholder:text-textlight outline-none">

					<!--div reservado para o cadastro do CPF-->
					<input type="text" placeholder="CPF" class="bg-primaryBlue px-5 rounded-md w-125.75 h-11.75 flex items-center text-textlight placeholder:text-textlight outline-none">

					<!--div reservado para o cadastro do email-->
					<input type="text" placeholder="E-mail" class="bg-primaryBlue px-5 rounded-md w-125.75 h-11.75 flex items-center text-textlight placeholder:text-textlight outline-none">

					<!--input reservado para o cadastro do telefone-->
					<input type="text" placeholder="Telefone" class="bg-primaryBlue px-5 rounded-md w-125.75 h-11.75 flex items-center text-textlight placeholder:text-textlight outline-none">

					<!--div reservado para o cadastro da senha-->
					<div class="w-125.75 h-11.75 flex flex-row">
						<input type="text" placeholder="Confirmação da Senha" class="bg-primaryBlue px-5 rounded-md w-116.75 h-11.75 flex items-center text-textlight placeholder:text-textlight outline-none">
						<div class="flex items-center justify-center w-9 h-11.75" >
							<img src="/img/Info.png" class="w-6 h-6">
						</div>
					</div>

					<!--input reservado para a confirmação da senha-->
					<input type="text" placeholder="Confirmação da Senha" class="bg-primaryBlue px-5 rounded-md w-125.75 h-11.75 flex items-center text-textlight placeholder:text-textlight outline-none">

					<div>
						<p class="text-textlight">Li e aceito os <a href="" class="text-accent">Termos de Uso</a> e a <a href="" class="text-accent">Política de Privacidade</a></p>
					</div>
					<div>
						<p class="text-textlight">Já possuiconta? <a href="" class="text-accent">Fazer Login</a></p>
					</div>

					<buttonAccent text="Prosseguir"/>

				</form>
			</div>

		</div>
	</body>
</template>
