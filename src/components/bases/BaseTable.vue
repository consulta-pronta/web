<script setup lang="ts">
withDefaults(
	defineProps<{
		showMessage?: boolean
		message?: string
		isLoading?: boolean
		skeletonRows?: number
		columnCount?: number
	}>(),
	{
		showMessage: false,
		isLoading: false,
		skeletonRows: 6,
		columnCount: 4,
	},
)
</script>

<template>
	<div
		class="w-full max-h-[55vh] overflow-auto rounded-lg shadow-sm scrollbar-hide"
		:aria-busy="isLoading"
	>
		<table class="w-full min-w-xl text-textDark bg-surface">
			<thead class="sticky top-0 z-1 bg-primary text-textLight">
				<tr class="*:first:text-start">
					<slot name="header"></slot>
				</tr>
			</thead>
			<tbody class="*:border-t *:border-primaryDark/10 *:even:bg-primary/4">
				<tr
					v-if="isLoading"
					v-for="row in skeletonRows"
					:key="row"
					class="animate-pulse"
				>
					<td v-for="column in columnCount" :key="column" class="p-4">
						<div class="h-4 rounded bg-primary/15"></div>
					</td>
				</tr>
				
				<slot
					v-else-if="!showMessage"
				></slot>

				<tr v-else>
					<td
						:colspan="columnCount"
						class="p-4 text-center text-textDark/70"
					>
						{{ message }}
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>