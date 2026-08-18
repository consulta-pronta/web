import { defineStore } from "pinia"
import { computed, ref } from "vue"
import { createUserWithEmailAndPassword, sendEmailVerification, validatePassword } from "firebase/auth"
import { auth } from "@/config/firebase"
import { createUser } from "@/services/user.service"

export const minPasswordLength = 8
export const maxPasswordLength = 4096


export const useSignUpStore = defineStore("sign_up", () => {
	const name = ref("")
	const email = ref("")
	const password = ref("")
	const confirmPassword = ref("")
	const phone = ref("")
	const cpf = ref("")


	const rules = computed(() => ({
		minLength: password.value.length >= minPasswordLength,
		hasNumber: /\d/.test(password.value),
		hasLowercase: /[a-z]/.test(password.value),
		hasUppercase: /[A-Z]/.test(password.value),
		match: password.value === confirmPassword.value
			&& password.value.length > 0
	}))

	const isPasswordValid = computed(() => {
		return Object.values(rules.value).includes(false)
	})

	async function submitForm() {
		const passwordStatus = await validatePassword(auth, password.value)
		if (!passwordStatus.isValid) {
			throw Error("Invalid password.")
		}

		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email.value, password.value
		)
		const user = userCredential.user

		await createUser(user.uid, {
			name: name.value,
			email: email.value,
			phone: phone.value.replace(/[\(\)\-\s]/g, ""),
			cpf: cpf.value.replace(/[.\-\s]/g, ""),
		})

		console.log(`Successfuly created user of id ${user.uid}`)

		await sendEmailVerification(user)
	}


	return {
		email, password, confirmPassword,
		name, cpf, phone,
		rules, isValid: isPasswordValid,
		submitForm
	}
})