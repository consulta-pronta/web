import { defineStore } from "pinia"
import { ref } from "vue"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/config/firebase"

export const useSignInStore = defineStore("sign_in", () => {
	const email = ref("")
	const password = ref("")

	function resetForm() {
		email.value = ""
		password.value = ""
	}

	async function signIn() {
		const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
		const user = userCredential.user
		console.log(`Successfuly logged in as user of id ${user.uid}`)
	}

	return { email, password, resetForm, signIn }
})
