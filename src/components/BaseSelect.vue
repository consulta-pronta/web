<script setup lang="ts">
interface Props {
	theme?: "dark" | "light"
	mode?: "outline" | "fill" | "transparent"
	icon?: string
	required?: boolean
	defaultValue?: string
}
const props = withDefaults(defineProps<Props>(), {
	type: "text",
	theme: "light",
	mode: "fill",
	defaultValue: "",
})

const colors = {
	background: props.theme === "light" ? "surface" : "primary",
	text: props.theme === "light" ? "textDark" : "textLight",
	border: props.theme === "light" ?  "textLight" : "textDark"
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

const value = defineModel<string>()
</script>

<template>
	<label
		class="
			flex items-center justify-between gap-2
			relative h-12 px-4
			rounded-md cursor-pointer
		"
		:class="broski"
	>
		<span
			class="material-symbols-rounded pointer-events-none select-none"
			v-if="icon"
		>
			{{ icon }}
		</span>

		<select
			class="
				absolute left-0 w-full grow
				px-12 py-3 outline-0
				cursor-pointer appearance-none
			"
			:required="required"
			v-model="value"
		>
			<option v-if="defaultValue" value="" selected hidden>
				{{ defaultValue }}
			</option>
			<slot></slot>
		</select>
		
		<span
			class="material-symbols-rounded pointer-events-none select-none"
		>
			expand_more
		</span>
	</label>
</template>