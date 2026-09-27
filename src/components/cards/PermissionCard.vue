```vue
<script setup lang="ts">
import UserPhoto from "@/components/UserPhoto.vue"
import BaseButton from "@/components/bases/BaseButton.vue"

defineProps<{
	nome: string
}>()
</script>

<template>
	<div class="grid grid-cols-9 w-full lg:w-[75%] border border-textLight rounded-lg px-6 py-2 items-center">
		<section class="flex col-span-3">
			<UserPhoto />

			<div class="flex flex-col items-center ml-6">
				<p class="text-xs md:text-xl text-textLight mt-2">
					{{ nome }}
				</p>

				<div class="grid grid-cols-2 mt-1">
					<section class="flex flex-col text-accent items-center">
						<span class="material-symbols-rounded pointer-events-none text-base!">
							chat
						</span>

						<p class="text-[8px]">
							Mensagens
						</p>
					</section>

					<section class="flex flex-col text-accent items-center">
						<span class="material-symbols-rounded pointer-events-none text-base!">
							mail
						</span>

						<p class="text-[8px]">
							E-mail
						</p>
					</section>
				</div>
			</div>
		</section>

		<section class="grid grid-cols-10 col-span-5 gap-1">
			<BaseButton class="col-span-5">
				<p class="text-base text-textLight">
					Consultas
				</p>
			</BaseButton>

			<BaseButton class="col-span-5">
				<p class="text-base text-textLight">
					Prontuario
				</p>
			</BaseButton>
		</section>

		<section class="relative">
			<div class="flex justify-center items-center">
				<button
					type="button"
					@click="toggleVisuperm()"
					class="absolute right cursor-pointer"
				>
					<span class="material-symbols-rounded text-textLight text-4xl!">
						{{ VisuPermissao ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}
					</span>
				</button>
			</div>
		</section>

		<article
			v-if="VisuPermissao"
			class="grid grid-cols-3 col-span-9 pt-5"
		>
			<section class="grid text-surface text-base md:text-xl font-bold">
				<p class="text-center">
					Dados Profissionais
				</p>

				<div class="font-medium text-normal">
					<p>
						CRM:
						<span class="font-normal text-sm">
							lorem ipsum
						</span>
					</p>

					<p>
						Função:
						<span class="font-normal text-sm">
							lorem ipsum
						</span>
					</p>

					<p>
						Pediátria:
						<span class="font-normal text-sm">
							lorem ipsum
						</span>
					</p>

					<p>
						Local:
						<span class="font-normal text-sm">
							lorem ipsum
						</span>
					</p>
				</div>
			</section>

			<section class="grid text-surface text-xl font-bold">
				<p class="text-center">
					Meios de contato
				</p>

				<div class="font-medium text-sm">
					<p>
						<span class="material-symbols-rounded text-textLight text-xl!">
							call
						</span>
						lorem ipsum
					</p>

					<p>
						<span class="material-symbols-rounded text-textLight text-xl!">
							email
						</span>
						lorem ipsum
					</p>
				</div>
			</section>

			<section class="grid text-surface text-xl font-bold">
				<p class="text-center">
					Permissões
				</p>

				<section class="font-medium text-sm">
					<div class="grid grid-cols-3">
						<div class="flex col-span-2">
							<span class="material-symbols-rounded text-textLight text-xl! pr-1">
								text_fields
							</span>

							<p>
								Permissões para...:
							</p>
						</div>

						<input
							type="checkbox"
							class="h-4 w-4 appearance-none rounded border border-textLight bg-transparent checked:bg-textLight checked:border-textLight"
						/>
					</div>
				</section>
			</section>
		</article>
	</div>
</template>
```
