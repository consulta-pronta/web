<script setup lang="ts">
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

			</div>

		</div>
	</body>
</template>
