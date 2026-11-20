<script setup lang="ts">
import { computed, ref } from "vue"
import { useToast } from "vue-toastification"
import BaseInput from "@/components/bases/BaseInput.vue"
import BaseButton from "@/components/bases/BaseButton.vue"
import NotificationCard from "@/components/cards/NotificationCard.vue"
import { useAuthStore } from "@/stores/authStore"
import Notification from "@/database/notification.model"
import { searchDocuments } from "@/utils"

const authStore = useAuthStore()
const toast = useToast()

const notifications = ref<Notification[]>([])
const searchQuery = ref("")
const loading = ref(false)

const filteredNotifications = computed(
	() => searchDocuments(notifications.value, searchQuery.value) as Notification[],
)

const emptyMessage = computed(() => {
	if (loading.value) {
		return "Carregando notificações..."
	}

	return notifications.value.length === 0
		? "Nenhuma notificação por aqui."
		: "Nenhuma notificação encontrada."
})

const reset = async () => {
	loading.value = true

	try {
		await authStore.onReady(async (user) => {
			notifications.value = await Notification.getAllForUser(user.id)
		})
	} catch (error) {
		console.error("Failed to load notifications:", error)
		toast.error("Não foi possível carregar as notificações.")
	} finally {
		loading.value = false
	}
}

const markAllAsRead = async () => {
	try {
		await Notification.markAllAsAccessed(notifications.value)
	} catch (error) {
		console.error("Failed to mark notifications as read:", error)
		toast.error("Não foi possível marcar as notificações como lidas.")
	}
}

const readNotification = async (notification: Notification) => {
	try {
		await notification.markAsAccessed()
	} catch (error) {
		console.error("Failed to mark notification as read:", error)
		toast.error("Não foi possível marcar a notificação como lida.")
	}
}

const deleteNotification = async (notification: Notification) => {
	try {
		await notification.deleteNotification()
		notifications.value = notifications.value.filter((item) => item.id !== notification.id)
	} catch (error) {
		console.error("Failed to delete notification:", error)
		toast.error("Não foi possível apagar a notificação.")
	}
}

defineExpose({ reset })
</script>

<template>
	<section class="flex flex-col gap-4 z-48 max-h-[75vh] min-h-0">
		<header class="flex flex-row gap-2 justify-center">
			<BaseInput
				v-model="searchQuery"
				placeholder="Pesquisar"
				icon="search"
				class="place-self-center w-full md:w-70"
			/>
			<BaseButton icon="replay" :state="loading ? 'sync' : 'enabled'" @click="reset()" />
			<BaseButton icon="drafts" @click="markAllAsRead()" />
		</header>

		<ul
			v-if="filteredNotifications.length > 0"
			class="flex flex-col gap-4 flex-1 min-h-0 overflow-y-auto pr-2 scrollbar-hide"
		>
			<li v-for="notification in filteredNotifications" :key="notification.id">
				<NotificationCard
					:notification="notification"
					@read="readNotification(notification)"
					@delete="deleteNotification(notification)"
				/>
			</li>
		</ul>

		<p v-else class="text-center opacity-70">{{ emptyMessage }}</p>
	</section>
</template>
