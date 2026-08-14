<script setup lang="ts">
interface Props {
	text?: boolean
	complete?: boolean
}

const props = defineProps<Props>()
</script>

<template>
	<div
		:class="[
			'box-border select-none',
			!props.complete ? 'flex justify-center items-center p-10' : 'w-1/2 p-16',
		]"
	>
		<img v-if="props.complete" src="/img/LogoCompleta.png" />
		<img v-else src="/img/Logo.png" class="drop-shadow-lg/80" />
		<div>
			<p
				v-if="props.text"
				class="text-3xl text-surface font-bold drop-shadow-[3px_3px_3px_rgba(0,0,0,1)]"
			>
				Organize seus sintomas.<br />
				Agilize sua consulta.
			</p>
		</div>
	</div>
</template>
