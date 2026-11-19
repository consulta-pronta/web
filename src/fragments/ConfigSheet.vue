<script setup lang="ts">
import BaseIconButton from "@/components/bases/BaseIconButton.vue"
import BaseToggle from "@/components/bases/BaseToggle.vue"

const fontSizeButtons = [
	{ icon: "text_decrease", size: "small" },
	{ icon: "match_case", size: "default" },
	{ icon: "text_increase", size: "big" },
]

const changeFontSize = (size: "default" | "big" | "small") => {
	document.documentElement.classList.remove("fontSmall", "fontBig")

	if (size != "default") {
		document.documentElement.classList.toggle(size === "big" ? "fontBig" : "fontSmall")
	}
}

const toggleReduceAnimations = () => {
	document.documentElement.classList.toggle('reducedAnimations')
}
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
						@click="changeFontSize(value.size)"
					/>
				</div>
			</fieldset>

			<fieldset>
				<p>Tema Escuro</p>
				<BaseToggle @click="toggleReduceAnimations" class="scale-70" />
			</fieldset>

			<fieldset>
				<p>Alto Contraste</p>
				<BaseToggle @click="toggleReduceAnimations" class="scale-70" />
			</fieldset>

			<fieldset>
				<p>Texto em Negrito</p>
				<BaseToggle @click="toggleReduceAnimations" class="scale-70" />
			</fieldset>

			<fieldset>
				<p>Reduzir animações</p>
				<BaseToggle @click="toggleReduceAnimations" class="scale-70" />
			</fieldset>
		</section>

		<section>
			<h2>Segurança</h2>
			
			<fieldset>
				<p>Alterar Senha</p>
				<BaseToggle @click="toggleReduceAnimations" class="scale-70" />
			</fieldset>

			<fieldset>
				<p>Autenticação por 2 fatores</p>
				<BaseToggle @click="toggleReduceAnimations" class="scale-70" />
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
	@apply flex flex-col gap-1;
}
section > h2 {
	@apply text-primaryLight font-medium mb-1 text-lg;
}

fieldset {
	@apply flex flex-row justify-between w-100 self-center;
}
</style>