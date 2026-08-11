<script setup lang="ts"></script>
<template>
	<body
		class="w-screen min-h-screen bg-[url(/img/BackgroundImg.jpg)] bg-cover bg-center bg-no-repeat"
	>
		<div
			class="absolute inset-0 bg-linear-to-r from-transparent from-30% to-backgroundRoxo to-55% flex flex-row"
		>
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
				<div class="w-full pb-8 px-30">
					<RouterLink to="/CadastroWeb" class="text-[24px] text-surface font-bold">
						Voltar
					</RouterLink>
				</div>

				<div class="flex-1 flex flex-col items-center justify-center">
					<div class="text-[36px] text-surface font-bold mb-1">Crie uma Conta</div>
					<div class="text-[16px] text-surface border-b border-surface">
						Envie seu CRM/E-CRM para confirmar sua identidade
					</div>

					<label
						for="arquivo"
						class="w-129.5 h-75.75 border border-dashed border-surface my-4 gap-2 flex flex-col items-center justify-center cursor-pointer"
					>
						<img src="/img/IconAdicionar.png" />
						<p class="text-accent">Tirar foto ou enviar documento</p>
						<p class="text-textlight text-bold">
							(Arquivo deve ser .jpg .jpeg .png .pdf)
						</p>
					</label>

					<input
						id="arquivo"
						type="file"
						accept=".jpg,.jpeg,.png,.pdf"
						class="text-transparent file:hidden"
					/>
				</div>
			</div>
		</div>
	</body>
</template>
