<script setup lang="ts">
import { useRouter, useRoute } from "vue-router"

const router = useRouter()
const route = useRoute()

interface Props {
	type?: "button" | "submit" | "reset"
	bgColor: string
	border?: boolean
	borderColor?: string
	textColor?: string
	path?: string
	icon?: string
	iconColor?: string
}

const props = withDefaults(defineProps<Props>(), {
	textColor: "textDark",
	type: "button",
	path: "self",
	iconColor: "textlight",
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
</script>

<template>

	<button
		:type="props.type"
		@click="redirect()"
		:class="[
			`bg-${props.bgColor} text-${props.textColor}`,
			props.border ? `border-2 border-${props.borderColor}` : 'border-0',
			'px-5 rounded-md w-125.75 h-11 flex items-center justify-center cursor-pointer',
		]"
	>
		<span
			class="material-symbols-rounded text-xl select-none"
			:class="`text-${iconColor}`"
			>{{ icon }}</span
		>
		<slot></slot>
	</button>
</template>
