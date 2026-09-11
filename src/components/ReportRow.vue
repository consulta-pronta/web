<script setup lang="ts">
import { useTemplateRef } from 'vue'
import BaseDialog from '@/components/bases/BaseDialog.vue'
import BaseButton from '@/components/bases/BaseButton.vue'

interface Report {
	id: string
	nome: string
	data: string
	horario: string
	show: boolean
}

const props = defineProps<{
	report: Report
}>()

function toggle(report: Report) {
	report.show = !report.show
}

const allowedProfessionals = useTemplateRef('allowedProfessionals')
const formRename = useTemplateRef('formRename')
const definePassword = useTemplateRef('definePassword')
const viewReport = useTemplateRef('viewReport')

</script>

<template>
	<tr class="border-t border-primaryDark">
		<td class="font-bold flex justify-center items-center relative m-1.5">
			<span class="material-symbols-rounded text-base! md:text-2xl! text-primarydark absolute left-1 md:left-3">
				description
			</span>
			<p>
				{{ report.nome }}
			</p>
		</td>

		<td class="text-center">{{ report.id }}</td>

		<td class="text-center">{{ report.data }}</td>

		<td class="relative">
			<div class="flex justify-center items-center">
				{{ report.horario }}
				<button type="button" @click="toggle(report)" class="absolute right-1 md:right-2 cursor-pointer anchor-name-[--botoeira]">
					<span class="material-symbols-rounded text-primaryDark">
						{{ 'more_horiz' }}
					</span>
				</button>
			</div>
		</td>

		<div v-if="report.show" class="flex flex-col text-primaryDark absolute right-0 top-[anchor(top)] bg-surface z-10 outline-1 outline-primary rounded-lg p-1 position-anchor-[--botoeira]">
			<BaseButton icon="download" theme="primaryDark" mode="transparent" class="text-sm! p-2! justify-start">
				Baixar relatório
			</BaseButton>
			<BaseButton @click="allowedProfessionals" icon="shield_toggle" theme="primaryDark" mode="transparent" class="text-sm! p-2! justify-start">
				Profissionais permitidos
			</BaseButton>
			<BaseButton @click="formRename" icon="edit_square" theme="primaryDark" mode="transparent" class="text-sm! p-2! justify-start">
				Renomear relatório
			</BaseButton>
			<BaseButton icon="delete" theme="primaryDark" mode="transparent" class="text-sm! p-2! justify-start">
				Apagar relatório
			</BaseButton>
			<BaseButton @click="definePassword" icon="lock" theme="primaryDark" mode="transparent" class="text-sm! p-2! justify-start">
				Definir senha
			</BaseButton>
			<BaseButton @click="viewReport?.toggle()" icon="visibility" theme="primaryDark" mode="transparent" class="text-sm! p-2! justify-start">
				Visualizar relatório
			</BaseButton>
		</div>
	</tr>

	<BaseDialog title="Dor constante" ref="viewReport">
		<form class="flex flex-col gap-2 overflow-y-auto max-h-[80vh]">
			<!--Textos-->
			<section class="text-textLight">
				<p class="text-base font-light italic">
					Relatório: ID51966
				</p>
			</section>
			<section class="text-textLight">
				<span class="flex text-base">
					<p class="font-bold">
						Período:
					</p>
					<p class="font-normal mx-0.5">
						10 de abr 2026 a 18 abr 2026
					</p>
				</span>
				<span class="flex text-base">
					<p class="font-bold">
						Duração:
					</p>
					<p class="font-normal mx-0.5">
						8 dias (20 dias)
					</p>
				</span>
			</section>

			<!--Paciente-->
			<section class="flex just">
				<UserPhoto/>
				<article class="flex flex-col text-textLight text-xs justify-center">
					<p class="text-base font-bold">
						Cláudio Silva
					</p>
					<p>
						claudiosilva213@email.com
					</p>
					<p>
						(27) 99722-3725
					</p>
				</article>
			</section>

			<!--Informações-->
			<article>
				<p class="text-textLight text-xl font-bold mt-2">
					Resumo Geral
				</p>
				<section class="flex w-full p-2 gap-2 text-background">
					<div class="bg-surface rounded-xl flex flex-col w-full p-2.5">
						<p class="text-sm font-medium">
							Sintoma mais comum:
						</p>
						<p class="text-xl font-bold">
							Dor nas costas
						</p>
						<p class="text-sm font-medium">
							2 semanas
						</p>
						<div class="flex bg-error rounded-3xl text-surface w-fit items-center p-1">
							<span class="material-symbols-rounded text-xs! mx-1.5">
								warning
							</span>
							<p class="text-xs p-2 md:p-1 lg:p-0.5">
								Prioridade Alta
							</p>
						</div>
					</div>

					<div class="flex flex-col w-full bg-surface text-background rounded-xl p-2.5">
						<span class="flex">
							<p class="text-base font-bold">
								10/04:
							</p>
							<p class="text-error text-base font-normal mx-0.5">
								8 de intensidade
							</p>
						</span>
						<span class="flex">
							<p class="text-base font-bold">
								12/04:
							</p>
							<p class="text-sucess text-base font-normal mx-0.5">
								4 de intensidade
							</p>
						</span>
						<span class="flex">
							<p class="text-base font-bold">
								14/04:
							</p>
							<p class="text-warning text-base font-normal mx-0.5">
								5 de intensidade
							</p>
						</span>
					</div>
				</section>
			</article>

			<!--Cronologia-->
			<p class="text-textLight text-xl font-bold">
				Cronologia do Sintoma
			</p>

			<section class="flex flex-col gap-1 p-2 max-h-full">
				<div class="flex">
					<article class="flex flex-col justify-center items-center w-10">
						<div class="flex justify-center items-center">
							<span class="material-symbols-rounded bg-primaryLight text-background rounded-full">
								vital_signs
							</span>
						</div>
						<hr class="flex-1 w-px bg-primaryLight border-0">
					</article>
					<article class="flex flex-col w-full bg-surface text-background rounded-lg p-3">
						<p class="text-lg font-bold">
							Dor nas costas ao levantar peso
						</p>
						<p class="text-sm font-medium">
							(16 abr. 2026)
						</p>
						<p class="text-sm font-medium">
							- Intensidade 6/10; "Começa a doer um pouco despois de eu levantar, mas para de doer em pouco tempo."
						</p>
					</article>
				</div>

				<div class="flex">
					<article class="flex flex-col justify-center items-center w-10">
						<div class="flex justify-center items-center">
							<span class="material-symbols-rounded bg-primaryLight text-background rounded-full">
								vital_signs
							</span>
						</div>
						<hr class="flex-1 w-px bg-primaryLight border-0">
					</article>
					<article class="flex flex-col w-full bg-surface text-background rounded-lg p-3">
						<p class="text-lg font-bold">
							Dor nas costas ao levantar peso
						</p>
						<p class="text-sm font-medium">
							(16 abr. 2026)
						</p>
						<p class="text-sm font-medium">
							- Intensidade 6/10; "Começa a doer um pouco despois de eu levantar, mas para de doer em pouco tempo."
						</p>
					</article>
				</div>

				<div class="flex">
					<article class="flex flex-col justify-center items-center w-10">
						<div class="flex justify-center items-center">
							<span class="material-symbols-rounded bg-primaryLight text-background rounded-full">
								vital_signs
							</span>
						</div>
						<hr class="flex-1 w-px bg-primaryLight border-0">
					</article>
					<article class="flex flex-col w-full bg-surface text-background rounded-lg p-3">
						<p class="text-lg font-bold">
							Dor nas costas ao levantar peso
						</p>
						<p class="text-sm font-medium">
							(16 abr. 2026)
						</p>
						<p class="text-sm font-medium">
							- Intensidade 6/10; "Começa a doer um pouco despois de eu levantar, mas para de doer em pouco tempo."
						</p>
					</article>
				</div>

				<!--Visão geral-->
				<p class="text-textLight text-xl font-bold mt-2">
					Visão Geral
				</p>

				<article class="flex justify-center w-full">
					<table class="w-full border-separate border-spacing-0.5">
						<thead class="gap-0.5 text-background font-semibold">
							<tr>
								<th class="bg-surface">Sintoma</th>
								<th class="bg-surface">Duração</th>
								<th class="bg-surface">Ocorrência</th>
							</tr>
						</thead>
						<tbody class="gap-0.5 text-background">
							<tr>
								<th class="bg-textLight">Dor nas Costas</th>
								<th class="bg-textLight">20 dias</th>
								<th class="bg-textLight">9 Ocorrências</th>
							</tr>
							<tr>
								<th class="bg-textLight">Estômago Ardendo</th>
								<th class="bg-textLight">4 dias</th>
								<th class="bg-textLight">3 Ocorrências</th>
							</tr>
						</tbody>
					</table>
				</article>
			</section>
		</form>
	</BaseDialog>

	<!--Renomear-->
	<section v-if="AddRenomear === true" class="dialog">
		<form class="bg-primary lg:w-[45%] h-[30%] rounded-[25px] px-15 py-5 flex flex-col place-items-center relative">
			<button type="button" @click="toggleName">
				<span class="material-symbols-rounded absolute left-0 text-[38px]! text-textLight ml-4 cursor-pointer">
					arrow_back
				</span>
			</button>
			<p class="text-textLight text-2xl text-semibold mb-6">
				Renomear Relatório
			</p>

			<div class="relative flex items-center w-full h-11 bg-surface rounded-sm mx-4 mb-4">
				<span class="material-symbols-rounded text-primarydark absolute left-3 pointer-events-none">
					edit_square
				</span>
				<input type="text" placeholder="Nome" class="text-primaryDark placeholder-primaryDark w-full h-full outline-none pl-10"/>
			</div>

			<BaseButton type="submit" theme="accent" class="mt-2 w-[60%] gap-1">Mudar Nome</BaseButton>

		</form>
	</section>

	<!--Mudar Senha-->
	<section v-if="AddSenha === true" class="dialog">
		<form class="bg-primary w-[70%] lg:w-[45%] h-[35%] rounded-[25px] px-15 py-5 flex flex-col place-items-center relative">
			<button type="button" @click="togglePassword">
				<span class="material-symbols-rounded absolute left-0 text-[38px]! text-textLight ml-4 cursor-pointer">
					arrow_back
				</span>
			</button>
			<p class="text-textLight text-2xl text-semibold mb-6">
				Digite sua nova senha
			</p>

			<div class="relative flex items-center w-full h-11 bg-surface rounded-sm mx-4 mb-2">
				<span class="material-symbols-rounded text-primaryDark absolute left-3 pointer-events-none">
					lock
				</span>
				<input type="password" placeholder="Senha" class="text-primaryDark placeholder-primaryDark w-full h-full outline-none pl-10"/>
			</div>
			<div class="relative flex items-center w-full h-11 bg-surface rounded-sm mx-4 mb-4">
				<span class="material-symbols-rounded text-primaryDark absolute left-3 pointer-events-none">
					lock
				</span>
				<input type="password" placeholder="Digite Novamente" class="text-primaryDark placeholder-primaryDark w-full h-full outline-none pl-10"/>
			</div>

			<BaseButton type="submit" theme="accent" class="mt-2 w-[60%] gap-1">Mudar Senha</BaseButton>

		</form>
	</section>

	<section v-if="AddPermissao === true" class="dialog">
		<form class="bg-primary w-[70%] lg:w-[45%] h-[40%] rounded-[25px] px-10 py-5 flex flex-col place-items-center relative">
			<!-- Seta de retorno -->
			<button type="button" @click="togglePermissao">
				<span class="material-symbols-rounded absolute left-0 top-0 text-[30px]! text-textLight m-4 cursor-pointer" >
					arrow_back
				</span>
			</button>

			<!-- Título -->
			<div class="flex flex-col items-center mb-3">
				<span class="material-symbols-rounded text-[30px]! text-textLight">
					admin_panel_settings
				</span>
				<p class="text-textLight text-xl font-semibold">
					Permissões de visualização
				</p>
			</div>

			<!-- Permissões -->
			<div class="flex flex-col gap-2 w-full">
				<label class="flex items-center w-full h-11 bg-surface rounded-md px-3 cursor-pointer">
					<input type="checkbox" class="w-4 h-4 mr-3 accent-primary"/>
					<span class="text-primaryDark text-sm">
						Dra. Cláudia Leite
					</span>
				</label>

				<label class="flex items-center w-full h-11 bg-surface rounded-md px-3 cursor-pointer">
					<input type="checkbox" class="w-4 h-4 mr-3 accent-primary"/>
					<span class="text-primaryDark text-sm">
						Dr. Auzio Varella
					</span>
				</label>

			</div>

			<BaseButton type="submit" theme="accent" class="mt-4 w-[60%] gap-1">Salvar</BaseButton>

		</form>
	</section>
</template>
