<script setup lang="ts">
import BaseCardList from "@/components/bases/BaseCardList.vue"
import BaseInput from "@/components/bases/BaseInput.vue"
import { ref, computed } from "vue"
import Notification from "@/database/notification.model"
import { useAuthStore } from "@/stores/authStore"
import Patient from "@/database/patient.model"
import Professional from "@/database/professional.model"
import NotificationCard from "@/components/cards/NotificationCard.vue"
import { useToast } from "vue-toastification"

const authStore = useAuthStore()
const toast = useToast()
const currentUser = ref<Patient | Professional | null>(null)
const notifications = ref<Notification[]>([])
const loadingNotifications = ref(true)

const userType = computed(() => currentUser.value?.user_type)

authStore.onReady(async (user) => {
	try {
		if (!(user instanceof Patient || user instanceof Professional)) {
			return
		}
		currentUser.value = user

		notifications.value = await Notification.getAll({ scope: { userId: user.id } })
	} catch (error) {
		console.error("Failed to load notification page data.", error)
		toast.error("Não foi possível carregar os dados.")
	} finally {
		loadingNotifications.value = false
	}
})

const handleUpdate = async () => {
	loadingNotifications.value = true
	try {
		authStore.onReady(async (user) => {
			notifications.value = await Notification.getAll({ scope: { userId: user.id } })
		})
	} catch (error) {
		console.error("Failed to load notification page data.", error)
		toast.error("Não foi possível carregar os dados.")
	} finally {
		loadingNotifications.value = false
	}
}
</script>

<template>
	<BaseCardList
		v-if="!loadingNotifications"
		class="w-full flex flex-col gap-2"
	>
		<NotificationCard
			v-for="notification in notifications"
			:key="notification.id"
			:notification="notification"
			@update="handleUpdate"
		/>
	</BaseCardList>
</template>
