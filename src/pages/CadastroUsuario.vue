<script setup lang="ts">
import AuthBackground from "@/components/AuthBackground.vue"
import BaseButton from "@/components/BaseButton.vue"
import BaseInput from "@/components/BaseInput.vue"
import ToggleUser from "@/components/ToggleUser.vue"
//import { preview } from "vite"

import { ref } from "vue"

const status = ref("paciente")

const files = ref<File[]>([]);


//function handleFileSelect(e: Event) {
//	const input = e.target as HTMLInputElement;
//	const filesAsArrary = Array.from(input?.files || []); //FileList
//
//const newFiles = filesAsArrary.map((file) => ({
//		file,
//		name: file.name,
//		preview: URL.createObjectURL(file),
//	}));

//	files.value = files.value.concat(newFiles);
//}

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
				<label class="w-20.75 h-20.75 bg-primaryBlue rounded-full border-2 border-accent cursor-pointer">
					<input
						type="file"
						accept=".jpg,.jpeg,.png"
					/>
					<!---<div v-for="(file, index) in files" :key="index" class="preview">
      					<img :src="file.preview" :alt="file.name" style="max-width: 200px; max-height: 200px;" />
    				</div>-->
				</label>
				<p v-for="file in files" :key="file.name" class="text-red-500">
					{{ file.name }}
				</p>

				<ToggleUser v-model="status" class="mb-4" />

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

				<label>
					<BaseInput type="text" placeholder="Confirmar senha" icon="lock" w="116.75"/>
					<label icon="info"></label>
				</label>

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
