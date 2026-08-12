<script setup lang="ts">
interface Props {
	complete?: boolean
}

const props = defineProps<Props>()
</script>

<template>
	<div class="w-1/2 box-border p-16 select-none">
		<div class="mb-4">
			<img src="/img/LogoTemporaria.png" />
		</div>
		<div>
			<p v-if="props.status" class="text-3xl text-surface font-bold drop-shadow-[3px_3px_3px_rgba(0,0,0,1)]">
				Organize seus sintomas.<br />
				Agilize sua consulta.
			</p>
		</div>
	</div>
</template>
