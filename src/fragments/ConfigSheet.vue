<script setup lang="ts">
import BaseIconButton from '@/components/bases/BaseIconButton.vue';


const changeFontSize = (size: "default" | "big" | "small") => {
	document.documentElement.style.fontSize = (() => {
		switch (size) {
			case "default":
				return "100%"
			case "big":
				return "112.5%"
			case "small":
				return "87.5%"
		}
	})()
}
</script>

<template>
	<div class="flex flex-row gap-6 items-center">
		Tamanho do Texto:
		<div class="flex flex-row gap-2">
			<BaseIconButton
				icon="text_decrease"
				theme="bright"
				mode="square"
				@click="changeFontSize('small')"
			/>
			<BaseIconButton
				icon="match_case"
				theme="bright"
				mode="square"
				@click="changeFontSize('default')"
			/>
			<BaseIconButton
				icon="text_increase"
				theme="bright"
				mode="square"
				@click="changeFontSize('big')"
			/>
		</div>
	</div>
</template>