<script setup lang="ts">
import { computed, onMounted } from "vue";

interface BaseCardCheckProps {
	type?: "checkbox" | "radio"
	onfocus?: "light" | "dark"
	radiogroup?: string
	disabled?: boolean
	default?: boolean
}

const props = withDefaults(
	defineProps<BaseCardCheckProps>(),
	{
		type: "checkbox",
		onfocus: "light",
	},
)

const value = defineModel<boolean>()

const checkedStyle = computed(() =>
	props.onfocus === "light"
		? "bg-accent! text-primaryDark!"
		: "bg-primary! text-primaryLight!"
)

onMounted(() => {
	value.value = props.default
})
</script>

<template>
	<label
		class="flex items-center gap-3 cursor-pointer rounded-md bg-surface p-3 text-textDark"
		:class="value ? checkedStyle : ''"
	>
		<input
			v-model="value"
			:type="type"
			:name="radiogroup"
			:disabled="disabled"
			:class="onfocus === 'light' ? 'accent-primaryDark' : 'accent-primaryLight'"
		/>
		<span class="select-none">
			<slot></slot>
		</span>
	</label>
</template>