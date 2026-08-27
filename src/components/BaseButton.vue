<script setup lang="ts">
import { computed, onMounted } from "vue"
import { useRouter } from "vue-router"


export type ButtonState = "enabled" | "disabled" | "sync"


interface Props {
	type?: "button" | "submit" | "reset"
	theme?: "accent" | "primary" | "primaryLight" | "primaryDark" | "textLight" | "error"
	mode?: "outline" | "fill" | "transparent"
	icon?: string
	iconPosition?: "left" | "right"
	goto?: string
}

const props = withDefaults(defineProps<Props>(), {
	type: "button",
	theme: "primary",
	mode: "fill",
	iconPosition: "left",
})
const stateModel = defineModel<ButtonState>("state", {
	default: "enabled"
})


const router = useRouter()


const isDisabled = computed(() => stateModel.value !== "enabled")


const textColor = computed(() => {
	if (props.mode !== "fill") {
		return `text-${props.theme}`
	}
	switch (props.theme) {
		case "accent": return "text-textDark"
		case "primary": return "text-textLight"
		case "primaryLight": return "text-textDark"
		case "error": return "text-textLight"
		case "textLight": return "text-textDark"
		default: return "text-textLight"
	}
});
const borderColor = computed(() => {
	if (props.mode !== "outline") {
		return ""
	}
	switch (props.theme) {
		case "accent": return "border-accent"
		case "primary": return "border-primary"
		case "primaryLight": return "border-primaryLight"
		case "error": return "border-error"
		case "textLight": return "border-textLight"
		default: return "border-textDark"
	}
});
const backgroundColor = (props.mode === "fill"
	? props.theme
	: "transparent"
)


const dynamicStyle = [
	`bg-${backgroundColor} ${textColor.value}`,
	(props.mode === "outline"
		? `border-2 ${borderColor.value}`
		: ""
	),
	(props.goto?.length
		? "justify-start"
		: "justify-center"
	),
	(props.iconPosition === "right"
		? "flex-row-reverse"
		: "flex-row"
	),
]


const redirect = () => {
	if (props.goto?.length) {
		router.push(props.goto)
	}
}


onMounted(() => {
	if (props.goto === "#") {
		stateModel.value = "disabled"
	}
})
</script>

<template>
	<button
		class="px-5 rounded-md h-11 flex flex-row items-center"
		:type=type
		:disabled="stateModel !== 'enabled'"
		:class="[
			dynamicStyle,
			isDisabled ? 'contrast-50' : 'cursor-pointer hover:brightness-90'
		]"
		@click="redirect()"
	>
		<span class="material-symbols-rounded select-none">
			<div v-if="state === 'sync'" class="animate-spin">
				loop
			</div>
			<span v-else class="text-3xl!">
				{{icon}}
			</span>
		</span>

		<slot></slot>
	</button>
</template>
