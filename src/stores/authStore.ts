import type { User as AuthUser } from "firebase/auth"
import Admin from "@/database/admin.model"
import Patient from "@/database/patient.model"
import Professional from "@/database/professional.model"
import User from "@/database/user.model"
import { defineStore } from "pinia"
import { ref, watch } from "vue"
import { until } from "@vueuse/core"

type arglessCallback = () => void
type AppUser = User | Patient | Professional | Admin
type userCallback = (data: AppUser) => void

export const useAuthStore = defineStore("auth", () => {
	const authUser = ref<AuthUser | null>(null)
	const appUser = ref<AppUser | null>(null)

	watch(
		authUser,
		async (newUser) => {
			if (newUser) {
				appUser.value = await User.get(newUser.uid)
			} else {
				appUser.value = null
			}
		},
		{ immediate: true },
	)

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

	const reloadUser = async () => {
		if (authUser.value) {
			appUser.value = await User.get(authUser.value.uid)
		}
	}

	return { user: authUser, userData: appUser, setUser, onReady, reloadUser }
})
