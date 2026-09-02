<script setup lang="ts">
import { ref } from "vue"

const props = withDefaults(
	defineProps<{
		theme?: "dark" | "light"
		title?: string
	}>(),
	{
		theme: "dark",
	},
)

const visible = ref(false)

const toggle = () => {
	visible.value = !visible.value
}

const style = props.theme === "dark" ? "bg-primary text-textLight" : "bg-surface text-textDark"

defineExpose({ toggle })
</script>

<template>
	<section
		v-show="visible"
		class="absolute inset-0 w-full h-full bg-black/50 flex justify-center place-items-center"
		@click.self="toggle"
	>
		<div class="w-150 p-10 rounded-xl shadow-xl" :class="style">
			<header class="grid grid-cols-[min-content_1fr]">
				<button type="button" class="cursor-pointer" @click="toggle">
					<span class="material-symbols-rounded text-3xl!"> close </span>
				</button>

				<h2 class="text-2xl text-center font-semibold">
					{{ title }}
				</h2>
			</header>

			<br />

			<slot></slot>
		</div>
	</section>
</template>
