<script setup lang="ts">
import { useRouter, useRoute } from "vue-router"

const router = useRouter()
const route = useRoute()

export type ButtonState = "enabled" | "disabled" | "sync"

interface Props {
	type?: "button" | "submit" | "reset" | "nav"
	bgColor?: string
	border?: boolean
	borderColor?: string
	textColor?: string
	path?: string
	icon?: string
	iconColor?: string
	justify?: "center" | "start" | "end"
	text?: string
	rounded?: string | number
	w?: string | number
}

const props = withDefaults(defineProps<Props>(), {
	textColor: "textDark",
	type: "button",
	path: "self",
	iconColor: "textlight",
	justify: "center",
	rounded: "md",
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
</script>

<template>
	<button
		:type="props.type === 'nav' ? 'button' : props.type"
		@click="redirect()"
		:class="[
			`bg-${props.bgColor} text-${props.textColor}`,
			props.border ? `border-2 border-${props.borderColor}` : 'border-0',
			`px-5 rounded-${props.rounded} w-${props.w} h-11 flex items-center justify-${props.justify}`,
			props.type === 'nav' ? 'mb-2' : '',
			stateModel.valueOf() !== 'enabled' ? 'contrast-50' : 'cursor-pointer',
		]"
		:disabled="stateModel !== 'enabled'"
	>
		<span v-if="stateModel === 'sync'" class="material-symbols-rounded animate-spin">loop</span>
		<template v-else>{{ props.text }}</template>

		<span class="material-symbols-rounded text-4xl! select-none" :class="`text-${iconColor}`">
			{{icon}}
		</span>
		<slot></slot>
	</button>
</template>
