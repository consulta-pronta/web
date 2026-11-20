<script setup lang="ts">
import BaseButton from "@/components/bases/BaseButton.vue"
import type Notification from "@/database/notification.model"

defineProps<{
	notification: Notification
}>()

const emit = defineEmits<{
	(e: "read"): void
	(e: "delete"): void
}>()
</script>

<template>
	<article
		class="rounded-md p-3 bg-surface text-textDark hover:brightness-95"
		:class="{ 'opacity-60': notification.accessed }"
	>
		<span class="flex flex-row justify-between">
			<p class="font-bold twoliner">
				{{ notification.title }}
			</p>
			<span class="flex flex-row items-center gap-2">
				<input
					type="checkbox"
					aria-label="Marcar como lida"
					class="h-4 w-4 appearance-none rounded border border-background bg-transparent checked:bg-background checked:border-background"
					:checked="notification.accessed"
					:disabled="notification.accessed"
					@change="emit('read')"
				/>
				<BaseButton
					icon="delete"
					mode="transparent"
					theme="error"
					aria-label="Apagar notificação"
					@click="emit('delete')"
				/>
			</span>
		</span>

		<p class="twoliner py-2">
			{{ notification.description }}
		</p>
		<span>
			<p>
				<span class="material-symbols-rounded text-sm!"> calendar_month </span>
				{{ notification.getCreatedAtString() }}
			</p>
		</span>
	</article>
</template>
