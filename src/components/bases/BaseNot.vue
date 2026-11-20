
<script setup lang="ts">
import { ref, Transition } from "vue"

const props = withDefaults(
	defineProps<{
		theme?: "dark" | "light"
		title?: string
	}>(),
	{
		theme: "dark",
	},
)

const toggle = () => {
	visible.value = !visible.value
}

const hide = () => {
	visible.value = false
}

const show = () => {
	visible.value = true
}

const visible = defineModel<boolean>("visible", {
	default: false,
})

const style = props.theme === "dark" ? "bg-primary text-textLight" : "bg-surface text-textDark"
const cssAnimationDuration = "300ms"

defineExpose({
	toggle,
	hide,
	show,
})
</script>

<template>
	<Transition name="dialog-bg">
		<div
			v-show="visible"
			class="size-full bg-black/50 fixed inset-0 z-67"
		></div>
	</Transition>

	<Teleport to="body">
		<Transition name="dialog">
			<section
				v-bind="$attrs"
				v-show="visible"
				class="fixed inset-0 z-67
				flex items-center justify-center
				p-3 sm:p-5
				lg:justify-start lg:pl-80 lg:pr-5"
				@click.self="hide"
			>
				<div
					class="w-full max-w-120
					h-[75dvh] max-h-[85dvh]
					min-h-0 p-4 sm:p-6 lg:p-10
					rounded-xl shadow-xl
					flex flex-col overflow-hidden"
					:class="style"
				>
					<slot></slot>
				</div>
			</section>
		</Transition>
	</Teleport>
</template>

<style scoped>
.dialog-enter-active,
.dialog-leave-active {
	transition: all v-bind(cssAnimationDuration) ease;
}

.dialog-enter-from,
.dialog-leave-to {
	opacity: 0;
	transform: translateX(-30%) scale(0.5);
}

.dialog-bg-enter-active,
.dialog-bg-leave-active {
	transition: all v-bind(cssAnimationDuration) ease;
}

.dialog-bg-enter-from,
.dialog-bg-leave-to {
	opacity: 0;
}
</style>
