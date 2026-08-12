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
	w?: string
	h?: string
}

const props = withDefaults(defineProps<Props>(), {
	textColor: "textDark",
	type: "button",
	path: "self",
	w: "125.75px",
	h: "11px",
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
		@click="redirect"
		:class="[
			`bg-${props.bgColor} text-${props.textColor}`,
			props.border ? `border-2 border-${props.borderColor}` : 'border-0',
			`px-5 rounded-md w-${props.w} h-${props.h} flex items-center justify-center cursor-pointer`,
		]"
	>
		<slot></slot>
	</button>
</template>
