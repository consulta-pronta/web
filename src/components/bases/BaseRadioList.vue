<script setup lang="ts">
type radioOption = {
	value: string
	label?: string
	icon?: string
}
defineProps<{
	options: radioOption[]
	name?: string
	legend?: string
}>()

const value = defineModel<string>("")
</script>

<template>
	<fieldset class="flex flex-col gap-2 text-textLight">
		<legend v-if="legend" class="mb-1">{{ legend }}</legend>
		<label
			v-for="option in options"
			:key="option.value"
			class="flex items-center gap-2 rounded-md p-3 cursor-pointer"
			:class="option.value === value ? 'focused' : 'bg-primaryDark'"
		>
			<input
				v-model="value"
				type="radio"
				:name="name"
				:value="option.value"
				required
				class="accent-primaryDark"
			/>
			<span class="material-symbols-rounded">{{ option.icon }}</span>
			{{ option.label }}
		</label>
	</fieldset>
</template>

<style scoped>
@reference "@/assets/main.css";

.focused {
	@apply bg-accent text-textDark;
} 
</style>