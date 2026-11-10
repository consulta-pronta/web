<script setup lang="ts">
defineProps<{
	showMessage?: boolean
	message?: string
}>()
</script>

<template>
	<div class="w-full max-h-[55vh] overflow-auto rounded-lg shadow-sm scrollbar-hide">
		<table class="w-full min-w-xl text-textDark bg-surface">
			<thead class="sticky top-0 z-1 bg-primary text-textLight">
				<tr class="*:first:text-start">
					<slot name="header"></slot>
				</tr>
			</thead>
			<tbody>
				<template v-if="!showMessage">
					<slot></slot>
				</template>
				<tr v-else>
					<td colspan="4" class="p-4 text-center text-textDark/70">
						{{ message }}
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>