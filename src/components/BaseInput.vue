<script setup lang="ts">
import { formatToCPF, formatToPhone } from "brazilian-values"
import { onMounted, ref } from "vue"

interface Props {
	type?: "text" | "password" | "email" | "number" | "tel" | "date" | "time" | "cpf"
	placeholder?: string
	icon?: string
	bgColor?: string
	w?: string | number
	textColor?: string
	placeholderColor?: string
	h?: string | number
	px?: string,
	required?: boolean,
}

const props = withDefaults(defineProps<Props>(), {
	type: "text",
	bgColor: "primaryBlue",
	w: "full",
	h: "11",
	textColor: "textlight",
	placeholderColor: "textlight",
	px: "5"
})

const inputTag = ref(null)
const value = defineModel<string>()

const formatValue = () => {
	switch (props.type) {
		case "cpf":
			value.value = formatToCPF(value.value)
			break
		case "tel":
			value.value = formatToPhone(value.value)
			break
	}
}

onMounted(() => {
	switch (props.type) {
		case "cpf":
			inputTag.value.maxLength = 14
			break
		case "tel":
			inputTag.value.maxLength = 15
			break
	}
})
</script>

<template>
	<div class="relative flex items-center w-full">
		<span
			class="material-symbols-rounded text-textlight absolute left-3 text-xl pointer-events-none"
		>
			{{ icon }}
		</span>

		<input
			v-model="value"
			ref="inputTag"

			:type="props.type"
			:placeholder="props.placeholder"
			:class="[
				`bg-${props.bgColor}`,
				`px-${props.px}`,
				`rounded-md`,
				`w-${props.w}`,
				`h-${props.h}`,
				`flex items-center`,
				`text-${props.textColor}`,
				`placeholder:text-${props.placeholderColor}`,
				'outline-none pl-10',
			]"
			:required="required"
			@input="formatValue"
		/>
	</div>
</template>
