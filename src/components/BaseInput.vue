<script setup lang="ts">
interface Props {
	type?: "text" | "password" | "email" | "number" | "tel" | "date" | "time"
	placeholder?: string
	icon?: string
	bgColor?: string
	w?: string | number
	textColor?: string
	placeholderColor?: string
	h?: string | number
}

const props = withDefaults(defineProps<Props>(), {
	type: "text",
	bgColor: "primaryBlue",
	w: "full",
	h: "11",
	textColor: "textlight",
	placeholderColor: "textlight",
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
			:type="props.type"
			:placeholder="props.placeholder"
			:class="[
				`bg-${props.bgColor}`,
				`px-5`,
				`rounded-md`,
				`w-${props.w}`,
				`h-${props.h}`,
				`flex items-center`,
				`text-${props.textColor}`,
				`placeholder:text-${props.placeholderColor}`,
				'outline-none pl-10',
			]"
		/>
	</div>
</template>
