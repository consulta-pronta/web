<script setup lang="ts">
import AuthBackground from "@/components/AuthBackground.vue"
import BaseButton from "@/components/BaseButton.vue"
import BaseInput from "@/components/BaseInput.vue"
import ToggleUser from "@/components/ToggleUser.vue"
//import { preview } from "vite"


import { ref, onBeforeUnmount } from "vue"

const status = ref("paciente")

const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)

function handleFileSelect(event: Event) {
	const input = event.target as HTMLInputElement
	const file = input.files?.[0]

	if (!file) return

	if (previewUrl.value) {
		URL.revokeObjectURL(previewUrl.value)
	}

	selectedFile.value = file
	previewUrl.value = URL.createObjectURL(file)
}

onBeforeUnmount(() => {
	if (previewUrl.value) {
		URL.revokeObjectURL(previewUrl.value)
	}
})
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
			<div class="text-[16px] text-surface mb-3" >Preencha seus dados para começar.</div>

			<!--form-->
			<form
				@submit.prevent
				class="space-y-2 items-center justify-center flex flex-col"
			>

			<article class="flex flex-row relative inline-block">
				<label class="w-19.75 h-19.75 bg-primaryBlue rounded-full border-2 border-accent cursor-pointer overflow-hidden flex items-center justify-center">

					<input type="file" accept=".jpg,.jpeg,.png" class="hidden" @change="handleFileSelect" />

					<img v-if="previewUrl" :src="previewUrl" :alt="selectedFile?.name || 'Foto de perfil'" class="w-full h-full object-cover" />

					<span v-else>
						<img src="/img/IconeUsuarioPadrao.jpg">
					</span>
				</label>

				<div class="absolute-right w-6.75 h-6.75 rounded-full bg-accent absolute bottom-0 right-0 flex items-center justify-center">
					<section class="material-symbols-rounded">
						photo_camera
					</section>
				</div>

			</article>
				<ToggleUser v-model="status" class="mb-2" />

				<BaseInput type="text" placeholder="Nome" icon="person" />


				<!--INPUT reservado para o cadastro do CPF-->
				<BaseInput type="text" placeholder="CPF" icon="article" />

				<!--div reservado para o cadastro do email-->
				<BaseInput type="text" placeholder="E-Mail" icon="email"/>

				<!--input reservado para o cadastro do telefone-->

				<BaseInput type="tel" placeholder="Telefone" icon="phone"/>
				<!--div reservado para o cadastro da senha-->

				<BaseInput type="text" placeholder="Senha" icon="lock"/>
				<!--input reservado para a confirmação da senha-->

				<section class="relative flex flex-row">
						<BaseInput
							type="text"
							placeholder="Confirmar senha"
							icon="lock"
							class="w-116.25"
						/>

						<div class="relative flex items-center justify-center mx-1.5 group">
							<span
								class="material-symbols-rounded text-textlight text-[24px] cursor-help"
							>
								info
							</span>

							<!-- Overlay -->
							<div
								class="absolute right-0 bottom-full mb-2 w-64 p-3
								bg-textlight text-primarydark text-xs rounded-lg
								shadow-lg border
								opacity-0 invisible
								group-hover:opacity-100 group-hover:visible
								transition-opacity duration-200
								z-50"
							>
								<p class="leading-relaxed font-bold">
									A senha deve ter no mínimo 8 caracteres, contendo:<br>
									- Uma letra maiúscula <br>
									- Uma letra minúscula <br>
									- Um número <br>
								</p>
							</div>
						</div>
				</section>

				<RouterLink
					v-if="status === 'profissional'"
					to="/CadastroCRM"
					class="px-5 rounded-md w-125.75 h-7 flex items-center justify-center text-accent"
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
				<RouterLink to="/LoginUsuario">
					<p class="text-textlight">
						Já possui conta? <a href="" class="text-accent">Fazer Login</a>
					</p>
				</RouterLink>

				<BaseButton type="submit" bg-color="accent">Prosseguir</BaseButton>
			</form>
		</div>
	</AuthBackground>
</template>
