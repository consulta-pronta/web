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
		| "custom-number"
		| "tel"
		| "date"
		| "time"
		| "crm"
		| "cpf"
		| "datetime-local"
	theme?: "dark" | "light"
	mode?: "outline" | "fill" | "transparent"
	placeholder?: string
	hint?: string
	icon?: string
	iconImage?: string
	required?: boolean
	numberMode?: "positive-integer" | "positive-decimal" | "signed-integer" | "signed-decimal"
}
export type { Props as BaseInputProps }

const props = withDefaults(defineProps<Props>(), {
	type: "text",
	theme: "light",
	mode: "fill",
	numberMode: "positive-decimal",
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

const realType = ref<string>()
switch (props.type) {
	case "cpf":
	case "crm":
	case "custom-number":
		realType.value = "text"
		break
	default:
		realType.value = props.type
		break
}

const formatCRM = (raw: string): string => raw.replace(/\D/g, "")

const formatCustomNumber = (raw: string): string => {
	const numberMode = props.numberMode ?? "positive-decimal"

	raw = raw.replace(/[^0-9.,-]/g, "")
	let formattedNumber = ""

	if (numberMode.startsWith("signed-") && raw.startsWith("-")) {
		formattedNumber += "-"
	}
	if (numberMode.endsWith("-decimal")) {
		const parts = raw.split(/[.,]/)
		formattedNumber += parts[0]
		if (parts.length > 1) {
			formattedNumber += "." + parts[1]
		}
	} else {
		formattedNumber += raw
	}

	return formattedNumber
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
		case "crm":
			value.value = formatCRM(event.target.value)
			break
		case "custom-number": {
			value.value = formatCustomNumber(event.target.value)
			break
		}
	}
}

const maxLengths = {
	cpf: 14,
	tel: 15,
	crm: 6,
	password: maxPasswordLength,
}

const passwordToggleIcon = ref<string>("visibility")

const togglePassword = () => {
	if (props.type !== "password") {
		return
	}
	const isVisible = realType.value === "password"

	realType.value = isVisible ? "text" : "password"
	passwordToggleIcon.value = isVisible ? "visibility_off" : "visibility"
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
		<span class="material-symbols-rounded pointer-events-none" v-if="icon">
			{{ icon }}
		</span>

		<img v-if="iconImage" :src="iconImage" class="w-6 h-7 object-contain" alt="" />
		<input
			class="py-3 outline-0 grow"
			:type="realType"
			:placeholder="placeholder"
			:required="required"
			@input="formatValue"
			v-model="value"
			:inputmode="type === 'custom-number' ? 'decimal' : undefined"
			ref="inputTag"
		/>

		<span
			class="material-symbols-rounded text-xl! cursor-pointer"
			v-if="type === 'password'"
			@click="togglePassword"
		>
			{{ passwordToggleIcon }}
		</span>
		<span class="text-sm opacity-80" v-if="hint">
			{{ hint }}
		</span>
	</label>
</template>
