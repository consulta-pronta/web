import type { User as AuthUser } from "firebase/auth"
import { getUser, type User as AppUser } from "@/services/user.service"
import { defineStore } from "pinia"
import { ref, watch } from "vue"
import { until } from "@vueuse/core"

type arglessCallback = () => void
type userCallback = (data: AppUser) => void

export const useAuthStore = defineStore("auth", () => {
	const user = ref<AuthUser | null>(null)
	const userData = ref<AppUser | null>(null)

	watch(user, async (newUser) => {
		userData.value = newUser ? await getUser(newUser.uid) : null
	}, { immediate: true })


	const setUser = (firebaseUser: AuthUser | null) => {
		user.value = firebaseUser
	}

	const onReady = async (callback: arglessCallback | userCallback) => {
		await until(userData).toBeTruthy()
		
		if (callback.length === 1 && userData.value) {
			(callback as userCallback)(userData.value)
		} else {
			(callback as arglessCallback)()
		}
	}


	return { user, userData, setUser, onReady }
})