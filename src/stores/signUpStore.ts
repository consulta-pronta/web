import { defineStore } from "pinia"
import { computed, ref } from "vue"
import {
	createUserWithEmailAndPassword,
	sendEmailVerification,
	validatePassword,
	type User,
} from "firebase/auth"
import { auth } from "@/config/firebase"
import { createUser, createUserSignUpRequest, type ProfessionalData, type UserData } from "@/services/userService"
import type { UserType } from "@/components/ToggleUser.vue"
import { Timestamp } from "firebase/firestore"

export type PasswordRules = {
		minLength: boolean,
		hasNumber: boolean,
		hasLowercase: boolean,
		hasUppercase: boolean,
		match: boolean,
}
export const minPasswordLength = 8
export const maxPasswordLength = 4096

export const useSignUpStore = defineStore("sign_up", () => {
	const name = ref("")
	const email = ref("")
	const password = ref("")
	const confirmPassword = ref("")
	const phone = ref("")
	const cpf = ref("")
	const crm = ref("")
	const uf = ref("")
	const userType = ref<UserType>("paciente")

	const rules = computed(() => ({
		minLength: password.value.length >= minPasswordLength,
		hasNumber: /\d/.test(password.value),
		hasLowercase: /[a-z]/.test(password.value),
		hasUppercase: /[A-Z]/.test(password.value),
		match: password.value === confirmPassword.value && password.value.length > 0,
	} as PasswordRules))

	const isPasswordValid = computed(() => {
		return Object.values(rules.value).includes(false)
	})

	const clearForm = () => {
		name.value = ""
		email.value = ""
		password.value = ""
		confirmPassword.value = ""
		phone.value = ""
		cpf.value = ""
		crm.value = ""
		uf.value = ""
		userType.value = "paciente"
	}

	async function submitForm() {
		const passwordStatus = await validatePassword(auth, password.value)
		if (!passwordStatus.isValid) {
			throw Error("Invalid password.")
		}

		const userData = {
			name: name.value,
			email: email.value,
			phone: phone.value.replace(/[\(\)\-\s]/g, ""),
			cpf: cpf.value.replace(/[.\-\s]/g, ""),
			user_type: userType.value,
			created_at: Timestamp.now()
		} as UserData

		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email.value,
			password.value,
		)
		const user = userCredential.user
		
		await sendEmailVerification(user)
		console.log(`Successfuly created user of id ${user.uid}, see email sent to verify account.`)

		if (userType.value == "profissional") {
			createProfessional(user, {
				...userData,
				crm: crm.value,
				uf: uf.value
			} as ProfessionalData)
		} else {
			createPatient(user, userData)
		}
	}

	const createProfessional = async (user: User, userData: ProfessionalData) => {
		const id = await createUserSignUpRequest(user.uid, userData)
		
		console.log(`Successfuly requested signup of id ${id}`)
	}

	const createPatient = async (user: User, userData: UserData) => {
		await createUser(user.uid, userData)

		await sendEmailVerification(user)
	}

	return {
		email,
		password,
		confirmPassword,
		name,
		cpf,
		crm,
		uf,
		phone,
		userType,
		rules,
		isValid: isPasswordValid,
		clearForm,
		submitForm,
	}
})
