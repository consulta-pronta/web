<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue"

const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)


interface Props {
	w?: string
	h?: string
	rounded?: string | number
	circle?: boolean
	borderColor?: string
}

const props = withDefaults(defineProps<Props>(), {
	w: "19.75",
	h: "19.75",
	rounded: "full",
	circle: true,
	borderColor: "accent",
})

function handleFileSelect(event: Event) {
	const input = event.target as HTMLInputElement
	const file = input.files?.[0]

	if (!file) return

	if (previewUrl.value) {
		URL.revokeObjectURL(previewUrl.value)
	}

	selectedFile.value = file
	previewUrl.value = URL.createObjectURL(file)
}

onBeforeUnmount(() => {
	if (previewUrl.value) {
		URL.revokeObjectURL(previewUrl.value)
	}
})
</script>

<template>
	<article class="flex flex-row relative inline-block">
		<label :class="[`w-${props.w} h-${props.h} bg-primaryBlue rounded-${props.rounded} border-2 border-${props.borderColor} cursor-pointer overflow-hidden flex items-center justify-center`]">
			<input type="file" accept=".jpg,.jpeg,.png" class="hidden" @change="handleFileSelect" />

			<img
				v-if="previewUrl"
				:src="previewUrl"
				:alt="selectedFile?.name || 'Foto de perfil'"
				class="w-full h-full object-cover"
			/>

			<span v-else>
				<img src="/img/IconeUsuarioPadrao.jpg" />
			</span>
		</label>

		<div v-if="props.circle" class="absolute-right w-5.75 h-5.75 rounded-full bg-accent absolute bottom-0 right-0 flex items-center justify-center">
			<section class="material-symbols-rounded text-xl/10!">photo_camera</section>
		</div>
	</article>
</template>
