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
		| "crm"
		| "cpf"
		| "datetime-local"
	theme?: "dark" | "light"
	mode?: "outline" | "fill" | "transparent"
	placeholder?: string
	icon?: string
	iconImage?: string
	required?: boolean
}
export type {Props as BaseInputProps}

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

let realType = ""
switch (props.type) {
	case "cpf":
	case "crm":
		realType = "text"
		break
	default:
		realType = props.type
		break
}

const formatCRM = (raw: string): string => raw.replace(/\D/g, "")

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatValue = (event: any) => {
	switch (props.type) {
		case "cpf":
			value.value = formatToCPF(event.target.value)
			break
		case "tel":
			value.value = formatToPhone(event.target.value)
			break
		case "crm":
			value.value = formatCRM(event.target.value)
	}
}

const maxLengths = {
	cpf: 14,
	tel: 15,
	crm: 6,
	password: maxPasswordLength
}

onMounted(() => {
	// @ts-expect-error: if max is undefined, it just won't set anything
	const max = maxLengths[props.type]
	if (max) {
		inputTag.value!.maxLength = max
	}
})
</script>

<template>
	<label class="flex items-center rounded-md px-4 gap-2 cursor-text" :class="broski">
		<span class="material-symbols-rounded pointer-events-none select-none" v-if="icon">
			{{ icon }}
		</span>

		<img
			v-if="iconImage"
			:src="iconImage"
			class="w-6 h-7 object-contain"
			alt=""
		/>
		<input
			class="py-3 outline-0 grow"
			:type="realType"
			:placeholder="placeholder"
			:required="required"
			@input="formatValue"
			v-model="value"
			ref="inputTag"
		/>
	</label>
</template>
