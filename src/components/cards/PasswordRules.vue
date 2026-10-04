<script setup lang="ts">
import type { PasswordRules } from "@/stores/signUpStore";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{
	rules: PasswordRules
}>()

const getRuleLabel = (rule: string) => {
	switch (rule) {
		case "minLength":
			return "Mínimo 8 caracteres"
		case "hasNumber":
			return "Pelo menos 1 número"
		case "hasLowercase":
			return "Pelo menos 1 letra minúscula"
		case "hasUppercase":
			return "Pelo menos 1 letra maiúscula"
		case "match":
			return "Senhas coincidem"
	}
}
</script>

<template>
	<article>
		<p
			v-for="(value, key) in rules"
			:key="key"
			:class="value ? 'text-textDark' : 'text-error'"
			class="flex items-center gap-2 text-sm py-0.5"
		>
			<span class="material-symbols-rounded">
				{{ value ? "check_circle" : "cancel" }}
			</span>
			{{ getRuleLabel(key) }}
		</p>
		<span
			class="w-4 h-4 bg-surface absolute -bottom-2 left-0 right-0 mx-auto rotate-45"
		></span>
	</article>
</template>