<script setup lang="ts">
import BaseSelect from '@/components/bases/BaseSelect.vue'
import BaseButton from '@/components/bases/BaseButton.vue'
import BaseInput from '@/components/bases/BaseInput.vue'

interface Props {
	registers: number,
	intensity: number,
}

const props = withDefaults(defineProps<Props>(), {
	registers: 0,
	intensity: 1,
})
</script>

<template>
	<form @submit.prevent class="flex flex-col place-items-center relative gap-2">
		<p class="text-textLight text-lg text-medium text-center">
			Gere um relatório completo do seus sintomas para compartilhar com seu médico.
		</p>
		<!--Barra de Pesquisa-->
		<div class="relative flex items-center w-full h-11 bg-surface rounded-sm">
			<span class="material-symbols-rounded text-primaryDark absolute left-3 pointer-events-none">
				content_paste
			</span>
			<input type="text" placeholder="Título do Relatório" class="text-primaryDark placeholder-primaryDark w-full h-11 outline-none pl-10"/>
		</div>
		<!--Data-->
		<section class="w-full bg-surface rounded-md p-2">
			<article class="relative">
				<span class="material-symbols-rounded text-primaryDark absolute left-3 pointer-events-none">
					calendar_today
				</span>
				<p class="text-primaryDark text-base text-semibold mb-1 pl-10">
					Período
				</p>
			</article>

			<article class="flex w-full gap-2 text-textDark">
				<span class="flex-1 flex-col">
					<p>
						De:
					</p>
					<BaseInput type="date" name="data" theme="dark" class="brightness-80 rounded-lg" />
				</span>
				<span class="flex-1 flex-col">
					<p>
						Até:
					</p>
					<BaseInput type="time" name="horario" theme="dark" class="brightness-80 rounded-lg" />
				</span>
			</article>
		</section>
		<!--Permissão de visualização-->
		<BaseSelect
			theme="light"
			icon="person"
			defaultValue="Profissionais que podem visualizar"
			required
			class="w-full"
		>
			<option value="1">Cláudio Silva</option>
		</BaseSelect>
		<!--Visualizar sintomas incluídos-->
		<div class="flex w-full h-11">
			<BaseButton type="button" theme="primary" class="bg-primary w-full h-11! text-textLight mb-3 rounded-3xl">Visualizar sintomas incluídos</BaseButton>
		</div>
		<!--Resumo do Período-->
		<section class="grid grid-cols-2 gap-2 w-full text-textLight">
			<div class="col-span-2">
				<p class="text-textLight text-base font-bold">
					Resumo do período
				</p>
			</div>

			<div class="flex flex-col border border-textLight rounded-md p-3 text-center ">

				<article class="flex justify-center text-center gap-1">
					<span class="material-symbols-rounded">
						book_4
					</span>
					<p>
						{{ registers }}
					</p>
				</article>
				<p class="text-sm font-bold">
					Registros
				</p>

			</div>

			<div class="flex flex-col border border-textLight rounded-md p-3 text-center">
				<article class="flex justify-center text-center gap-1">
					<span class="material-symbols-rounded text-warning">
						vital_signs
					</span>
					<p>
						{{ intensity }}
					</p>

				</article>
				<p class="text-sm font-bold">
					Intensidade Média
				</p>
			</div>

			<div class="flex border border-textLight rounded-md p-2 col-span-2 justify-center gap-0.5">
				<span class="flex material-symbols-rounded text-3xl! text-center text-sucess">
					location_on
				</span>
				<article class="flex flex-col">
					<p class="text-[10px]">
						Área mais afetada
					</p>
					<p class="text-sm font-bold">
						Cabeça
					</p>
				</article>
			</div>
		</section>
		<!--Botão-->
		<BaseButton type="submit" theme="accent" icon="add_circle" class="w-full">Criar relatório</BaseButton>
		<!--Criar e Baixar-->
		<BaseButton type="submit" icon="download" class="w-full bg-background! text-accent! gap-1">Criar e baixar relatório em PDF</BaseButton>
	</form>
</template>
