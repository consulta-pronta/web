<script setup lang="ts">
import Notification from "@/database/notification.model"
import { toBrazilianDate } from "@/utils"
import { defineProps, ref } from "vue"
import { useToast } from "vue-toastification"
import { useAuthStore } from "@/stores/authStore"

const authStore = useAuthStore()
const toast = useToast()

const props = defineProps<{
	notification: Notification
}>()

const emit = defineEmits<{
	(event: "update", uh: boolean): void
}>()

const showCard = ref(true)

const updateAccessedStatus = async (accessed: boolean) => {
	try {
		props.notification.accessed = accessed
		await authStore.onReady(async (user) => {
			await Notification.update(props.notification.id, { accessed }, {
				scope: { userId: user.id },
			})
		})
		emit("update", true)
		toast.success("Status da notificação atualizado com sucesso.")
	} catch (error) {
		props.notification.accessed = !accessed
		console.error("Failed to update notification access status.", error)
		toast.error("Não foi possível atualizar o status da notificação.")
	}
}

const deleteNotification = async (notificationId: string) => {
	try {
		showCard.value = false
		await authStore.onReady(async (user) => {
			await Notification.delete(notificationId, {
				scope: { userId: user.id },
			})
		})
		emit("update", true)
		toast.success("Notificação deletada com sucesso.")
	} catch (error) {
		showCard.value = true
		console.error("Failed to delete notification.", error)
		toast.error("Não foi possível deletar a notificação.")
	}
}
</script>

<template>
	<Transition name="card-out">
		<article
			v-if="showCard"
			class="rounded-md p-3 text-textDark hover:brightness-95"
			:class="notification.accessed ? 'bg-accent' : 'bg-surface'"
		>
			<div class="flex flex-row justify-between">
				<p>
					<span class="material-symbols-rounded text-sm!"> calendar_month </span>
					{{ toBrazilianDate(notification.created_at?.toDate()) }}
				</p>
				<button
					type="button"
					class="cursor-pointer text-primaryDark hover:brightness-90"
					@click="updateAccessedStatus(!notification.accessed)"
				>
					<span class="material-symbols-rounded"> {{ notification.accessed ? 'check_box' : 'check_box_outline_blank' }} </span>
				</button>
			</div>

			<div class="flex flex-row justify-between">
				<p class="font-bold twoliner">
					{{ notification.title ?? "Titulo" }}
				</p>
				<button
					type="button"
					class="cursor-pointer text-primaryDark hover:brightness-90"
					@click="deleteNotification(notification.id)"
				>
					<span class="material-symbols-rounded text-error"> delete </span>
				</button>
			</div>

			<p class="italic twoliner h-[2lh]">
				{{ notification.description ?? "Descrição AAAAAAAAAAAAAAAAAAAA" }}
			</p>
		</article>
	</Transition>
</template>

<style scoped>
@reference "@/assets/main.css";

.twoliner {
	@apply line-clamp-2 overflow-hidden text-ellipsis;
}

.card-out-enter-active,
.card-out-leave-active {
	transition: transform 200ms ease;
}

.card-out-enter-from,
.card-out-leave-to {
	transform: translateX(100%);
}
</style>
