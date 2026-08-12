<script setup lang="ts">
interface Props {
	type: string
	placeholder: string
	icon: string
	w?: string
}
const props = withDefaults(defineProps<Props>(), {
	w: "125.75",
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
			:class="[`bg-primaryBlue px-5 rounded-md`,
			`w-${props.w}`,
			`h-11 flex items-center text-textlight placeholder:text-textlight outline-none pl-10`]"
		/>
	</div>
</template>
