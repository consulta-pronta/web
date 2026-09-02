<script setup lang="ts">
import { maxPasswordLength } from "@/stores/signUpStore"
import { formatToCPF, formatToPhone } from "brazilian-values"
import { onMounted, ref } from "vue"

interface Props {
	type?:
		| "text"
		| "password"
		| "email"
		| "number"
		| "tel"
		| "date"
		| "time"
		| "cpf"
		| "datetime-local"
	theme?: "dark" | "light"
	mode?: "outline" | "fill" | "transparent"
	placeholder?: string
	icon?: string
	required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	type: "text",
	theme: "light",
	mode: "fill",
})

const value = defineModel<string>()

const inputTag = ref<HTMLInputElement>()

const colors = {
	background: props.theme === "light" ? "surface" : "primary",
	text: props.theme === "light" ? "textDark" : "textLight",
	border: props.theme === "light" ? "textLight" : "textDark",
}

let broski = ""
switch (props.mode) {
	case "outline":
		broski = `bg-${colors.background} text-${colors.text} border-${colors.border} border-2`
		break

	case "fill":
		broski = `bg-${colors.background} text-${colors.text} border-0`
		break

	default:
		broski = `bg-transparent text-${colors.text} border-0`
		break
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatValue = (event: any) => {
	switch (props.type) {
		case "cpf":
			value.value = formatToCPF(event.target.value)
			break
		case "tel":
			value.value = formatToPhone(event.target.value)
			break
	}
}

onMounted(() => {
	switch (props.type) {
		case "cpf":
			inputTag.value!.maxLength = 14
			break
		case "tel":
			inputTag.value!.maxLength = 15
			break
		case "password":
			inputTag.value!.maxLength = maxPasswordLength
			break
	}
})
</script>

<template>
	<label class="flex items-center rounded-md px-4 gap-2 cursor-text" :class="broski">
		<span class="material-symbols-rounded pointer-events-none select-none" v-if="icon">
			{{ icon }}
		</span>

		<input
			id="input"
			class="py-3 outline-0 grow"
			:type="type"
			:placeholder="placeholder"
			:required="required"
			@input="formatValue"
			v-model="value"
			ref="inputTag"
		/>
	</label>
</template>
