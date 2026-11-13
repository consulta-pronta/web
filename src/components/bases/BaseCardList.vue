<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
	defineProps<{
		isLoading?: boolean
		minWidth?: string
		maxWidth?: string
		skeletonCount?: number
	}>(),
	{
		isLoading: false,
		minWidth: "18em",
		maxWidth: "1fr",
		skeletonCount: 4,
	},
)

const thing = computed(() => 
	`sm:grid-cols-[repeat(auto-fill,minmax(${props.minWidth},${props.maxWidth}))]`
)
</script>

<template>
	<ul
		:style="{ '--min-w': minWidth, '--max-w': maxWidth  }" 
		class="grid gap-4 grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(var(--min-w),var(--max-w)))]"
		:class="thing"
	>
		<li
			v-if="isLoading"
			v-for="item in skeletonCount"
			:key="item"
			class="rounded-lg bg-surface/80 p-4 flex flex-col gap-3 animate-pulse"
		>
			<div class="h-5 w-2/5 rounded bg-primary/20"></div>
			<div class="h-4 w-3/5 rounded bg-primary/15"></div>
			<div class="h-4 w-full rounded bg-primary/15"></div>
			<div class="h-4 w-4/5 rounded bg-primary/15"></div>
		</li>

		<template v-else class="contents">
			<slot></slot>
		</template>
	</ul>
</template>
