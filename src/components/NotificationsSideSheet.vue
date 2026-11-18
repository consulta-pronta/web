<script setup lang="ts">
import BaseCardList from "@/components/bases/BaseCardList.vue"
import BaseInput from "@/components/bases/BaseInput.vue"
import { ref, computed } from "vue"
import Notification from "@/database/notification.model"
import { useAuthStore } from "@/stores/authStore"
import Patient from "@/database/patient.model"
import Professional from "@/database/professional.model"

const authStore = useAuthStore()
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
</script>

<template>
	<BaseCardList
		v-if="!loadingNotifications"
		:items="notifications"
		item-key="id"
	>
	</BaseCardList>
</template>
