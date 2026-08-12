<script setup lang="ts">
interface Props {
	type?: "text" | "password" | "email" | "number" | "tel"
	placeholder: string
	icon: string
}

const props = withDefaults(defineProps<Props>(), {
	type: "text",
})
</script>

<template>
	<div class="relative flex items-center">
		<span
			class="material-symbols-rounded text-textlight absolute left-3 text-xl pointer-events-none"
			>{{ icon }}</span
		>
		<input
			:type="props.type"
			:placeholder="props.placeholder"
			class="bg-primaryBlue px-5 rounded-md w-125.75 h-11.75 flex items-center text-textlight placeholder:text-textlight outline-none pl-10"
		/>
	</div>
</template>
