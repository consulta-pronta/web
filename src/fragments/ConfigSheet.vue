<script setup lang="ts">
import BaseIconButton from "@/components/bases/BaseIconButton.vue"
import BaseSelect from "@/components/bases/BaseSelect.vue"
import BaseToggle from "@/components/bases/BaseToggle.vue"
import { useConfigStore, type ContrastLevel, type FontSize } from "@/stores/configStore"
import { onMounted } from "vue"

const configStore = useConfigStore()

const fontSizeButtons: { icon: string; size: FontSize }[] = [
	{ icon: "text_decrease", size: "small" },
	{ icon: "match_case", size: "default" },
	{ icon: "text_increase", size: "big" },
]

const contrastLevels: { value: ContrastLevel, label: string }[] = [
	{ value: "default", label: "Padrão" },
	{ value: "high", label: "Médio" },
	{ value: "high++", label: "Alto" },
]

onMounted(() => {
	configStore.contrastLevel = "default"
})
</script>

<template>
	<article>
		<section>
			<h2>Acessibilidade</h2>
			
			<fieldset>
				<p>Tamanho do Texto</p>
				<div class="flex flex-row gap-2">
					<BaseIconButton
						v-for="value in fontSizeButtons"
						:icon="value.icon"
						theme="bright"
						mode="square"
						@click="configStore.fontSize = value.size"
					/>
				</div>
			</fieldset>

			<fieldset>
				<p>Tema Claro</p>
				<BaseToggle v-model="configStore.lightTheme"  />
			</fieldset>

			<fieldset>
				<p>Alto Contraste</p>
				<BaseSelect
					v-model="configStore.contrastLevel"
					default-value="Padrão"
					mode="outline"
					class="w-25"
				>
					<option
						v-for="item in contrastLevels"
						:value="item.value"
					>
						{{  item.label }}
					</option>
				</BaseSelect>
			</fieldset>

			<fieldset>
				<p>Texto em Negrito</p>
				<BaseToggle v-model="configStore.boldText" />
			</fieldset>

			<fieldset>
				<p>Reduzir animações</p>
				<BaseToggle v-model="configStore.reduceAnimations" />
			</fieldset>
		</section>

		<section v-if="false">
			<h2>Segurança</h2>
			
			<fieldset>
				<p>Alterar Senha</p>
				<BaseToggle />
			</fieldset>

			<fieldset>
				<p>Autenticação por 2 fatores</p>
				<BaseToggle />
			</fieldset>
		</section>
	</article>
</template>

<style scoped>
@reference "@/assets/main.css";

article {
	@apply flex flex-col gap-4 text-textLight;
}

section {
	@apply flex flex-col gap-2;
}
section > h2 {
	@apply text-primaryLight font-medium mb-1 text-lg;
}

fieldset {
	@apply flex flex-row justify-between w-100 self-center items-center;
}
</style>