import type { User as AuthUser } from "firebase/auth"
import { getUser, type User as AppUser } from "@/services/userService"
import { defineStore } from "pinia"
import { ref, watch } from "vue"
import { until } from "@vueuse/core"

type arglessCallback = () => void
type userCallback = (data: AppUser) => void

export const useAuthStore = defineStore("auth", () => {
	const authUser = ref<AuthUser | null>(null)
	const appUser = ref<AppUser | null>(null)

	watch(authUser, async (newUser) => {
		appUser.value = newUser ? await getUser(newUser.uid) : null
	}, { immediate: true })


	const setUser = (firebaseUser: AuthUser | null) => {
		authUser.value = firebaseUser
	}

	const onReady = async (callback: arglessCallback | userCallback) => {
		await until(appUser).toBeTruthy()
		
		if (callback.length === 1 && appUser.value) {
			(callback as userCallback)(appUser.value)
		} else {
			(callback as arglessCallback)()
		}
	}


	return { user: authUser, userData: appUser, setUser, onReady }
})