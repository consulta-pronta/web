<script setup lang="ts">
interface Props {
	theme?: "dark" | "light"
	mode?: "outline" | "fill" | "transparent"
	icon?: string
	required?: boolean
	defaultValue?: string
}
const props = withDefaults(defineProps<Props>(), {
	theme: "light",
	mode: "fill",
	defaultValue: "",
})

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

const value = defineModel<string>()
value.value = ""
</script>

<template>
	<label
		class="flex items-center justify-between gap-2 relative h-12 px-2 rounded-md cursor-pointer"
		:class="broski"
	>
		<span class="material-symbols-rounded pointer-events-none select-none" v-if="icon">
			{{ icon }}
		</span>

		<select
			class="absolute inset-0 w-full grow py-3 outline-0 cursor-pointer appearance-none *:text-textDark"
			:class="icon? 'px-12' : 'px-3'"
			:required="required"
			v-model="value"
		>
			<option value="" hidden>
				{{ defaultValue }}
			</option>
			<slot></slot>
		</select>

		<span class="material-symbols-rounded pointer-events-none select-none ml-auto">
			expand_more
		</span>
	</label>
</template>
