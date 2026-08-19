<script setup lang="ts">
import { useRouter, useRoute } from "vue-router"

const router = useRouter()
const route = useRoute()

export type ButtonState = "enabled" | "disabled" | "sync"

interface Props {
	type?: "button" | "submit" | "reset" | "nav"
	theme?: "dark" | "light"
	mode?: "outline" | "fill" | "transparent"
	path?: string
	icon?: string
	text?: string
}

const props = withDefaults(defineProps<Props>(), {
	type: "button",
	path: "self",
	theme: "light",
	mode: "fill",
})

const redirect = () => {
	if (props.type === "button") {
		if (props.path === "self") {
			router.push(route.path)
		} else {
			router.push(`${props.path}`)
		}
	}
}

const stateModel = defineModel<ButtonState>("state", { default:"enabled" })

const colors = {
	background: props.theme === "light" ? "accent" : "primarydark",
	text: props.theme === "light" ? "textDark" : "accent",
	border: props.theme === "light" ? "textDark" : "accent",
}
let broski = ""
switch (props.mode) {
	case "outline":
		broski = `bg-${colors.background} text-${colors.text} border-${border} border-2`
		break

	case "fill":
		broski = `bg-${colors.background} text-${colors.text} border-0`
		break

	default:
		broski = `text-${colors.text} bg-transparent`
		break
}
</script>

<template>
	<button
		:type="props.type === 'nav' ? 'button' : props.type"
		@click="redirect()"
		:class="[
			'px-5 rounded-md h-11 flex items-center',
			`${broski}`,
			props.type === 'nav' ? 'mb-2' : '',
			stateModel.valueOf() !== 'enabled' ? 'contrast-50' : 'cursor-pointer',
		]"
		:disabled="stateModel !== 'enabled'"
	>
		<span v-if="stateModel === 'sync'" class="material-symbols-rounded animate-spin">loop</span>
		<template v-else>{{ props.text }}</template>

		<span class="material-symbols-rounded text-4xl! select-none">
			{{icon}}
		</span>
		<slot></slot>
	</button>
</template>
